"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function MyRequestsPage() {
  useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/requests"
      );

      const data = await res.json();
      setRequests(data);
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

    alert("Revision Accepted ✅");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          My Requests
        </h1>


        {requests.length === 0 && (
          <p className="text-center text-gray-500">
            No requests yet
          </p>
        )}

        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white p-6 rounded-xl shadow-md space-y-3"
          >
            <p><strong>ID:</strong> {req.id}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  req.status === "UNDER_REVIEW"
                    ? "bg-yellow-100 text-yellow-700"
                    : req.status === "REVISION_SENT"
                    ? "bg-blue-100 text-blue-700"
                    : req.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {req.status}
              </span>
            </p>

            {req.status === "REVISION_SENT" && (
              <button
                onClick={() => handleAccept(req.id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Accept Revision
              </button>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}