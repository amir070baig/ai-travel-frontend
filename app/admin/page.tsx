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
    await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/reject",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      }
    );

    alert("Rejected ❌");
  };

  const handleRevision = async (requestId: string) => {
    await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/revision",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      }
    );

    alert("Revision Sent ✏️");
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Admin Dashboard
        </h1>

        <div className="space-y-4">
          {requests.length === 0 && (
            <p className="text-center text-gray-500">
              No requests yet
            </p>
          )}

          {Array.isArray(requests) && requests.map((req) => (
            <div
              key={req.id}
              className="bg-white p-6 rounded-xl shadow-md space-y-3"
            >
              <p><strong>Request ID:</strong> {req.id}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                  {req.status}
                </span>
              </p>

              <h2 className="text-2xl font-bold mt-10">Bookings</h2>

                {bookings.length === 0 && (
                  <p className="text-gray-500">No bookings yet</p>
                )}

                {bookings.map((b) => (
                  <div key={b.id} className="bg-white p-4 rounded shadow mt-4">
                    <p><strong>User:</strong> {b.user?.email}</p>
                    <p><strong>Status:</strong> {b.status}</p>
                    <p><strong>Amount:</strong> ₹{b.advanceAmount}</p>
                  </div>
                ))}
                
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

      </div>
    </div>
  );
}