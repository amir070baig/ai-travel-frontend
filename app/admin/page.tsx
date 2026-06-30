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
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [tourForm, setTourForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    gallery:"",
    duration: "",
    pickupPoint: "",
    pickupTime: "",
    availabilityNote: "",
    highlights: "",
    itinerary:"",
    faq:"",
    inclusions: "",
    exclusions: "",
  });
  const [editingTourId, setEditingTourId] = useState("");
  const [expandedApproved, setExpandedApproved] = useState<string[]>([]);

  useEffect(() => {

    requests.forEach((req) => {

      if (!adminMessages[req.id]) {
        fetchAdminMessages(req.id);
      }

    });

  }, [requests]);

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
        `${process.env.NEXT_PUBLIC_API_URL}/tours/admin/all`,
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

  const fetchBookings = async () => {
    try {

      const bookingRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/bookings`,
        {
          credentials: "include",
        }
      );

      const bookingData =
        await bookingRes.json();

      setBookings(
        Array.isArray(bookingData)
          ? bookingData
          : []
      );

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

        await fetchBookings();

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

  const startAction = (key: string) => {
    if (actionLoading[key]) return false;

    setActionLoading((prev) => ({
      ...prev,
      [key]: true,
    }));

    return true;
  };

  const endAction = (key: string) => {
    setActionLoading((prev) => ({
      ...prev,
      [key]: false,
    }));
  };

  const handleApprove = async (requestId: string) => {

    const actionKey = `approve-${requestId}`;

    if (!startAction(actionKey)) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/approve`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId,
            finalPrice: packagePrices[requestId]
              ? Number(packagePrices[requestId])
              : undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Approval failed");
        return;
      }

      setRequests((prev: any) =>
        prev.map((r: any) =>
          r.id === requestId
            ? {
                ...r,
                status: "APPROVED",
                finalPrice: packagePrices[requestId]
                  ? Number(packagePrices[requestId])
                  : r.itinerary?.budget,
              }
            : r
        )
      );

    } catch (err) {
      console.error(err);
    } finally {
      endAction(actionKey);
    }
  };

  const handleReject = async (requestId: string) => {

    const actionKey = `reject-${requestId}`;

    if (!startAction(actionKey)) return;

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
    } finally {
      endAction(actionKey);
    }
  };

  const handleToggleTourAvailability = async (tourId: string) => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tours/${tourId}/toggle-availability`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Unable to update tour."
        );

        return;

      }

      await fetchTours();

    } catch (err) {

      console.error(err);

      alert("Something went wrong.");

    }

  };

  const handleAdminCancelBooking = async (
  bookingId: string
) => {

  const reason = prompt(
    "Reason for cancellation:"
  );

  if (!reason?.trim()) return;

  try {

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings/admin-cancel`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
          reason,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(
        data.message ||
        "Unable to cancel booking."
      );
      return;
    }

    alert("Booking cancelled successfully.");

    await fetchBookings();

  } catch (err) {

    console.error(err);

    alert("Something went wrong.");

  }

};

  const handleRevision = async (requestId: string) => {

    const actionKey = `revision-${requestId}`;

    if (!startAction(actionKey)) return;

    const message = revisionMessages[requestId];

    setRevisionMessages((prev) => ({
      ...prev,
      [requestId]: "",
    }));

    if (!message) {
      endAction(actionKey);
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

      await fetchAdminMessages(requestId);

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
    } finally {
      endAction(actionKey);
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

        itinerary: tourForm.itinerary
          .split("\n")
          .map((step) => step.trim())
          .filter(Boolean),

        faq: tourForm.faq
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),

        inclusions: tourForm.inclusions
          .split(",")
          .map((s) => s.trim()),

        exclusions: tourForm.exclusions
          .split(",")
          .map((s) => s.trim()),

        gallery: tourForm.gallery
          .split(",")
          .map((img) => img.trim())
          .filter((img) => img !== ""),
      };

      const url = editingTourId
        ? `${process.env.NEXT_PUBLIC_API_URL}/tours/${editingTourId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tours`;

      const method = editingTourId
        ? "PATCH"
        : "POST";

      console.log(bodyData);
      
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
        gallery: "",
        duration: "",
        pickupPoint: "",
        pickupTime: "",
        availabilityNote: "",
        highlights: "",
        itinerary:"",
        faq:"",
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

      gallery: Array.isArray(tour.gallery)
        ? tour.gallery.join(", ")
        : "",

      duration: tour.duration ?? "",
      pickupPoint: tour.pickupPoint ?? "",
      pickupTime: tour.pickupTime ?? "",
      availabilityNote: tour.availabilityNote ?? "",
      itinerary: Array.isArray(tour.itinerary)
        ? tour.itinerary.join("\n")
        : "",

      faq: Array.isArray(tour.faq)
        ? tour.faq.join("\n")
        : "",

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

    const actionKey = `reply-${requestId}`;

    if (!startAction(actionKey)) return;

    const message = adminReplies[requestId];

    if (!message?.trim()) {
      endAction(actionKey);
      return;
    }

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/message`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId,
            message,
          }),
        }
      );

      await res.json();

      await fetchAdminMessages(requestId);

      setAdminReplies((prev) => ({
        ...prev,
        [requestId]: "",
      }));

    } catch (err) {
      console.error(err);
    } finally {
      endAction(actionKey);
    }
  };

  const activeRequests = requests.filter(
    (req: any) =>
      req.status === "UNDER_REVIEW" ||
      req.status === "REVISION_SENT"
  );

  const approvedRequests = requests.filter(
    (req: any) =>
      req.status === "APPROVED"
  );

  const refundRequests = bookings.filter(
    (b: any) =>
      b.status === "REFUND_PENDING"
  );

  const toggleApproved = (id: string) => {

    setExpandedApproved((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );

  };

  const handleApproveRefund = async (bookingId: string) => {

    const confirmed = window.confirm(
      "Have you already issued the refund in Razorpay Dashboard?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/refund/process`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            bookingId,
            action: "APPROVE",
          }),
        }
      );

      if (!res.ok) {
        alert(
          "Failed to approve refund"
        );
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: "REFUNDED",
              }
            : b
        )
      );

      alert(
        "Refund marked as completed."
      );

    } catch (err) {

      console.error(err);

    }

  };

  const handleRejectRefund = async (bookingId: string) => {

    const confirmed = window.confirm(
      "Reject this refund request?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/refund/process`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            bookingId,
            action: "REJECT",
          }),
        }
      );

      if (!res.ok) {
        alert(
          "Failed to reject refund"
        );
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId
            ? {
                ...b,
                status: "CONFIRMED",
              }
            : b
        )
      );

      alert(
        "Refund request rejected."
      );

    } catch (err) {

      console.error(err);

    }

  };

  const handleCancelNoRefund = async (bookingId: string) => {

    const confirmed = window.confirm(
      "Cancel this booking without refund?"
    );

    if (!confirmed) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/refund/process`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            bookingId,
            action: "CANCEL_NO_REFUND",
          }),
        }
      );

      if (!res.ok) {
        alert(
          "Failed to cancel booking"
        );
        return;
      }

      await fetchBookings();

      alert(
        "Booking cancelled successfully."
      );

    } catch (err) {

      console.error(err);

    }

  };


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-10">

        <h1 className="text-3xl sm:text-4xl font-black text-center">
          Admin Dashboard
        </h1>

        {/* REVENUE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow border">
            <p className="text-gray-500 text-sm">
              Total Bookings
            </p>

            <h2 className="text-3xl font-black mt-2">
              {bookings.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow border">
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

          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow border">
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
        <div className="bg-white rounded-3xl shadow border p-4 sm:p-6 space-y-4">

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

          <textarea
            placeholder="Gallery Image URLs (comma separated)"
            value={tourForm.gallery}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                gallery: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full h-32"
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
            placeholder={`Tour Itinerary (one step per line)

          Example:
          03:00 AM|Pickup from hotel
          06:00 AM|Reach Taj Mahal
          08:30 AM|Breakfast
          10:00 AM|Visit Agra Fort`}
            value={tourForm.itinerary}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                itinerary: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full h-40"
          />

          <textarea
            placeholder={`Frequently Asked Questions (one FAQ per line)

          Example:
          Is pickup included?|Yes, complimentary pickup is available from hotels in Delhi NCR.
          Are monument tickets included?|No, unless specifically mentioned in the tour inclusions.
          Can I customize the itinerary?|Private tours can be customized before booking.`}
            value={tourForm.faq}
            onChange={(e) =>
              setTourForm({
                ...tourForm,
                faq: e.target.value,
              })
            }
            className="border p-3 rounded-2xl w-full h-40"
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
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-2xl"
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
              className="bg-white p-4 sm:p-5 rounded-2xl border shadow flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center"
            >
              <div>
                <h3 className="font-bold text-lg">
                  {tour.title}
                </h3>

                <p className="text-gray-500">
                  ₹{tour.price}
                </p>
              </div>

              <div className="flex items-center gap-2 mt-2">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    tour.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {tour.isActive ? "🟢 Open for Booking" : "🔴 Bookings Closed"}
                </span>

              </div>

              <p className="text-sm text-gray-600 mt-2">

                👥 {
                  tour.bookings.filter(
                    (booking: any) =>
                      booking.status !== "CANCELLED" &&
                      booking.status !== "REFUNDED"
                  ).length
                } Active Reservation{
                  tour.bookings.filter(
                    (booking: any) =>
                      booking.status !== "CANCELLED" &&
                      booking.status !== "REFUNDED"
                  ).length !== 1
                    ? "s"
                    : ""
                }

              </p>

              <div className="flex w-full sm:w-auto gap-3">
                <button
                  onClick={() => handleEditSelect(tour)}
                  className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-2 rounded-xl"
                >
                  Edit
                </button>
              </div>

              <button
                onClick={() =>
                  handleToggleTourAvailability(tour.id)
                }
                className={`px-4 py-2 rounded-xl text-white font-medium ${
                  tour.isActive
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {tour.isActive
                  ? "Close Bookings"
                  : "Open Bookings"}
              </button>
            </div>
          ))}
        </div>

        {/* REQUESTS */}
        <div className="space-y-4">

          <h2 className="text-2xl font-bold">
            AI Generated Requests
          </h2>

          {activeRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
            >

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
                <div>
                  <p className="font-bold text-lg text-blue-700">
                    {req.itinerary?.title}
                  </p>
                  <p className="font-semibold break-all">
                    {req.user?.email}
                  </p>

                  <p className="text-sm text-gray-500">
                    {req.itinerary?.days} Days · ₹{req.itinerary?.budget}
                  </p>
                </div>

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {req.status === "APPROVED" 
                      ? "PACKAGE READY FOR PAYMENT" 
                      : req.status}
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
              

              <div className="bg-gray-50 border rounded-2xl p-4 space-y-4">

                <h3 className="font-semibold">
                  Customer Conversation
                </h3>

                <div className="space-y-2 max-h-80 overflow-y-auto">

                  {(adminMessages[req.id] || []).map(
                    (msg: any) => (

                      <div
                        key={msg.id}
                        className={`p-3 rounded-xl text-sm wrap-break-wordword ${
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
                  disabled={actionLoading[`reply-${req.id}`]}
                  onClick={() => handleAdminReply(req.id)}
                  className="w-full sm:w-auto bg-blue-600 text-white px-4 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Reply
                </button>

              </div>

              {(req.status === "UNDER_REVIEW" || req.status === "REVISION_SENT") && (

                <div className="flex flex-col sm:flex-row gap-3">

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
                    disabled={actionLoading[`approve-${req.id}`]}
                    onClick={() => handleApprove(req.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>

                  <button
                    disabled={actionLoading[`reject-${req.id}`]}
                    onClick={() => handleReject(req.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>

                  <button
                    disabled={actionLoading[`revision-${req.id}`]}
                    onClick={() => handleRevision(req.id)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Request Revision
                  </button>

                </div>

              )}
            </div>
          ))}

          <div className="space-y-4 mt-10">
            <h2 className="text-2xl font-bold">
              Approved Packages
            </h2>

            {approvedRequests.length === 0 ? (
              <p className="text-gray-500">
                No approved packages yet.
              </p>
            ) : (
              approvedRequests.map((req: any) => {
                // 1. Find the related booking for this specific request
                const relatedBooking = bookings.find(
                  (b: any) => b.requestId === req.id
                );

                // 2. Return the JSX block explicitly
                return (
                  <div
                    key={req.id}
                    className="bg-green-50 border border-green-200 p-4 rounded-2xl"
                  >
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
                      <div>
                        <p className="font-bold text-lg text-blue-700">
                          {req.itinerary?.title}
                        </p>
                        <p className="font-semibold break-all">
                          {req.user?.email}
                        </p>
                        <p className="text-sm text-gray-600">
                          {req.itinerary?.days} Days
                        </p>
                      </div>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {relatedBooking?.paymentStatus === "PAID"
                          ? "ADVANCE PAYMENT RECEIVED ✅"
                          : "AWAITING CUSTOMER PAYMENT 💳"}
                      </span>
                    </div>

                    {req.finalPrice && (
                      <div className="mt-3">
                        <p>
                          <strong>Final Package Price:</strong> ₹{req.finalPrice}
                        </p>
                      </div>
                    )}

                    

                    <button
                      onClick={() => toggleApproved(req.id)}
                      className="mt-3 text-blue-600 text-sm font-semibold"
                    >
                      {expandedApproved.includes(req.id)
                        ? "Hide Details"
                        : "View Details"}
                    </button>

                    {expandedApproved.includes(req.id) && (
                      <div className="mt-4 border-t pt-4">
                        {relatedBooking && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">

                            <h4 className="font-semibold mb-2">
                              Booking Information
                            </h4>

                            <p>
                              <strong>Final Package Price:</strong>
                              ₹{req.finalPrice}
                            </p>

                            <p>
                              <strong>
                                {relatedBooking.paymentStatus === "PAID"
                                  ? "Advance Paid:"
                                  : "Advance Due:"}
                              </strong>

                              ₹{relatedBooking.advanceAmount}
                            </p>

                            <p>
                              <strong>Payment Status:</strong>{" "}

                              {relatedBooking.paymentStatus === "PAID"
                                ? "PAID ✅"
                                : "PENDING PAYMENT"}
                            </p>

                            <p>
                              <strong>Travel Date:</strong>{" "}

                              {relatedBooking.travelDate
                                ? new Date(
                                    relatedBooking.travelDate
                                  ).toLocaleDateString()
                                : "Not Selected"}
                            </p>

                          </div>
                        )}
                        <p>Days: {req.itinerary?.days}</p>
                        <p>Budget: {req.itinerary?.budget}</p>
                        

                        {req.itinerary?.contentJson && (
                          <div className="mt-4 bg-gray-50 border rounded-xl p-4">
                            <h4 className="font-semibold mb-3">
                              Full Itinerary
                            </h4>
                            {req.itinerary.contentJson
                              .replace(/\*/g, "")
                              .split("\n")
                              .filter((line: string) => line.trim() !== "")
                              .map((line: string, i: number) => (
                                <div
                                  key={i}
                                  className="bg-white border rounded-lg p-2 mb-2"
                                >
                                  <p className="text-sm whitespace-pre-wrap">
                                    {line}
                                  </p>
                                </div>
                              ))}
                          </div>
                        )}

                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">
                            Conversation History
                          </h4>
                          <div className="bg-gray-50 border rounded-xl p-4 space-y-2">
                            {(adminMessages[req.id] || []).map(
                              (msg: any) => (
                                <div
                                  key={msg.id}
                                  className={`p-3 rounded-xl text-sm wrap-break-word ${
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
                                  <p>{msg.message}</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* REFUND REQUESTS */}

        <div className="space-y-4">

          <h2 className="text-2xl font-bold text-red-600">
            Refund Requests
          </h2>

          {refundRequests.length === 0 ? (

            <div className="bg-white p-6 rounded-2xl border">
              No refund requests.
            </div>

          ) : (

            refundRequests.map((b: any) => (

              <div
                key={b.id}
                className="bg-white border shadow rounded-2xl p-6 space-y-4"
              >

                <div className="flex flex-col lg:flex-row lg:justify-between gap-4">

                  <div>

                    <h3 className="font-bold text-lg">
                      {b.tour?.title ||
                        "AI Custom Trip"}
                    </h3>

                    <p className="text-gray-500">
                      {b.user?.email}
                    </p>

                    <p>
                      Travel Date:{" "}
                      {b.travelDate
                        ? new Date(
                            b.travelDate
                          ).toLocaleDateString()
                        : "Not selected"}
                    </p>

                  </div>

                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold h-fit">
                    REFUND_PENDING
                  </div>

                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">

                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">
                      Advance Paid
                    </p>

                    <p className="font-bold">
                      ₹{b.advanceAmount}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">
                      Refund %
                    </p>

                    <p className="font-bold">
                      {b.refundPercentage ?? 0}%
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">
                      Refund Amount
                    </p>

                    <p className="font-bold">
                      ₹{b.refundAmount ?? 0}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl">
                    <p className="text-xs text-gray-500">
                      Payment ID
                    </p>

                    <p className="font-bold break-all">
                      {b.paymentId || "-"}
                    </p>
                  </div>

                </div>

                <div className="flex flex-wrap gap-3">

                  {(b.refundAmount ?? 0) > 0 ? (

                    <button
                      onClick={() =>
                        handleApproveRefund(
                          b.id
                        )
                      }
                      className="bg-green-600 text-white px-4 py-2 rounded-xl"
                    >
                      Mark Refunded
                    </button>

                  ) : (

                    <button
                      onClick={() =>
                        handleCancelNoRefund(
                          b.id
                        )
                      }
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl"
                    >
                      Cancel Booking (No Refund)
                    </button>

                  )}

                  <button
                    onClick={() =>
                      handleRejectRefund(
                        b.id
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded-xl"
                  >
                    Reject Request
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

        {/* BOOKINGS */}
        <div className="space-y-4">

          <h2 className="text-2xl font-bold">
            User Bookings
          </h2>

          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 sm:p-6 rounded-2xl border shadow-sm space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
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
                  {!b.tourId && (
                    <p>
                      <strong>Booking Type:</strong>{" "}
                      AI
                    </p>
                  )}

                  {!b.tourId && (
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        b.supplierBookingStarted
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      Supplier Booking:
                      {b.supplierBookingStarted
                        ? " STARTED"
                        : " NOT STARTED"}
                    </span>
                  )}

                  <p>
                    <strong>Travelers:</strong>{" "}
                    {b.travelers}
                  </p>

                  {b.request?.finalPrice && (
                    <p>
                      <strong>Final Package Price:</strong>{" "}
                      ₹{b.request.finalPrice}
                    </p>
                  )}

                  <p>
                    <strong>
                      {b.paymentStatus === "PAID"
                        ? "Advance Paid:"
                        : "Advance Due:"}
                    </strong>

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
                    : "AI"}
                </span>

              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  b.paymentStatus === "PAID"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Payment:{" "}
                {b.paymentStatus === "PAID"
                  ? "PAID ✅"
                  : "PENDING PAYMENT"}
              </span>

              <div className="flex flex-wrap gap-3">

                {/* PENDING */}
                {b.status === "PENDING" && (

                  <>
                    {/* <button
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

                        await fetchBookings();
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Confirm
                    </button> */}

                    <button
                      onClick={() =>
                        handleAdminCancelBooking(b.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel Trip
                    </button>


                    {/* Don't delete */}
                    {/* <button
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

                        await fetchBookings();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel
                    </button> */}
                  </>

                )}

                {/* CONFIRMED */}
                {b.status === "PENDING_PAYMENT" && (
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold">
                    Waiting For Customer Payment 💳
                  </div>
                )}
                {b.status === "CONFIRMED" &&
                 b.paymentStatus === "PAID" && (

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

                        await fetchBookings();
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Complete
                    </button>

                    {!b.tourId &&
                      !b.supplierBookingStarted && (

                        <button
                          onClick={async () => {

                            await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/bookings/supplier-booking`,
                              {
                                method: "PATCH",
                                credentials: "include",
                                headers: {
                                  "Content-Type":
                                    "application/json",
                                },
                                body: JSON.stringify({
                                  bookingId: b.id,
                                }),
                              }
                            );

                            await fetchBookings();

                          }}
                          className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm"
                        >
                          Start Supplier Booking
                        </button>

                      )}

                    
                    <button
                      onClick={() =>
                        handleAdminCancelBooking(b.id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel Trip
                    </button>

                    {/* DON'T DELETE */}
                    {/* <button
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

                        await fetchBookings();
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel
                    </button> */}
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
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold wrap-break-word">
                    {lead.name}
                  </h3>

                  <p className="text-gray-500">
                    {lead.email}
                  </p>

                  <p className="text-gray-500">
                    {lead.phone}
                  </p>
                </div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold w-fit">
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

              <div className="grid grid-cols-2 sm:flex gap-3">
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

                      // window.location.reload();
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
