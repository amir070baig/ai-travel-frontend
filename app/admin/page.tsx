"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
  useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tours, setTours] = useState<any[]>([]);
  const [tourForm, setTourForm] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    duration: "",
    pickupPoint: "",
    highlights: "",
    inclusions: "",
    exclusions: "",
  });

  const [editingTourId, setEditingTourId] = useState("");


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role === "ADMIN") {
      setIsAdmin(true);
    } else {
      window.location.href = "/generate";
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ FETCH REQUESTS
        const reqRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/admin/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const reqData = await reqRes.json();
        console.log("ADMIN REQUESTS:", reqData); // ✅ ADD
        setRequests(Array.isArray(reqData) ? reqData : []);

        // ✅ FETCH BOOKINGS (THIS IS THE NEW PART)
        const bookingRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/admin/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const bookingData = await bookingRes.json();
        console.log("ADMIN BOOKINGS:", bookingData); // ✅ ADD
        setBookings(Array.isArray(bookingData) ? bookingData : []);
        const tourRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/tours"
        );

        const tourData = await tourRes.json();

        setTours(Array.isArray(tourData) ? tourData : []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestId }),
        }
      );

      // ✅ REFRESH FROM BACKEND (BEST APPROACH)
      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/admin/requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (requestId: string) => {
    const token = localStorage.getItem("token");

    await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/reject",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId }),
      }
    );

    // ✅ ADD THIS PART HERE
    const res = await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/requests",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);

    alert("Rejected ❌");
  };

  const handleRevision = async (requestId: string) => {
    const token = localStorage.getItem("token");

    const message = prompt("Enter revision message:");
    if (!message) return;

    await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/revision",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId, message }),
      }
    );

    // ✅ ADD THIS PART HERE
    const res = await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/requests",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);

    alert("Revision Sent ✏️");
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Admin Dashboard
        </h1>

        <div className="bg-white rounded-3xl shadow border p-6 space-y-4">

          <h2 className="text-3xl font-black">
            Tour Management
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

          <div className="space-y-3">

            <label className="font-medium">
              Upload Tour Image
            </label>

            <input
              type="file"

              onChange={async (e) => {

                const file =
                  e.target.files?.[0];

                if (!file) return;

                const formData =
                  new FormData();

                formData.append(
                  "image",
                  file
                );

                try {

                  const res = await fetch(
                    "https://ai-travel-backend-production.up.railway.app/upload",
                    {
                      method: "POST",
                      body: formData,
                    }
                  );

                  const data =
                    await res.json();

                  setTourForm({
                    ...tourForm,
                    imageUrl:
                      data.imageUrl,
                  });

                } catch (err) {

                  console.error(err);

                  alert(
                    "Image upload failed"
                  );

                }

              }}
              className="border p-3 rounded-2xl w-full"
            />

            {tourForm.imageUrl && (

              <img
                src={tourForm.imageUrl}
                className="w-full h-64 object-cover rounded-2xl"
              />

            )}

          </div>

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

          <button
            onClick={async () => {

              const payload = {
                ...tourForm,

                gallery: [tourForm.imageUrl],

                highlights:
                  tourForm.highlights
                    .split(","),

                inclusions:
                  tourForm.inclusions
                    .split(","),

                exclusions:
                  tourForm.exclusions
                    .split(","),
              };

              const url = editingTourId
                ? `https://ai-travel-backend-production.up.railway.app/tours/${editingTourId}`
                : `https://ai-travel-backend-production.up.railway.app/tours`;

              const method = editingTourId
                ? "PATCH"
                : "POST";

              await fetch(url, {
                method,

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify(payload),
              });

              window.location.reload();

            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl"
          >
            {editingTourId
              ? "Update Tour"
              : "Create Tour"}
          </button>

        </div>

        {/* ================= TOURS MANAGEMENT ================= */}

        <h2 className="text-2xl font-semibold mt-10 border-b pb-2">
          Manage Tours
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {Array.isArray(tours) && tours.map((tour: any) => (

            <div
              key={tour.id}
              className="bg-white rounded-3xl border shadow p-5 space-y-4"
            >

              <img
                src={tour.imageUrl}
                alt={tour.title}
                className="w-full h-52 object-cover rounded-2xl"
              />

              <div>

                <h3 className="text-2xl font-bold">
                  {tour.title}
                </h3>

                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {tour.description}
                </p>

              </div>

              <div className="flex justify-between items-center">

                <p className="text-2xl font-black text-blue-600">
                  ₹{tour.price}
                </p>

                <p className="text-sm text-gray-500">
                  {tour.duration}
                </p>

              </div>

              {/* EDIT DELETE BUTTONS */}

              <div className="flex gap-3 pt-4">

                <button
                  onClick={() => {

                    setEditingTourId(tour.id);

                    setTourForm({
                      title: tour.title,
                      description: tour.description,
                      price: tour.price,
                      imageUrl: tour.imageUrl || "",
                      duration: tour.duration || "",
                      pickupPoint: tour.pickupPoint || "",
                      highlights:
                        tour.highlights.join(","),

                      inclusions:
                        tour.inclusions.join(","),

                      exclusions:
                        tour.exclusions.join(","),
                    });

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });

                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {

                    const confirmDelete =
                      confirm(
                        "Delete this tour?"
                      );

                    if (!confirmDelete) return;

                    await fetch(
                      `https://ai-travel-backend-production.up.railway.app/tours/${tour.id}`,
                      {
                        method: "DELETE",
                      }
                    );

                    window.location.reload();

                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

        {/* ================= REQUESTS SECTION ================= */}
        <h2 className="text-2xl font-semibold mt-6 border-b pb-2">
            AI Generated Requests
        </h2>

        <div className="space-y-4">
          {Array.isArray(requests) && requests.length === 0 && (
            <p className="text-center text-gray-500">
              No requests yet
            </p>
          )}

          {Array.isArray(requests) && requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-xl shadow-md space-y-3"
            >
              <p className="text-xs text-gray-500">Type: AI Request</p>
              <p><strong>Request ID:</strong> {req.id}</p>
              <p><strong>User:</strong> {req.user?.email}</p>
              <p><strong>City:</strong> {req.itinerary?.city}</p>
              <p><strong>Days:</strong> {req.itinerary?.days}</p>
              <p><strong>Budget:</strong> {req.itinerary?.budget}</p>

              <div className="bg-gray-50 border p-4 rounded-md">
                <strong>Itinerary:</strong>
                {req.itinerary?.contentJson ? (
                  <pre className="whitespace-pre-wrap text-sm mt-2">
                    {req.itinerary.contentJson}
                  </pre>
                ) : (
                  <p className="text-gray-400 mt-2">
                    Itinerary not available
                  </p>
                )}
              </div>
              
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    req.status === "UNDER_REVIEW"
                      ? "bg-yellow-100 text-yellow-700"
                      : req.status === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : req.status === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {req.status}
                </span>
                {req.revisionStatus === "REJECTED_BY_USER" && (
                  <p className="text-red-600 mt-2">Rejected by user</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
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
            </div>
          ))}
        </div>

          {/* Revenue Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

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

        {/* ================= BOOKINGS SECTION (NEW) ================= */}
        <h2 className="text-2xl font-semibold mt-10 border-b pb-2">
            User Bookings
        </h2>

        <div className="space-y-4">
          {Array.isArray(bookings) && bookings.length === 0 && (
            <p className="text-center text-gray-500">
              No bookings found
            </p>
          )}

          {Array.isArray(bookings) && bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white p-6 rounded-xl shadow-md space-y-3"
            >
              <p className="text-xs text-gray-500">Type: Booking</p>
              <p><strong>Booking ID:</strong> {b.id}</p>
              <p><strong>Status:</strong> <span className="font-semibold">{b.status}</span></p>

              {/* Your Action Buttons Code Added Below */}
              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  onClick={async () => {
                    await fetch(
                      "https://ai-travel-backend-production.up.railway.app/bookings/status",
                      {
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
                      "https://ai-travel-backend-production.up.railway.app/bookings/status",
                      {
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
                      "https://ai-travel-backend-production.up.railway.app/bookings/status",
                      {
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
              </div>
              {/* End of your action buttons code */}

              <a
                href={`https://wa.me/917599921173?text=${encodeURIComponent(
                  `Hi ${b.user?.email}, regarding your booking with AI Travel Planner.`
                )}`}
                target="_blank"
                className="inline-block bg-green-500 text-white px-4 py-2 rounded-xl text-sm"
              >
                Contact Customer
              </a>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
