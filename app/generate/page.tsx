"use client";

import { useState, useRef } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "../hooks/useAuth";

export default function GeneratePage() {
  // useAuth();
  
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [groupSize, setGroupSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const [travelStyle, setTravelStyle] = useState("Luxury");
  const [tripType, setTripType] = useState("Couple");
  const [interests, setInterests] = useState("");
  const itineraryRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const itineraryTitle = itinerary
  ? `Agra ${itinerary.days}-Day ${itinerary.travelStyle} Journey`
  : "Agra Journey";

  useEffect(() => {

    fetchSettings();

    const pending = sessionStorage.getItem("pendingItinerary");

    if (!pending) return;

    try {

      const restored = JSON.parse(pending);

      setItinerary(restored);
      setSaved(false);
      setMessage("");

      sessionStorage.removeItem("pendingItinerary");

    } catch (err) {

      console.error(err);

    }

  }, []);


  const handleGenerate = async () => {
    if (loading) return;
    
    if (!budget || Number(budget) < 2000) {
      setMessage("Minimum budget should be ₹2000");
      return;
    }

    if (!days || Number(days) < 1) {
      setMessage("Please enter valid trip days");
      return;
    }

    if (!groupSize || Number(groupSize) < 1) {
      setMessage("Please enter valid group size");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-itinerary`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          days: Number(days),
          budget,
          groupSize: Number(groupSize),
          travelStyle,
          tripType,
          interests,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to generate itinerary");
        return;
      }
      setItinerary({
        contentJson: data.content,
        days: Number(days),
        budget,
        groupSize: Number(groupSize),
        travelStyle,
        tripType,
        interests,
      });

      setDays("");
      setBudget("");
      setGroupSize("");
      setTravelStyle("Luxury");
      setTripType("Couple");
      setInterests("");

      setTimeout(() => {
        itineraryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      console.error(err);
    }

    finally {
      setLoading(false);
    }
  };

  // const handleRequest = async () => {
  //   setRequestLoading(true);

  //   try {

  //     const res = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/requests`,
  //       {
  //         credentials: "include",
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           content: itinerary.contentJson,
  //           days,
  //           budget,
  //           groupSize,
  //           travelStyle,
  //           tripType,
  //           interests,
  //         }),
  //       }
  //     );

  //     const data = await res.json();

  //     if (!res.ok) {
  //       alert(data.message || "Something went wrong");
  //       setRequestLoading(false);
  //       return;
  //     }

  //     alert("Request submitted ✅ You can track it in My Requests page");
  //       // window.location.reload(); // ✅ force refresh
  //   } catch (err) {
  //     alert("Network error");
  //   }

  //   setRequestLoading(false);
  // };

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

  const fetchSettings = async () => {
    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/settings`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setSettings(data);

    } catch (err) {
      console.error(err);
    }
  };

  

  const saveItinerary = async () => {

    const authRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        credentials: "include",
      }
    );

    if (!authRes.ok) {

      sessionStorage.setItem(
        "pendingItinerary",
        JSON.stringify({
          contentJson: itinerary.contentJson,
          days: itinerary.days,
          budget: itinerary.budget,
          groupSize: itinerary.groupSize,
          travelStyle: itinerary.travelStyle,
          tripType: itinerary.tripType,
          interests: itinerary.interests,
        })
      );

      alert("Please login to continue.");

      router.push("/login?redirect=/generate");

      return null;
    }

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
          days: Number(itinerary.days),
          budget: itinerary.budget,
          groupSize: Number(itinerary.groupSize),
          travelStyle: itinerary.travelStyle,
          tripType: itinerary.tripType,
          interests: itinerary.interests,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {

      throw new Error(
        data.message || "Save failed"
      );

    }

    return data;

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

  if (
    settings &&
    !settings.aiBookingsEnabled
  ) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">

        <div className="max-w-xl bg-white rounded-3xl shadow-xl border p-10 text-center space-y-6">

          <div className="text-6xl">
            🤖
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            AI Concierge Temporarily Unavailable
          </h1>

          <p className="text-gray-600 leading-relaxed">
            Our AI Concierge is temporarily unavailable while we prepare existing travel plans.
          </p>

          <p className="text-gray-600 leading-relaxed">
            You can still explore our curated Agra tours or contact us directly on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => router.push("/tours")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Browse Tours
            </button>

            <a
              href="https://wa.me/917599921173"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-300 px-6 py-3 rounded-xl font-semibold text-center"
            >
              Contact on WhatsApp
            </a>

          </div>

        </div>

      </div>

    );

  } 

  return (

    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-6 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur border border-white/40 shadow-lg rounded-3xl p-5 sm:p-6 mb-8">

        <h2 className="text-lg font-bold text-gray-900 mb-4">
          How It Works
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

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

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight text-gray-900">
            Build Your Perfect
            <span className="block text-blue-600">
              Agra Experience
            </span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed px-2">
            Generate premium TourGen with real hotel suggestions,
            pricing estimates, local recommendations, and expert booking support.
          </p>

        </div>

        {/* INPUTS */}
        <div className="bg-white/90 backdrop-blur border border-white/40 shadow-xl shadow-black/5 rounded-3xl p-4 sm:p-8 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Number of Days</label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Number of days (e.g. 5)"
              className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Budget</label>
            <input
              type="text"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Total budget (e.g. ₹15,000)"
              className="w-full p-3.5 border border-gray-200 rounded-2xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-600">Group Size</label>
            <input
              type="number"
              value={groupSize}
              onChange={(e) => setGroupSize(e.target.value)}
              placeholder="Number of travelers"
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

              className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50"
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

              className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50"
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

              className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50"
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
          <div
            ref={itineraryRef}
            className="bg-white/95 backdrop-blur border border-white/40 rounded-3xl p-5 sm:p-8 shadow-2xl shadow-black/5 space-y-6">

            <h2 className="text-2xl font-bold text-blue-700 mb-2">
              {itineraryTitle}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between sm:items-center">
              <h3 className="text-xl sm:text-2xl font-semibold">
                {itinerary?.contentJson?.split("\n")[0] || "Your AI Itinerary"}
              </h3>
              <span>
                {itinerary.days} days · ₹{itinerary.budget}
              </span>
            </div>

            <div className="space-y-3">
              {formatItinerary(itinerary?.contentJson).map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5 overflow-hidden"
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
              are confirmed by our travel TourGen team during booking assistance.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row pt-4">

              {/* REQUEST */}
              {/* <button
                onClick={handleRequest}
                disabled={requestLoading}
                className="flex-1 bg-green-600 text-white py-2 rounded-xl disabled:bg-gray-400"
              >
                {requestLoading ? "Submitting..." : "Request Expert Travel Planning"}
              </button> */}

              <a
                href={`https://wa.me/917599921173?text=${encodeURIComponent(
                  `Hi, I generated a ${itinerary.days}-day ${itinerary.travelStyle} trip for ${itinerary.tripType}. Budget: ₹${itinerary.budget}. I'd like help planning this trip.`
                )}`}
                target="_blank"
                className="flex-1 bg-green-500 hover:bg-green-600 transition-all text-white py-3 rounded-xl text-center font-semibold"
              >
                Discuss on WhatsApp
              </a>

              {/* SAVE */}
              <button
                disabled={saved || isSubmitting}
                onClick={async () => {
                  if (isSubmitting) return;
                  setIsSubmitting(true);
                  try {
                    // First check if user is logged in
                    const savedItinerary = await saveItinerary();

                      if (!savedItinerary) {
                        return;
                      }

                      setSaved(true);

                      setMessage("Itinerary saved successfully ✅");

                      window.location.href = "/my-requests";

                    // console.log("SAVE RESPONSE", data);
                    // console.log("SAVE STATUS", res.status);

                    // if (!res.ok) {
                    //   alert(data.message || "Save failed");
                    //   return;
                    // }

                    // setSaved(true);
                    // setMessage("Itinerary saved successfully ✅");
                    // window.location.href = "/my-requests"; // Redirect to My Requests page
                    

                  } catch (err) {
                    console.error(err);
                    alert("Something went wrong");
                  }
                  finally {
                    setIsSubmitting(false);
                  }
                }}
                className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold"
              >
                {isSubmitting ? "Saving..." : saved ? "Saved" : "Save Itinerary"}
              </button>

              <button
                disabled={isDownloading}
                onClick={async () => {
                  if (isDownloading) return;
                  setIsDownloading(true);
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
                          days: Number(itinerary.days),
                          budget: itinerary.budget,
                          groupSize: Number(itinerary.groupSize),
                          travelStyle: itinerary.travelStyle,
                          tripType: itinerary.tripType,
                          interests: itinerary.interests,
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

                  finally {
                    setIsDownloading(false);
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold"
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