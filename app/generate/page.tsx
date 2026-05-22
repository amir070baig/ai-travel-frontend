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
  const [travelStyle, setTravelStyle] = useState("Luxury");
  const [tripType, setTripType] = useState("Couple");
  const [interests, setInterests] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    if (!budget || Number(budget) < 2000) {
      setMessage("Minimum budget should be ₹2000");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-itinerary`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ days, budget, groupSize, travelStyle, tripType, interests }),
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

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requests`,
        {
          credentials: "include",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: itinerary.contentJson,
            days,
            budget,
            groupSize,
            travelStyle,
            tripType,
            interests,
          }),
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        credentials: "include",
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
  //     await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/initiate`, {
         //credentials: "include",
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
      `${process.env.NEXT_PUBLIC_API_URL}/requests/accept`,
      {
        credentials: "include",
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
      <div className="bg-white/90 backdrop-blur border border-white/40 shadow-lg rounded-3xl p-5 sm:p-6">

        <h2 className="text-lg font-bold text-gray-900 mb-4">
          How It Works
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-2xl mb-2">🧠</p>
            <p className="font-semibold text-sm">
              Generate AI Plan
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-2xl mb-2">📩</p>
            <p className="font-semibold text-sm">
              Submit Request
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-2xl mb-2">🧳</p>
            <p className="font-semibold text-sm">
              Expert Review
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-semibold text-sm">
              Confirm Booking
            </p>
          </div>

        </div>

      </div>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* TITLE */}
        <div className="text-center space-y-5 mb-4">

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600">
            ✨ AI Powered Travel Planning
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-gray-900">
            Build Your Perfect
            <span className="block text-blue-600">
              Agra Experience
            </span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Generate premium AI travel itineraries with real hotel suggestions,
            pricing estimates, local recommendations, and expert booking support.
          </p>

        </div>

        {/* INPUTS */}
        <div className="bg-white/90 backdrop-blur border border-white/40 shadow-xl shadow-black/5 rounded-3xl p-5 sm:p-8 space-y-6">
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
              className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Group Size</label>
            <input
              type="number"
              value={groupSize}
              onChange={(e) => setGroupSize(Number(e.target.value))}
              className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>


          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-600">
              Travel Style
            </label>

            <select
              value={travelStyle}

              onChange={(e) =>
                setTravelStyle(
                  e.target.value
                )
              }

              className="w-full p-3 border rounded-xl"
            >

              <option>
                Budget
              </option>

              <option>
                Comfort
              </option>

              <option>
                Luxury
              </option>

            </select>

          </div>

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-600">
              Trip Type
            </label>

            <select
              value={tripType}

              onChange={(e) =>
                setTripType(
                  e.target.value
                )
              }

              className="w-full p-3 border rounded-xl"
            >

              <option>
                Solo
              </option>

              <option>
                Couple
              </option>

              <option>
                Family
              </option>

              <option>
                Friends
              </option>

            </select>

          </div>

          <div className="space-y-1">

            <label className="text-sm font-medium text-gray-600">
              Interests
            </label>

            <input
              placeholder="Photography, food, history, luxury hotels..."

              value={interests}

              onChange={(e) =>
                setInterests(
                  e.target.value
                )
              }

              className="w-full p-3 border rounded-xl"
            />

          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all disabled:bg-gray-400 text-white h-14 rounded-2xl font-semibold text-lg flex items-center justify-center shadow-lg shadow-blue-200"
          >
            {loading ? "Generating..." : "Generate Itinerary"}
          </button>
        </div>

        

        {/* ITINERARY */}
        {itinerary && (
          <div className="bg-white/95 backdrop-blur border border-white/40 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/5 space-y-6">
            
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-semibold">
                {itinerary?.contentJson?.split("\n")[0] || "Your AI Itinerary"}
              </h3>
              <span className="text-sm text-gray-500">
                {days} days · {budget}
              </span>
            </div>

            <div className="space-y-3">
              {formatItinerary(itinerary?.contentJson).map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5"
                >

                  <div
                    className={`leading-relaxed whitespace-pre-wrap text-sm sm:text-base ${
                      item.includes("Day") ||
                      item.includes("Overview") ||
                      item.includes("Budget") ||
                      item.includes("Tips") ||
                      item.includes("Hotel")
                        ? "font-bold text-blue-700 text-base sm:text-lg"
                        : "text-gray-700"
                    }`}
                  >
                    {item}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800">
              AI-generated itineraries are personalized travel suggestions.
              Final pricing, accommodations, transportation, and experiences
              are confirmed by our travel concierge team during booking assistance.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              {/* REQUEST */}
              <button
                onClick={handleRequest}
                disabled={requestLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl disabled:bg-gray-400"
              >
                {requestLoading ? "Submitting..." : "Request Expert Travel Planning"}
              </button>

              <a
                href={`https://wa.me/917599921173?text=${encodeURIComponent(
                  `Hi, I generated an itinerary for ${days} days with budget ₹${budget}. I'd like help planning this trip.`
                )}`}
                target="_blank"
                className="flex-1 bg-green-500 hover:bg-green-600 transition-all text-white py-2 rounded-xl text-center"
              >
                Discuss on WhatsApp
              </a>

              {/* SAVE */}
              <button
                disabled={saved}
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/itineraries/save`,
                      {
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          content: itinerary.contentJson,
                          days,
                          budget,
                          groupSize,
                          travelStyle,
                          tripType,
                          interests,
                        }),
                      }
                    );

                    const data = await res.json();

                    if (!res.ok) {
                      alert(data.message || "Save failed");
                      return;
                    }

                    setSaved(true);
                    setMessage("Itinerary saved successfully ✅");
                    window.location.href = "/my-requests"; // Redirect to My Requests page
                    

                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                  }
                }}
                className="flex-1 bg-gray-200 py-2 rounded-xl"
              >
                {saved ? "Saved" : "Save for Later"}
              </button>

              <button
                onClick={async () => {
                  try {

                    const res = await fetch(
                      `${process.env.NEXT_PUBLIC_API_URL}/pdf/generate`,
                      {
                        credentials: "include",
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          content: itinerary.contentJson,
                          days,
                          budget,
                          groupSize,
                          travelStyle,
                          tripType,
                          interests,
                        }),
                      }
                    );

                    const blob = await res.blob();

                    const url = window.URL.createObjectURL(blob);

                    const a = document.createElement("a");

                    a.href = url;

                    a.download = "itinerary.pdf";

                    document.body.appendChild(a);

                    a.click();

                    a.remove();

                  } catch (err) {
                    console.error(err);

                    alert("Failed to download PDF");
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 rounded-xl"
              >
                Download PDF
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