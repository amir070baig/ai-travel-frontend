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
  const [travelDates, setTravelDates] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});


  useEffect(() => {

    requests.forEach((req) => {

      if (!messages[req.id]) {
        fetchMessages(req.id);
      }

    });

  }, [requests]);

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

  useEffect(() => {
    

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
    // 1. Find the current booking object being paid for
    const currentBooking = bookings.find((b) => b.id === bookingId);
    const selectedDate = travelDates[bookingId];

    // 2. Only enforce validation if the booking needs a date but doesn't have one yet
    const needsDateSelection =
      currentBooking &&
      !currentBooking.tourId &&
      !currentBooking.travelDate &&
      currentBooking.status === "PENDING_PAYMENT";

    if (needsDateSelection && !selectedDate) {
      alert("Please select your preferred travel date first.");
      return;
    }

    // 3. Send the selected date to the backend so it gets saved!
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/${bookingId}/travel-date`,
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            travelDate:
              selectedDate,
          }),
        }
      );
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-order`,
        {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            bookingId,
            travelDate: selectedDate || currentBooking?.travelDate // Passes the date if selected
          }),
        }
      );

      const order = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
              body: JSON.stringify({ 
                ...response, 
                bookingId,
                travelDate: selectedDate || currentBooking?.travelDate // Passes it to verification too
              }),
            }
          );

          const verifyData = await verifyRes.json();
          if (verifyData.success) {

            await fetchBookings();

            alert("Payment Successful ✅");
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


  const fetchMessages = async (requestId: string) => {
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/${requestId}/messages`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setMessages((prev) => ({
        ...prev,
        [requestId]: data,
      }));

    } catch (err) {
      console.error(err);
    }
  };


  const handleSendMessage = async (requestId: string) => {

    const message =
      messageInputs[requestId];

    if (!message?.trim()) return;

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests/message`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            requestId,
            message,
          }),
        }
      );

      const newMessage =
        await res.json();
        await fetchMessages(requestId);

      // setMessages((prev) => ({
      //   ...prev,

      //   [requestId]: [
      //     ...(prev[requestId] || []),
      //     newMessage,
      //   ],
      // }));

      setMessageInputs((prev) => ({
        ...prev,
        [requestId]: "",
      }));

    } catch (err) {
      console.error(err);
    }

  };

  const fetchBookings = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    setBookings(
      Array.isArray(data) ? data : []
    );
  };

  console.log(bookings)

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
                    <h3 className="font-bold text-lg text-gray-900">{b.tour?.title || "AI Custom Trip"}</h3>
                    {!b.tour && b.request?.finalPrice && (
                      <div className="mt-2 text-sm">
                        <p>
                          <strong>Final Package Price:</strong>
                          ₹{b.request.finalPrice}
                        </p>
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mt-2 space-y-1">
                      
                      {/* INJECTED TARGET DATA METADATA SNIPPET */}
                      <p>
                        <strong>Date:</strong>{" "}
                        {b.travelDate
                          ? new Date(b.travelDate).toLocaleDateString()
                          : "Please select your preferred travel date below"}
                      </p>
                      <p>
                        <strong>Time:</strong>{" "}
                        {b.timeSlot || "Flexible scheduling"}
                      </p>
                      <p>
                        <strong>Travelers:</strong>{" "}
                        {b.travelers}
                      </p>

                    </div>
                    <p>
                      {!b.tour && b.request?.finalPrice && (
                        <div className="mt-2 space-y-1 text-sm">

                          <p>
                            <strong>
                              Final Package Price:
                            </strong>

                            ₹{b.request.finalPrice}
                          </p>

                          <p>
                            <strong>
                              Remaining Balance:
                            </strong>

                            ₹{
                              b.request.finalPrice -
                              b.advanceAmount
                            }
                          </p>

                        </div>
                      )}
                      <strong>
                        {
                          b.status === "CONFIRMED"
                            ? "Advance Paid:"
                            : "Advance Due:"
                        }
                      </strong>

                      ₹{b.advanceAmount}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t">
                    {!b.travelDate && b.status === "PENDING_PAYMENT" && (
                      <div className="space-y-2">

                        <label className="block text-sm font-medium">
                          Preferred Travel Date
                        </label>

                        <input
                          type="date"
                          min={
                            new Date(
                              Date.now() + 3 * 24 * 60 * 60 * 1000
                            )
                              .toISOString()
                              .split("T")[0]
                          }
                          value={travelDates[b.id] || ""}
                          onChange={(e) =>
                            setTravelDates({
                              ...travelDates,
                              [b.id]: e.target.value,
                            })
                          }
                          className="border rounded-xl p-2 w-full"
                        />
                        <p className="text-xs text-gray-500">
                          Please select a travel date at least 3 days in advance.
                        </p>

                      </div>
                    )}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      b.status === "PAID" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {b.status === "PENDING_PAYMENT"
                        ? "Awaiting Advance Payment"
                        : b.status === "CONFIRMED"
                        ? "Booking Confirmed"
                        : b.status || "PENDING"}
                    </span>
                    {b.status === "PENDING_PAYMENT" && (
                      <button
                        onClick={() => handlePayment(b.id)}
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                      >
                        Pay Now
                      </button>
                    )}
                    {b.status === "PENDING_PAYMENT" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-800">
                        A small advance payment is required to reserve your personalized itinerary planning,
                        consultation, and travel coordination services.
                      </div>
                    )}
                  </div>
                  {b.itinerary?.contentJson && (
                    <details className="mt-4">
                      <summary className="cursor-pointer font-semibold text-blue-600">
                        View Full Itinerary
                      </summary>

                      <div className="mt-3 space-y-2">
                        {b.itinerary.contentJson
                          .replace(/\*/g, "")
                          .split("\n")
                          .filter((line: string) => line.trim() !== "")
                          .map((line: string, i: number) => (
                            <div
                              key={i}
                              className="bg-gray-50 border rounded-xl p-3"
                            >
                              <p className="text-sm whitespace-pre-wrap">
                                {line}
                              </p>
                            </div>
                          ))}
                      </div>
                    </details>
                  )}
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

                  <button
                    onClick={async () => {

                      try {

                        const res = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/requests`,
                          {
                            credentials: "include",
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              itineraryId: trip.id,
                            }),
                          }
                        );

                        const data = await res.json();

                        if (!res.ok) {
                          alert(data.message || "Failed to submit request");
                          return;
                        }

                        await fetchData();

                        alert(
                          "Request submitted ✅ You can track it in Active Requests"
                        );

                        // window.location.reload();

                      } catch (err) {

                        console.error(err);

                        alert("Something went wrong");

                      }

                    }}
                    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                  >
                    Request This Plan
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
                      Status:{" "}

                      <span className="text-blue-600 uppercase">
                        {
                          req.status === "UNDER_REVIEW"
                            ? "UNDER EXPERT REVIEW"
                            : req.status === "REVISION_SENT"
                            ? "DISCUSSION IN PROGRESS"
                            : req.status === "APPROVED"
                            ? "APPROVED"
                            : req.status
                        }

                      </span>
                    </p>
                  </div>

                  {req.finalPrice && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">

                      <p className="font-semibold text-green-700">
                        Personalized Package Ready
                      </p>

                      <p>
                        Final Package Price:
                        ₹{req.finalPrice}
                      </p>

                    </div>
                  )}

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
                    <div className="space-y-4 pt-2">

                      {req.revisionMessage && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">

                          <strong className="block mb-1">
                            Revision Notes from Travel Team:
                          </strong>

                          <p>
                            {req.revisionMessage}
                          </p>

                        </div>
                      )}

                      <div className="space-y-3">

                        <h4 className="font-semibold">
                          Conversation
                        </h4>

                        <div className="bg-gray-50 border rounded-xl p-4 space-y-2">

                          {(messages[req.id] || []).map(
                            (msg: any) => (

                              <div
                                key={msg.id}
                                className={`p-3 rounded-xl text-sm ${
                                  msg.senderType === "ADMIN"
                                    ? "bg-blue-100"
                                    : "bg-green-100"
                                }`}
                              >

                                <strong>
                                  {msg.senderType === "ADMIN"
                                    ? "Travel Team"
                                    : "You"}
                                </strong>

                                <p>
                                  {msg.message}
                                </p>

                              </div>

                            )
                          )}

                        </div>

                        <textarea
                          value={
                            messageInputs[req.id] || ""
                          }

                          onChange={(e) =>
                            setMessageInputs({
                              ...messageInputs,

                              [req.id]:
                                e.target.value,
                            })
                          }

                          placeholder="Reply to travel team..."

                          className="w-full border rounded-xl p-3"
                        />

                        <button
                          onClick={() =>
                            handleSendMessage(
                              req.id
                            )
                          }

                          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                        >
                          Send Message
                        </button>

                      </div>
                      {/* <div className="flex gap-2">

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
                          Request Further Changes
                        </button>

                      </div> */}

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
