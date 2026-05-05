"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function MyRequestsPage() {
  useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setRequests([]);
          setBookings([]);
          return;
        }

        // ✅ REQUESTS
        const reqRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        // 🔥 BOOKINGS
        const bookRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/bookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const bookData = await bookRes.json();
        setBookings(Array.isArray(bookData) ? bookData : []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (requestId: string) => {
    await fetch(
      "https://ai-travel-backend-production.up.railway.app/requests/accept",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      }
    );

    setMessage("Request submitted ✅ Track it in My Requests page");
  };

  
  const handleRejectRevision = async (requestId: string) => {
    const token = localStorage.getItem("token");

    await fetch(
      "https://ai-travel-backend-production.up.railway.app/requests/reject-revision",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId }),
      }
    );

    setMessage("Revision rejected ❌");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          My Requests
        </h1>


        {requests.length === 0 && (
          <p className="text-center text-gray-500">
            No requests yet. Start by generating your first trip!
          </p>
        )}

        {Array.isArray(requests) && requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-6 rounded-xl shadow-md space-y-3"
          >
            
            <p className="text-center text-gray-500 text-sm">
              Track your travel requests and updates here
            </p>
            <p className="text-sm text-gray-500">
              Request #{req.id.slice(0, 6)}
            </p>

            <p className="font-semibold">
              Status:{" "}
              <span className="text-blue-600">
                {req.status.replace("_", " ")}
              </span>
            </p>

            {req.itinerary?.contentJson && (
              <div className="bg-gray-50 border p-3 rounded mt-2">
                <strong>Your Itinerary:</strong>
                <pre className="whitespace-pre-wrap text-sm mt-1">
                  {req.itinerary.contentJson}
                </pre>
              </div>
            )}

            
            {req.revisionMessage && (
              <p className="text-blue-600">
                <strong>Admin Note:</strong> {req.revisionMessage}
              </p>
            )}
            {req.status === "REVISION_SENT" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(req.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Accept Revision
                </button>

                <button
                  onClick={() => handleRejectRevision(req.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject Revision
                </button>
              </div>
            )}
            {message && (
              <p className="text-center text-green-600 mt-4">
                {message}
              </p>
            )}
          </div>
          
        ))}

      </div>

      <h2 className="text-2xl font-bold mt-10 text-center">
        My Bookings
      </h2>

      {bookings.length === 0 && (
        <p className="text-center text-gray-500">
          No bookings yet
        </p>
      )}

      {bookings.map((b) => (
        <div
          key={b.id}
          className="bg-white p-6 rounded-xl shadow-md space-y-3"
        >
          <p className="text-xs text-gray-500">
            {b.tour ? "Pre-built Tour" : "Custom AI Trip"}
          </p>

          {b.tour && (
            <>
              <p><strong>Tour:</strong> {b.tour.title}</p>
              <p className="text-gray-600">{b.tour.description}</p>
            </>
          )}

          {b.itinerary && (
            <pre className="text-sm bg-gray-50 p-2 rounded">
              {b.itinerary.contentJson}
            </pre>
          )}

          <p><strong>Amount:</strong> ₹{b.advanceAmount}</p>
          <p><strong>Status:</strong> {b.status}</p>
        </div>
      ))}
    </div>
  );
}