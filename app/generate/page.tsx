"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function GeneratePage() {
  useAuth();
  
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("medium");
  const [groupSize, setGroupSize] = useState(2);

  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);

  const handleGenerate = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://ai-travel-backend-production.up.railway.app/ai/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days, budget, groupSize }),
      });

      const data = await res.json();
      setItinerary(data.itinerary);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const handleRequest = async () => {
    setRequestLoading(true);

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
          body: JSON.stringify({ itineraryId: itinerary.id }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
        setRequestLoading(false);
        return;
      }

      alert("Request submitted ✅ You can track it in My Requests page");
        window.location.reload(); // ✅ force refresh
    } catch (err) {
      alert("Network error");
    }

    setRequestLoading(false);
  };

  const handleBooking = async () => {
    try {
      const res = await fetch("https://ai-travel-backend-production.up.railway.app/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itineraryId: itinerary.id }),
      });

      const data = await res.json();
      setBooking(data);

      alert("Booking created ✅ Our team will contact you shortly");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    alert("Our team will contact you for payment via WhatsApp 📞");
  };

// HANDLE PAYMENT I WILL USE LATER
  // const handlePayment = async () => {
  //   try {
  //     await fetch("https://ai-travel-backend-production.up.railway.app/payments/initiate", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         amount: booking.advanceAmount,
  //       }),
  //     });

  //     alert("Payment Initiated 💳");
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const formatItinerary = (text: string) => {
    return text.split("\n").filter((line) => line.trim() !== "");
  };

  const handleAcceptRevision = async () => {
    await fetch(
      "https://ai-travel-backend-production.up.railway.app/requests/accept",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: itinerary.requestId,
        }),
      }
    );

    alert("Revision Accepted ✅");
  };

  return (

    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="bg-blue-50 p-4 rounded-xl text-sm text-gray-700">
        <p className="font-semibold mb-2">How it works:</p>
        <p>1. Generate your itinerary</p>
        <p>2. Submit request</p>
        <p>3. Our travel expert reviews it</p>
        <p>4. Confirm and proceed with booking</p>
      </div>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Plan Smarter Travel ✨
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            AI-powered itineraries with real booking support
          </p>
        </div>

        {/* INPUTS */}
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Number of Days</label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/80"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Group Size</label>
            <input
              type="number"
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black/80"
            />
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white h-14 rounded-xl font-semibold text-lg flex items-center justify-center"
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>

        

        {/* ITINERARY */}
        {itinerary && (
          <div className="bg-white p-8 rounded-2xl shadow-xl space-y-6 border">
            
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">Your Itinerary</h3>
              <span className="text-sm text-gray-500">
                {days} days · {budget}
              </span>
            </div>

            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {formatItinerary(itinerary.contentJson).map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl"
                >
                  <div className="w-3 h-3 mt-2 bg-black rounded-full"></div>

                  <div className="text-gray-700 leading-relaxed">
                    {item}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleRequest}
                disabled={requestLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl disabled:bg-gray-400"
              >
                {requestLoading ? "Processing..." : "Request Execution"}
              </button>

              <button
                onClick={handleBooking}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl"
              >
                Instant Booking
              </button>
            </div>
          </div>
        )}

        {itinerary?.requestStatus === "REVISION_SENT" && (
          <button
            onClick={handleAcceptRevision}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            Accept Revision
          </button>
        )}

        {/* PAYMENT */}
        {booking && (
          <button
            onClick={handlePayment}
            className="w-full bg-linear-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white py-3 rounded-xl font-semibold"
          >
            Pay Advance 💳
          </button>
        )}
        <p className="text-sm text-gray-500 text-center">
            Secure payment will be handled by our travel expert after confirmation
          </p>
      </div>
    </div>
  );
}