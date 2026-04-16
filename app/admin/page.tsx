"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function AdminPage() {
  useAuth();
  
  const token = localStorage.getItem("token");
  const [requests, setRequests] = useState<any[]>([]);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "ADMIN") {
      alert("Access denied");
      window.location.href = "/generate";
    }
  }, []);


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

  const handleApprove = async (requestId: string) => {
    await fetch(
      "https://ai-travel-backend-production.up.railway.app/admin/approve",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      }
    );

    alert("Approved ✅");
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

          {requests.map((req) => (
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