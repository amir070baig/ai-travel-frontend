"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
  useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);


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

                {req.revisionStatus === "REJECTED_BY_USER" && (
                  <p className="text-red-600">
                    User rejected the revision ❌
                  </p>
                )}
              </div>
              
              <p>
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
              </p>

                
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(req.id)}
                  disabled={req.status !== "UNDER_REVIEW"}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleRevision(req.id)}
                  disabled={req.status !== "UNDER_REVIEW"}
                  className="bg-yellow-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Send Revision
                </button>

                <button
                  onClick={() => handleReject(req.id)}
                  disabled={req.status !== "UNDER_REVIEW"}
                  className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
        <h2 className="text-2xl font-semibold mt-12 border-b pb-2">
          Confirmed Bookings
        </h2>

              {bookings.length === 0 && (
                <p className="text-gray-500">No bookings yet</p>
              )}

              <div className="space-y-4 mt-4">
                {bookings.map((b) => (
                  <div key={b.id} className="bg-white p-4 rounded shadow mt-4">
                    <p className="text-xs text-gray-500">Pre-built Tour</p>

                      <p><strong>User:</strong> {b.user?.email}</p>

                      {/* 🔥 SHOW TOUR TITLE */}
                      <p><strong>Tour:</strong> {b.tour?.title || "Unknown Tour"}</p>

                      {/* 🔥 SHOW DESCRIPTION */}
                      <p className="text-gray-600 text-sm">
                        {b.tour?.description}
                      </p>

                      <p><strong>Amount:</strong> ₹{b.advanceAmount}</p>

                      <p><strong>Status:</strong> {b.status}</p>
                  </div>
                ))}
              </div>
      </div>
    </div>
  );
}