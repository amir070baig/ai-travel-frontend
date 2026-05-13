"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function MyRequestsPage() {
  useAuth();
  
  const [requests, setRequests] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [savedItineraries, setSavedItineraries] = useState<any[]>([]);
  const [expandedTrips, setExpandedTrips] = useState<string[]>([]);

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

        const savedRes = await fetch(
          "https://ai-travel-backend-production.up.railway.app/itineraries/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const savedData = await savedRes.json();

        setSavedItineraries(Array.isArray(savedData) ? savedData : []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/requests/accept",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!res.ok) throw new Error();

      // ✅ UPDATE UI STATE IMMEDIATELY
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: "APPROVED" }
            : req
        )
      );

      setMessage("Revision accepted ✅");

    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  };

  
  const handleRejectRevision = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
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

      if (!res.ok) throw new Error();

      // ✅ UPDATE UI STATE
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? { ...req, status: "UNDER_REVIEW" }
            : req
        )
      );

      setMessage("Revision rejected ❌");

    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  };

  const activeRequests = requests.filter(
    (req) => req.status !== "APPROVED"
  );

  const handlePayment = async (bookingId: string) => {
    try {

      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookingId,
          }),
        }
      );

      const order = await res.json();

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",

        amount: order.amount,

        currency: order.currency,

        name: "AI Travel App",

        description: "Advance Booking Payment",

        order_id: order.id,

        handler: async function (response: any) {

          const verifyRes = await fetch(
            "https://ai-travel-backend-production.up.railway.app/payments/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                ...response,
                bookingId,
              }),
            }
          );

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert("Payment Successful ✅");

            window.location.reload();
          }

        },

        theme: {
          color: "#2563eb",
        },
      };

      const razorpay = new (window as any).Razorpay(options);

      razorpay.open();

    } catch (err) {
      console.error(err);

      alert("Payment failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold text-center">
          Travel Dashboard
        </h1>

        <p className="text-center text-gray-500">
          Monitor your AI trips, saved plans, and bookings
        </p>


        <h2 className="text-2xl font-bold mt-10 text-center">
          Active Requests
        </h2>

        {activeRequests.length > 0 && (
          <p className="text-center text-gray-500 text-sm mb-4">
            Trips currently under review by our travel experts
          </p>
        )}

        {activeRequests.length === 0 && (
          <p className="text-center text-gray-500">
            No active requests right now. Saved itineraries can be submitted for review anytime.
          </p>
        )}

        {activeRequests.map((req, index) => (
          <div
            key={req.id}
            className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
          >

            <p>Active Request #{index + 1}</p>
            <p className="font-semibold">
              Status:{" "}
              <span className="text-blue-600">
                {req.status.replace("_", " ")}
              </span>
            </p>

            {req.itinerary?.contentJson && (
              <div className="bg-gray-50 border p-3 rounded mt-2">
                <strong>Your Itinerary:</strong>
                <div className="space-y-3 mt-3">
                {req.itinerary.contentJson
                  .replace(/\*/g, "")
                  .split("\n")
                  .filter((line: string) => line.trim() !== "")
                  .slice(
                    0,
                    expandedTrips.includes(req.id)
                      ? undefined
                      : 4
                  )
                  .map((line: string, index: number) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm"
                    >

                      <p
                        className={`leading-relaxed text-sm break-words w-full overflow-hidden whitespace-pre-wrap ${
                          line.includes("Day") ||
                          line.includes("Overview") ||
                          line.includes("Budget") ||
                          line.includes("Tips") ||
                          line.includes("Hotel")
                            ? "font-bold text-blue-700 text-base"
                            : "text-gray-700"
                        }`}
                      >
                        {line}
                      </p>

                    </div>
                  ))}
                  <button
                    onClick={() => {
                      if (expandedTrips.includes(req.id)) {
                        setExpandedTrips((prev) =>
                          prev.filter((id) => id !== req.id)
                        );
                      } else {
                        setExpandedTrips((prev) => [...prev, req.id]);
                      }
                    }}
                    className="text-blue-600 text-sm font-medium mt-2"
                  >
                    {expandedTrips.includes(req.id)
                      ? "Show Less"
                      : "Show Full Itinerary"}
                  </button>
              </div>
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
                  disabled={req.status !== "REVISION_SENT"}
                  className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Accept Revision
                </button>

                <button
                  onClick={() => handleRejectRevision(req.id)}
                  disabled={req.status !== "REVISION_SENT"}
                  className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
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

        <h2 className="text-2xl font-bold mt-12 text-center">
          Saved Itineraries
        </h2>

        <p className="text-center text-gray-500 text-sm mb-4">
          Plans you saved for future booking
        </p>

        {savedItineraries.length === 0 && (
          <p className="text-center text-gray-500">
            No saved itineraries yet
          </p>
        )}

        <div className="space-y-4">
          {savedItineraries.map((it, index) => (
            <div
              key={it.id}
              className="bg-white p-6 rounded-2xl shadow-md border space-y-4"
            >

              <p className="text-sm font-bold text-gray-500 mb-2">
                Saved Plan #{index + 1}
              </p>

              <div className="space-y-2 sm:space-y-3 mt-3">
                {it.contentJson
                  .replace(/\*/g, "")
                  .split("\n")
                  .filter((line: string) => line.trim() !== "")
                  .slice(
                    0,
                    expandedTrips.includes(it.id)
                      ? undefined
                      : 4
                  )
                  .map((line: string, index: number) => (

                    <div
                      key={index}
                      className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm"
                    >


                      <p
                        className={`leading-relaxed text-sm break-words w-full overflow-hidden whitespace-pre-wrap ${
                          line.includes("Day") ||
                          line.includes("Overview") ||
                          line.includes("Budget") ||
                          line.includes("Tips") ||
                          line.includes("Hotel")
                            ? "font-bold text-blue-700 text-base"
                            : "text-gray-700"
                        }`}
                      >
                        {line}
                      </p>

                    </div>
                  ))}

                <button
                  onClick={() => {
                    if (expandedTrips.includes(it.id)) {

                      setExpandedTrips((prev) =>
                        prev.filter((id) => id !== it.id)
                      );

                    } else {

                      setExpandedTrips((prev) => [
                        ...prev,
                        it.id,
                      ]);

                    }
                  }}
                  className="text-blue-600 text-sm font-medium mt-2"
                >
                  {expandedTrips.includes(it.id)
                    ? "Show Less"
                    : "Show Full Itinerary"}
                </button>
              </div>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");

                    const res = await fetch(
                      "https://ai-travel-backend-production.up.railway.app/requests",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          itineraryId: it.id,
                        }),
                      }
                    );

                    if (!res.ok) throw new Error();

                    setMessage("Request submitted successfully ✅");

                    // remove from saved itineraries instantly
                    setSavedItineraries((prev) =>
                      prev.filter((item) => item.id !== it.id)
                    );

                    // refresh requests
                    const reqRes = await fetch(
                      "https://ai-travel-backend-production.up.railway.app/requests",
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    const reqData = await reqRes.json();

                    setRequests(Array.isArray(reqData) ? reqData : []);

                  } catch (err) {
                    setMessage("Failed to submit request ❌");
                  }
                }}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Request This Plan
              </button>

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

      {bookings.map((b, index) => (
        <div
          key={b.id}
          className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
        >
          <p className="text-xs font-bold text-gray-500">
            Booking #{index + 1} • {b.tour ? "Pre-built Tour" : "Custom AI Trip"}
          </p>

          {b.tour && (
            <>
              <p><strong>Tour:</strong> {b.tour.title}</p>
              <p className="text-gray-600">{b.tour.description}</p>
            </>
          )}

          {b.itinerary && (
            <div className="space-y-3 mt-3">
              {b.itinerary.contentJson
                .replace(/\*/g, "")
                .split("\n")
                .filter((line: string) => line.trim() !== "")
                .slice(
                  0,
                  expandedTrips.includes(b.id)
                    ? undefined
                    : 4
                )
                .map((line: string, index: number) => (

                  <div
                    key={index}
                    className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm"
                  >

                    <p
                      className={`leading-relaxed text-sm break-words w-full overflow-hidden whitespace-pre-wrap ${
                        line.includes("Day") ||
                        line.includes("Overview") ||
                        line.includes("Budget") ||
                        line.includes("Tips") ||
                        line.includes("Hotel")
                          ? "font-bold text-blue-700 text-base"
                          : "text-gray-700"
                      }`}
                    >
                      {line}
                    </p>

                  </div>
                ))}

              <button
                onClick={() => {
                  if (expandedTrips.includes(b.id)) {

                    setExpandedTrips((prev) =>
                      prev.filter((id) => id !== b.id)
                    );

                  } else {

                    setExpandedTrips((prev) => [
                      ...prev,
                      b.id,
                    ]);

                  }
                }}
                className="text-blue-600 text-sm font-medium mt-2"
              >
                {expandedTrips.includes(b.id)
                  ? "Show Less"
                  : "Show Full Itinerary"}
              </button>
              {b.paymentStatus !== "PAID" && (
                <button
                  onClick={() => handlePayment(b.id)}
                  className="bg-green-600 text-white px-5 py-3 rounded-2xl"
                >
                  Pay Advance
                </button>
              )}
            </div>
          )}

          <p><strong>Amount:</strong> ₹{b.advanceAmount}</p>

          <p><strong>Status:</strong> {b.status}</p>

          <p>
            <strong>Payment:</strong>{" "}
            <span
              className={
                b.paymentStatus === "PAID"
                  ? "text-green-600"
                  : "text-yellow-600"
              }
            >
              {b.paymentStatus}
            </span>
          </p>
        </div>
      ))}
    </div>
    </div>
  );
}