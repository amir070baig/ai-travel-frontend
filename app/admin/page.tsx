"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  useAuth();

  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [packagePrices, setPackagePrices] = useState<Record<string, string>>({});
  const [revisionMessages, setRevisionMessages] = useState<Record<string, string>>({});
  const [adminMessages, setAdminMessages] =  useState<Record<string, any[]>>({});
  const [adminReplies, setAdminReplies] =  useState<Record<string, string>>({});
  const [tourForm, setTourForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    duration: "",
    pickupPoint: "",
    pickupTime: "",
    availabilityNote: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
  });
  const [editingTourId, setEditingTourId] = useState("");

  useEffect(() => {

    const verifyAdmin = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/verify`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {

          router.push("/login");

          return;
        }

        setIsAdmin(true);

      } catch (err) {

        console.error(err);

        router.push("/login");
      }
    };

    verifyAdmin();

  }, [router]);

  const fetchTours = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tours`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setTours(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      try {
        const reqRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/requests`,
          {
            credentials: "include",
          }
        );

        const reqData = await reqRes.json();

        setRequests(Array.isArray(reqData) ? reqData : []);

        const bookingRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`,
          {
            credentials: "include",
          }
        );

        const bookingData = await bookingRes.json();

        setBookings(Array.isArray(bookingData) ? bookingData : []);

        const leadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/leads`,
          {
            credentials: "include",
          }
        );

        const leadData = await leadRes.json();

        setLeads(Array.isArray(leadData) ? leadData : []);

        await fetchTours();
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [isAdmin]);

  const handleApprove = async (requestId: string) => {
    console.log(
      "APPROVE DATA",
      requestId,
      packagePrices[requestId]
    );
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId,
            finalPrice:
              Number(
                packagePrices[requestId]
              ),
          }),
        }
      );

      setRequests((prev: any) =>
        prev.map((r: any) =>
          r.id === requestId
            ? {
                ...r,
                status: "APPROVED",
              }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      setRequests((prev: any) =>
        prev.map((r: any) =>
          r.id === requestId
            ? {
                ...r,
                status: "REJECTED",
              }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevision = async (requestId: string) => {
    const message =
      revisionMessages[requestId];

    if (!message) {
      alert(
        "Please enter revision message"
      );
      return;
    }

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/revision`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId, message }),
        }
      );

      setRequests((prev: any) =>
        prev.map((r: any) =>
          r.id === requestId
            ? {
                ...r,
                status: "REVISION_SENT",
              }
            : r
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleTourSubmit = async () => {
    try {
      const bodyData = {
        ...tourForm,

        pickupTime: tourForm.pickupTime,
        availabilityNote: tourForm.availabilityNote,

        price: Number(tourForm.price),

        highlights: tourForm.highlights
          .split(",")
          .map((s) => s.trim()),

        inclusions: tourForm.inclusions
          .split(",")
          .map((s) => s.trim()),

        exclusions: tourForm.exclusions
          .split(",")
          .map((s) => s.trim()),

        gallery: [tourForm.imageUrl],
      };

      const url = editingTourId
        ? `${process.env.NEXT_PUBLIC_API_URL}/tours/${editingTourId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tours`;

      const method = editingTourId
        ? "PATCH"
        : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (!res.ok) {
        alert("Failed to save tour");
        return;
      }

      alert(
        editingTourId
          ? "Tour updated ✨"
          : "Tour created ✨"
      );

      setEditingTourId("");

      setTourForm({
        title: "",
        description: "",
        price: "",
        imageUrl: "",
        duration: "",
        pickupPoint: "",
        pickupTime: "",
        availabilityNote: "",
        highlights: "",
        inclusions: "",
        exclusions: "",
      });

      await fetchTours();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSelect = (tour: any) => {
    console.log("EDIT TOUR:", tour);
    setEditingTourId(tour.id);

    setTourForm({
      title: tour.title ?? "",
      description: tour.description ?? "",
      price: String(tour.price ?? ""),
      imageUrl: tour.imageUrl ?? "",

      duration: tour.duration ?? "",
      pickupPoint: tour.pickupPoint ?? "",
      pickupTime: tour.pickupTime ?? "",
      availabilityNote: tour.availabilityNote ?? "",

      highlights: Array.isArray(tour.highlights)
        ? tour.highlights.join(", ")
        : "",

      inclusions: Array.isArray(tour.inclusions)
        ? tour.inclusions.join(", ")
        : "",

      exclusions: Array.isArray(tour.exclusions)
        ? tour.exclusions.join(", ")
        : "",
    });
  };

  if (!isAdmin) return null;


  const fetchAdminMessages = async (requestId: string) => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/${requestId}/messages`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setAdminMessages((prev) => ({
        ...prev,
        [requestId]: data,
      }));

    } catch (err) {
      console.error(err);
    }

  };

  const handleAdminReply = async (requestId: string) => {

    const message =
      adminReplies[requestId];

    if (!message?.trim()) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/message`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            requestId,
            message,
          }),
        }
      );

      const newMessage =
        await res.json();

      setAdminMessages((prev) => ({
        ...prev,

        [requestId]: [
          ...(prev[requestId] || []),
          newMessage,
        ],
      }));

      setAdminReplies((prev) => ({
        ...prev,
        [requestId]: "",
      }));

    } catch (err) {
      console.error(err);
    }

  };


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">

        <h1 className="text-4xl font-black text-center">
          Admin Dashboard
        </h1>

        {/* REVENUE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-3xl p-6 shadow border">
            <p className="text-gray-500 text-sm">
              Total Bookings
            </p>

            <h2 className="text-3xl font-black mt-2">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow border">
            <p className="text-gray-500 text-sm">
              Paid Bookings
            </p>

            <h2 className="text-3xl font-black mt-2 text-green-600">
              {
                bookings.filter(
                  (b) => b.paymentStatus === "PAID"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow border">
            <p className="text-gray-500 text-sm">
              Revenue
            </p>

            <h2 className="text-3xl font-black mt-2 text-blue-600">
              ₹
              {
                bookings
                  .filter(
                    (b) => b.paymentStatus === "PAID"
                  )
                  .reduce(
                    (acc, b) =>
                      acc + b.advanceAmount,
                    0
                  )
              }
            </h2>
          </div>
        </div>

        {/* TOUR MANAGEMENT */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-4">

          <h2 className="text-3xl font-black">
            {editingTourId
              ? "Edit Tour"
              : "Tour Management"}
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Tour Title"
              value={tourForm.title}
              onChange={(e) =>
                setTourForm({
                  ...tourForm,
                  title: e.target.value,
                })
              }
              className="border p-3 rounded-2xl"
            />

            <input
              placeholder="Price"
              value={tourForm.price}
              onChange={(e) =>
                setTourForm({
                  ...tourForm,
                  price: e.target.value,
                })
              }
              className="border p-3 rounded-2xl"
            />
          </div>

          <textarea
            placeholder="Description"
            value={tourForm.description}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                description: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full h-32"
          />

          <input
            placeholder="Image URL"
            value={tourForm.imageUrl}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                imageUrl: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full"
          />

          <div className="grid md:grid-cols-2 gap-4">

            <input
              placeholder="Duration"
              value={tourForm.duration}
              onChange={(e) =>
                setTourForm({
                  ...tourForm,
                  duration: e.target.value,
                })
              }
              className="border p-3 rounded-2xl"
            />

            <input
              placeholder="Pickup Point"
              value={tourForm.pickupPoint}
              onChange={(e) =>
                setTourForm({
                  ...tourForm,
                  pickupPoint: e.target.value,
                })
              }
              className="border p-3 rounded-2xl"
            />

            <input
              placeholder="Pickup Time"
              value={tourForm.pickupTime}
              onChange={(e) =>
                setTourForm({
                  ...tourForm,
                  pickupTime: e.target.value,
                })
              }
              className="border p-3 rounded-2xl"
            />

          </div>

          <textarea
            placeholder="Highlights (comma separated)"
            value={tourForm.highlights}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                highlights: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full"
          />

          <textarea
            placeholder="Inclusions (comma separated)"
            value={tourForm.inclusions}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                inclusions: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full"
          />

          <textarea
            placeholder="Exclusions (comma separated)"
            value={tourForm.exclusions}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                exclusions: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full"
          />

          <textarea
            placeholder="Availability / Booking Notes"
            value={tourForm.availabilityNote}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                availabilityNote: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full h-28"
          />

          <button
            onClick={handleTourSubmit}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl"
          >
            {editingTourId
              ? "Update Tour"
              : "Create Tour"}
          </button>
        </div>

        {/* TOURS LIST */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            Existing Tours
          </h2>

          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white p-5 rounded-2xl border shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-bold text-lg">
                  {tour.title}
                </h3>

                <p className="text-gray-500">
                  ₹{tour.price}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEditSelect(tour)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* REQUESTS */}
        <div className="space-y-4">

          <h2 className="text-2xl font-bold">
            AI Generated Requests
          </h2>

          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            >

              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {req.user?.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    {req.itinerary?.days} Days · ₹{req.itinerary?.budget}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {req.status}
                </span>
              </div>

              <div className="bg-gray-50 border rounded-2xl p-4 space-y-3">
                {req.itinerary?.contentJson
                  ?.replace(/\*/g, "")
                  .split("\n")
                  .filter((line: string) => line.trim() !== "")
                  .map((line: string, i: number) => (
                    <div
                      key={i}
                      className="bg-white border rounded-xl p-3"
                    >
                      <p className="text-sm whitespace-pre-wrap">
                        {line}
                      </p>
                    </div>
                  ))}
              </div>

              {!adminMessages[req.id] &&
                fetchAdminMessages(req.id)}

              <div className="bg-gray-50 border rounded-2xl p-4 space-y-4">

                <h3 className="font-semibold">
                  Customer Conversation
                </h3>

                <div className="space-y-2">

                  {(adminMessages[req.id] || []).map(
                    (msg: any) => (

                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-sm ${
                          msg.senderType === "ADMIN"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >

                        <strong>
                          {msg.senderType === "ADMIN"
                            ? "Travel Team"
                            : "Customer"}
                        </strong>

                        <p>
                          {msg.message}
                        </p>

                      </div>

                    )
                  )}

                </div>

                <textarea
                  placeholder="Reply to customer..."

                  value={
                    adminReplies[req.id] || ""
                  }

                  onChange={(e) =>
                    setAdminReplies({
                      ...adminReplies,

                      [req.id]:
                        e.target.value,
                    })
                  }

                  className="w-full border rounded-xl p-3"
                />

                <button
                  onClick={() =>
                    handleAdminReply(
                      req.id
                    )
                  }

                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Send Reply
                </button>

              </div>

              {req.status === "UNDER_REVIEW" && (

                <div className="flex flex-wrap gap-3">

                  <input
                    type="text"
                    placeholder="Revision Message"

                    value={
                      revisionMessages[req.id] || ""
                    }

                    onChange={(e) =>
                      setRevisionMessages({
                        ...revisionMessages,
                        [req.id]: e.target.value,
                      })
                    }

                    className="border rounded p-2 w-full mb-2"
                  />

                  <input
                    type="number"
                    placeholder="Final Package Price"

                      value={packagePrices[req.id] || ""}

                      onChange={(e) =>
                        setPackagePrices({
                          ...packagePrices,
                          [req.id]: e.target.value,
                        })
                      }

                    className="border rounded p-2 w-full"
                  />
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => handleReject(req.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => handleRevision(req.id)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    Request Revision
                  </button>

                </div>

              )}
            </div>
          ))}
        </div>

        {/* BOOKINGS */}
        <div className="space-y-4">

          <h2 className="text-2xl font-bold">
            User Bookings
          </h2>

          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">
                    {b.tour?.title || "AI Custom Trip"}
                  </h3>

                  <p className="text-gray-500 text-sm">
                    {b.user?.email}
                  </p>

                  <p>
                    <strong>Travel Date:</strong>{" "}
                    {b.travelDate
                      ? new Date(
                          b.travelDate
                        ).toLocaleDateString()
                      : "Not selected"}
                  </p>

                  <p>
                    <strong>Travelers:</strong>{" "}
                    {b.travelers}
                  </p>

                  <p>
                    <strong>Advance Paid:</strong>{" "}
                    ₹{b.advanceAmount}
                  </p>
                </div>

                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {b.status}
                </span>
              </div>

              <div className="flex gap-2 flex-wrap">

                <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                  {b.tourId
                    ? "FIXED TOUR"
                    : "AI CONCIERGE"}
                </span>

              </div>

              <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                Payment:
                {b.paymentStatus}
              </span>

              <div className="flex flex-wrap gap-3">

                {/* PENDING */}
                {b.status === "PENDING" && (

                  <>
                    <button
                      onClick={async () => {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/bookings/status`,
                          {
                            credentials: "include",
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              bookingId: b.id,
                              status: "CONFIRMED",
                            }),
                          }
                        );

                        window.location.reload();
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/bookings/status`,
                          {
                            credentials: "include",
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              bookingId: b.id,
                              status: "CANCELLED",
                            }),
                          }
                        );

                        window.location.reload();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel
                    </button>
                  </>

                )}

                {/* CONFIRMED */}
                {b.status === "CONFIRMED" && (

                  <>
                    <button
                      onClick={async () => {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/bookings/status`,
                          {
                            credentials: "include",
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              bookingId: b.id,
                              status: "COMPLETED",
                            }),
                          }
                        );

                        window.location.reload();
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Complete
                    </button>

                    <button
                      onClick={async () => {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/bookings/status`,
                          {
                            credentials: "include",
                            method: "PATCH",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              bookingId: b.id,
                              status: "CANCELLED",
                            }),
                          }
                        );

                        window.location.reload();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel
                    </button>
                  </>

                )}

                {/* COMPLETED */}
                {b.status === "COMPLETED" && (
                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Trip Completed ✅
                  </div>
                )}

                {/* CANCELLED */}
                {b.status === "CANCELLED" && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                    Booking Cancelled ❌
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>

        {/* CRM LEADS */}
        <div className="space-y-4">

          <h2 className="text-2xl font-bold">
            CRM Leads
          </h2>

          {leads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-3xl border shadow p-6 space-y-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {lead.name}
                  </h3>

                  <p className="text-gray-500">
                    {lead.email}
                  </p>

                  <p className="text-gray-500">
                    {lead.phone}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {lead.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-gray-700 leading-relaxed">
                  {lead.message}
                </p>
              </div>

              <textarea
                placeholder="Internal notes..."
                defaultValue={lead.notes}
                id={`notes-${lead.id}`}
                className="border p-3 rounded-2xl w-full h-28"
              />

              <div className="flex flex-wrap gap-3">
                {[
                  "CONTACTED",
                  "INTERESTED",
                  "BOOKED",
                  "COMPLETED",
                  "LOST",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={async () => {
                      const notes = (
                        document.getElementById(
                          `notes-${lead.id}`
                        ) as HTMLTextAreaElement
                      )?.value;

                      await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/leads`,
                        {
                          credentials: "include",
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            leadId: lead.id,
                            status,
                            notes,
                          }),
                        }
                      );

                      window.location.reload();
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
