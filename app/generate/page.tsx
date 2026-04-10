"use client";

import { useState } from "react";

export default function GeneratePage() {
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("medium");
  const [groupSize, setGroupSize] = useState(2);

  const [loading, setLoading] = useState(false);
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
    try {
      await fetch("https://ai-travel-backend-production.up.railway.app/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itineraryId: itinerary.id }),
      });

      alert("Request Submitted ✅");
    } catch (err) {
      console.error(err);
    }
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

      alert("Booking Created ✅");
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayment = async () => {
    try {
      await fetch("https://ai-travel-backend-production.up.railway.app/payments/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: booking.advanceAmount,
        }),
      });

      alert("Payment Initiated 💳");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md space-y-6">

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">Plan Your Trip ✨</h2>
          <p className="text-gray-500 mt-2">
            Generate your personalized itinerary in seconds
          </p>
        </div>

        {/* INPUTS */}
        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Days"
        />

        <input
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Budget"
        />

        <input
          type="number"
          value={groupSize}
          onChange={(e) => setGroupSize(Number(e.target.value))}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Group Size"
        />

        {/* GENERATE BUTTON */}
        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          {loading ? "Generating..." : "Generate Itinerary"}
        </button>

        {/* ITINERARY */}
        {itinerary && (
          <div className="bg-gray-100 p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-semibold">Your Itinerary</h3>

            <div className="whitespace-pre-line text-gray-700">
              {itinerary.contentJson}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-4">
              <button
                onClick={handleRequest}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              >
                Request Execution
              </button>

              <button
                onClick={handleBooking}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg"
              >
                Create Booking
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT */}
        {booking && (
          <button
            onClick={handlePayment}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold"
          >
            Pay Advance 💳
          </button>
        )}

      </div>
    </div>
  );
}