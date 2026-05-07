"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function GeneratePage() {
  useAuth();
  
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("");
  const [groupSize, setGroupSize] = useState(2);

  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    if (!budget || Number(budget) < 2000) {
      setMessage("Minimum budget should be ₹2000");
      return;
    }

    try {
      const res = await fetch("https://ai-travel-backend-production.up.railway.app/ai/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days, budget, groupSize }),
      });

      const data = await res.json();
      setItinerary({
        contentJson: data.content,
      });
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

  const formatItinerary = (text?: string) => {
    if (!text) return [];

    return text
    .split("\n")
    .map((line) => line.replace(/\*/g, "").trim())
    .filter((line) => line !== "");
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
              min="1"
              value={days}
              onChange={(e) => {
                const value = Number(e.target.value);

                if (value < 1) {
                  setDays(1);
                  return;
                }

                setDays(value);
              }}
              className="w-full p-3 border rounded-xl"
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
              <h3 className="text-2xl font-semibold">
                {itinerary?.contentJson?.split("\n")[0] || "Your AI Itinerary"}
              </h3>
              <span className="text-sm text-gray-500">
                {days} days · {budget}
              </span>
            </div>

            <div className="border-l-2 border-gray-200 pl-4 space-y-4">
              {formatItinerary(itinerary?.contentJson).map((item, index) => (
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

              {/* REQUEST */}
              <button
                onClick={handleRequest}
                disabled={requestLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl disabled:bg-gray-400"
              >
                {requestLoading ? "Submitting..." : "Request This Plan"}
              </button>

              {/* SAVE */}
              <button
                disabled={saved}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");

                    if (!token) {
                      alert("Please login first");
                      return;
                    }

                    const res = await fetch(
                      "https://ai-travel-backend-production.up.railway.app/itineraries/save",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          content: itinerary.contentJson,
                          days,
                          budget,
                          groupSize,
                        }),
                      }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                      alert(data.message || "Save failed");
                      return;
                    }

                    setMessage("Itinerary saved successfully ✅");
                    setSaved(true);

                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                  }
                }}
                className="flex-1 bg-gray-200 py-2 rounded-xl"
              >
                {saved ? "Saved" : "Save for Later"}
              </button>

            </div>
          </div>
        )}
        {message && (
          <p className="text-green-600 text-center mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}