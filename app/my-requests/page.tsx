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
        // REQUESTS
        const reqRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/requests`,
          
          {
            credentials: "include",
          }
        );
        const reqData = await reqRes.json();
        setRequests(Array.isArray(reqData) ? reqData : []);

        // BOOKINGS
        const bookRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
          {
            credentials: "include",
          }
        );
        const bookData = await bookRes.json();
        setBookings(Array.isArray(bookData) ? bookData : []);

        // SAVED ITINERARIES
        const savedRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/itineraries/my`,
          {
            credentials: "include",
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/accept`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!res.ok) throw new Error();

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "APPROVED" } : req
        )
      );
      setMessage("Revision accepted ✅");
    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  };

  const handleRejectRevision = async (requestId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/reject-revision`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestId }),
        }
      );

      if (!res.ok) throw new Error();

      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "UNDER_REVIEW" } : req
        )
      );
      setMessage("Revision rejected ❌");
    } catch (err) {
      setMessage("Something went wrong ❌");
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedTrips((prev) =>
      prev.includes(id) ? prev.filter((tId) => tId !== id) : [...prev, id]
    );
  };

  const activeRequests = requests.filter((req) => req.status !== "APPROVED");

  const handlePayment = async (bookingId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId }),
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
            `${process.env.NEXT_PUBLIC_API_URL}/payments/verify`,
            {
              credentials: "include",
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...response, bookingId }),
            }
          );

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment Successful ✅");
            window.location.reload();
          }
        },
        theme: { color: "#2563eb" },
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
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Travel Dashboard</h1>
          <p className="text-gray-500">Monitor your AI trips, saved plans, and bookings</p>
        </div>

        {message && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-center font-medium">
            {message}
          </div>
        )}

        {/* BOOKINGS SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">My Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-gray-500 bg-white p-6 border rounded-2xl text-center">
              You don't have any tour bookings yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <div key={b.id} className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{b.tour?.title || "Tour Booking"}</h3>
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      
                      {/* INJECTED TARGET DATA METADATA SNIPPET */}
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(b.travelDate).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {b.timeSlot}
                      </p>
                      <p>
                        <strong>Travelers:</strong>{" "}
                        {b.travelers}
                      </p>

                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      b.status === "PAID" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {b.status || "PENDING"}
                    </span>
                    {b.status !== "PAID" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SAVED ITINERARIES */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-center">
            Saved Itineraries
          </h2>

          {savedItineraries.length === 0 ? (

            <p className="text-center text-gray-500">
              No saved itineraries yet.
            </p>

          ) : (

            <div className="space-y-4">

              {savedItineraries.map((trip) => (

                <div
                  key={trip.id}
                  className="bg-white p-6 rounded-2xl border shadow-sm space-y-4"
                >

                  <div className="flex justify-between items-center">

                    <h3 className="font-bold text-lg">
                      {trip.city || "Saved Trip"}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {trip.days} Days
                    </span>

                  </div>

                  <div className="space-y-3">

                    {trip.contentJson
                      ?.replace(/\*/g, "")
                      .split("\n")
                      .filter((line: string) => line.trim() !== "")
                      .slice(
                        0,
                        expandedTrips.includes(trip.id)
                          ? undefined
                          : 4
                      )
                      .map((line: string, i: number) => (

                        <div
                          key={i}
                          className="bg-gray-50 border rounded-xl p-3"
                        >

                          <p
                            className={`text-sm whitespace-pre-wrap ${
                              line.includes("Day") ||
                              line.includes("Overview") ||
                              line.includes("Budget")
                                ? "font-bold text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {line}
                          </p>

                        </div>

                      ))}

                  </div>

                  <button
                    onClick={() => toggleExpand(trip.id)}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    {expandedTrips.includes(trip.id)
                      ? "Show Less"
                      : "View Full Plan"}
                  </button>

                </div>

              ))}

            </div>

          )}
        </div>

        {/* ACTIVE REQUESTS SECTION */}
        <div className="space-y-4 pt-4">
          <h2 className="text-2xl font-bold text-center">Active Requests</h2>
          {activeRequests.length === 0 ? (
            <p className="text-center text-gray-500">
              No active requests right now. Saved itineraries can be submitted for review anytime.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-center text-gray-500 text-sm">
                Trips currently under review by our travel experts
              </p>
              {activeRequests.map((req, index) => (
                <div key={req.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-700">Active Request #{index + 1}</p>
                    <p className="font-semibold text-sm">
                      Status: <span className="text-blue-600 uppercase">{req.status.replace("_", " ")}</span>
                    </p>
                  </div>

                  {req.itinerary?.contentJson && (
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl mt-2">
                      <strong className="text-gray-800 block mb-2">Your Itinerary Summary:</strong>
                      <div className="space-y-3">
                        {req.itinerary.contentJson
                          .replace(/\*/g, "")
                          .split("\n")
                          .filter((line: string) => line.trim() !== "")
                          .slice(0, expandedTrips.includes(req.id) ? undefined : 4)
                          .map((line: string, i: number) => (
                            <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-xs">
                              <p className={`leading-relaxed text-sm wrap-break-word w-full overflow-hidden whitespace-pre-wrap ${
                                line.includes("Day") || line.includes("Overview") || line.includes("Budget")
                                  ? "font-bold text-blue-700" : "text-gray-700"
                              }`}>
                                {line}
                              </p>
                            </div>
                          ))}
                      </div>
                      
                      <button
                        onClick={() => toggleExpand(req.id)}
                        className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
                      >
                        {expandedTrips.includes(req.id) ? "Show Less" : "View Full Plan Details"}
                      </button>
                    </div>
                  )}

                  {req.status === "REVISION_SENT" && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition"
                      >
                        Accept Revision
                      </button>
                      <button
                        onClick={() => handleRejectRevision(req.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                      >
                        Decline Revision
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
