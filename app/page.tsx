"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tours`,
          {
            credentials: "include",
          }
        );
        

        const data = await res.json();

        console.log("TOURS:", data);

        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setTours([]);
      }
    };

    fetchTours();

    const fetchReviews = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/ai`
        );

        const data = await res.json();

        setReviews(
          Array.isArray(data)
            ? data
                .sort((a, b) => {
                  if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                  }

                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .slice(0, 3)
            : []
        );

      } catch (err) {

        console.error(
          "Error fetching reviews:",
          err
        );

      }

    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24 sm:py-24">

        <div className="text-center space-y-6">

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600">
            ✨ AI Powered Travel Planning
          </div>

          <h1 className="max-w-4xl mx-auto text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight text-gray-900">

            Plan Luxury
            <span className="block text-blue-600">
              Agra Experiences
            </span>

          </h1>

          <p className="text-gray-600 mt-4 leading-relaxed max-w-3xl mx-auto text-sm sm:text-base">
            TourGen helps travelers discover
            personalized AI itineraries,
            curated Agra tours, and expert
            travel planning assistance.
          </p>
          

          <div className="flex flex-wrap justify-center gap-4 mt-6">

            <a
              href="/agra-tours"
              className="text-blue-600 font-semibold hover:underline"
            >
              Best Agra Tours
            </a>

            <a
              href="/tours"
              className="text-blue-600 font-semibold hover:underline"
            >
              Taj Mahal Sunrise Tours
            </a>

            <a
              href="/generate"
              className="text-blue-600 font-semibold hover:underline"
            >
              Generate AI Itinerary
            </a>

          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">

            <a
              href="/generate"
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all text-white px-7 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-200"
            >
              Generate AI Trip
            </a>

            <a
              href="/tours"
              className="bg-white border border-gray-200 hover:bg-gray-50 transition-all text-gray-900 px-7 py-4 rounded-2xl font-semibold"
            >
              Explore Tours
            </a>

          </div>

        </div>

      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white rounded-2xl p-5 border shadow-sm text-center">
            <p className="text-2xl mb-2">🧠</p>
            <p className="font-semibold text-sm">
              AI Trip Planning
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm text-center">
            <p className="text-2xl mb-2">🏨</p>
            <p className="font-semibold text-sm">
              Hotel Suggestions
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm text-center">
            <p className="text-2xl mb-2">🧳</p>
            <p className="font-semibold text-sm">
              Expert Support
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm text-center">
            <p className="text-2xl mb-2">📍</p>
            <p className="font-semibold text-sm">
              Curated Tours
            </p>
          </div>

        </div>

      </div>

      {/* TOURS PREVIEW */}
      <div className="max-w-6xl mx-auto py-20 lg:py-24 px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-black mb-10 text-center text-gray-900">
          Popular Tours 🌍
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <a key={tour.id} href={`/tours?id=${tour.id}`}>
              <div className="h-full flex flex-col bg-white/90 backdrop-blur border border-white/40 rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="overflow-hidden">
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="w-full h-52 object-cover hover:scale-105 transition-all duration-500"
                  />
                </div>

                <div className="p-5 space-y-3 flex flex-col flex-1">

                  <div className="flex flex-wrap gap-2">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      Bestseller
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Instant Confirmation
                    </span>

                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    {tour.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between pt-2">

                    <div>
                      <p className="text-xs text-gray-400">
                        Starting From
                      </p>

                      <p className="text-2xl font-black text-gray-900">
                        ₹{tour.price}
                        <span className="text-sm font-medium text-gray-500">
                          /person
                        </span>
                      </p>
                    </div>

                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold">
                      Explore
                    </div>

                  </div>

                </div>
              </div>
            </a>
          ))}
        </div>
      </div>



      <div className="max-w-4xl mx-auto px-4 py-14">

        <div className="bg-white rounded-3xl border shadow-xl p-8">

          <h2 className="text-4xl font-black text-center">
            Plan Your Journey
          </h2>

          <p className="text-center text-gray-600 mt-4">
            Speak with our travel experts and get
            personalized recommendations.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-8">

            <input
              placeholder="Your Name"

              value={leadName}

              onChange={(e) =>
                setLeadName(
                  e.target.value
                )
              }

              className="border p-4 rounded-2xl"
            />

            <input
              placeholder="Your Email"

              value={leadEmail}

              onChange={(e) =>
                setLeadEmail(
                  e.target.value
                )
              }

              className="border p-4 rounded-2xl"
            />

            <input
              placeholder="Phone Number"

              value={leadPhone}

              onChange={(e) =>
                setLeadPhone(
                  e.target.value
                )
              }

              className="border p-4 rounded-2xl md:col-span-2"
            />

            <textarea
              placeholder="Tell us about your trip plans..."

              value={leadMessage}

              onChange={(e) =>
                setLeadMessage(
                  e.target.value
                )
              }

              className="border p-4 rounded-2xl h-40 md:col-span-2"
            />

          </div>

          <button
            onClick={async () => {

              await fetch(
                "/leads",
                {
                  method: "POST",

                  credentials: "include",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    name: leadName,
                    email: leadEmail,
                    phone: leadPhone,
                    message: leadMessage,
                  }),
                }
              );

              alert(
                "Our travel experts will contact you shortly ✅"
              );

              setLeadName("");
              setLeadEmail("");
              setLeadPhone("");
              setLeadMessage("");

            }}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold mt-8 hover:shadow-md hover:border-blue-300"
          >
            Submit Inquiry
          </button>

        </div>

      </div>


      {/* AI SUCCESS STORIES */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">

        <div className="text-center mb-12">

          <p className="text-blue-600 font-semibold">

            ⭐ Trusted by AI Travelers

          </p>

          <h2 className="text-4xl font-black mt-3">

            TourGen's AI concierge Success Stories

          </h2>

          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">

            Discover how TourGen's AI helped
            travelers plan unforgettable journeys.

          </p>

        </div>

        {reviews.length > 0 && (

            <div className="grid md:grid-cols-3 gap-6">

              {reviews.map((review) => (

                <div
                  key={review.id}
                  className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-xl transition"
                >

                  <div className="text-xl">

                    {"⭐".repeat(review.rating)}

                  </div>

                  <p className="mt-5 text-gray-700 leading-relaxed italic">

                    "{review.comment}"

                  </p>

                  <div className="border-t my-6"></div>

                  <div className="space-y-2 text-sm text-gray-600">

                    <p>

                      ✔ Verified AI Traveler

                    </p>

                    <p>

                      📍 {review.itinerary.city}

                    </p>

                    <p>

                      🗓 {review.itinerary.days} Day Trip

                    </p>

                    <p>

                      👥 {review.itinerary.groupSize} Travelers

                    </p>

                  </div>

                </div>

              ))}

            </div>
          )
        }

        <div className="text-center mt-10">

          <a
            href="/ai-reviews"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-2xl font-semibold transition"
          >

            View All Success Stories →

          </a>

        </div>

      </div>


      {/* FOOTER */}

      <div className="bg-white border-t mt-16">

        <div className="max-w-6xl mx-auto px-6 py-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* BRAND */}

            <div>

              <h3 className="text-2xl font-black text-gray-900">
                TourGen
              </h3>

              <p className="text-gray-600 mt-4 leading-relaxed">
                Premium AI-powered travel planning,
                curated Agra tours, and personalized
                local experiences.
              </p>

            </div>

            {/* SEO LINKS */}

            <div>

              <h4 className="font-bold text-lg mb-4">
                Explore
              </h4>

              <div className="flex flex-col gap-3">

                <a
                  href="/agra-tours"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Agra Tours
                </a>

                <a
                  href="/tours"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Taj Mahal Experiences
                </a>

                <a
                  href="/generate"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Luxury Agra Trips
                </a>

              </div>

            </div>


            {/* LEGAL */}

            <div>

              <h4 className="font-bold text-lg mb-4">
                Legal
              </h4>

              <div className="flex flex-col gap-3">

                <a
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Terms & Conditions
                </a>

                <a
                  href="/refund-policy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Refund Policy
                </a>

                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </a>

                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact Us
                </a>

              </div>

            </div>

            {/* CONTACT */}

            <div>

              <h4 className="font-bold text-lg mb-4">
                Contact
              </h4>

              <div className="space-y-3 text-gray-600">

                <p>
                  WhatsApp:
                  +91 75999 21173
                </p>

                <p>
                  Email:
                  tourgenteam@gmail.com
                </p>

                <p>
                  Agra, India
                </p>

                <a
                  href="https://wa.me/917599921173"
                  target="_blank"
                  className="inline-block bg-green-500 text-white px-5 py-3 rounded-2xl mt-3"
                >
                  Chat on WhatsApp
                </a>

              </div>

            </div>

          </div>

          {/* BOTTOM */}

          <div className="border-t mt-10 pt-6 text-center text-gray-500 text-sm">

            © 2026 TourGen.
            All rights reserved.

          </div>

        </div>

      </div>

    </div>
  );
}