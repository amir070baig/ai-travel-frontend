"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function MyRequestsPage() {
  useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          setRequests([]);
          return;
        }

        const res = await fetch(
          "https://ai-travel-backend-production.up.railway.app/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log("REQUESTS API:", data);

        // ✅ GUARANTEED SAFE
        if (!res.ok || !Array.isArray(data)) {
          setRequests([]);
          return;
        }

        setRequests(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setRequests([]);
      }
    };

    fetchRequests();
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

            <p className="text-gray-600 text-sm">
              {req.itinerary?.contentJson || "Your travel plan"}
            </p>

            <p className="text-sm text-gray-600">
              {req.itinerary?.contentJson || "No itinerary details available"}
            </p>
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
                {message && (
                  <p className="text-green-600 text-center mt-4">
                    {message}
                  </p>
                )}

                {/* ✅ ADD THIS */}
                <button
                  onClick={() => handleRejectRevision(req.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject Revision
                </button>
                {message && (
                  <p className="text-green-600 text-center mt-4">
                    {message}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}