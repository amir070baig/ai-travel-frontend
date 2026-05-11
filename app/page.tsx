"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(
          "https://ai-travel-backend-production.up.railway.app/tours"
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        <div className="text-center space-y-6">

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600">
            ✨ AI Powered Travel Planning
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-tight text-gray-900">

            Plan Luxury
            <span className="block text-blue-600">
              Agra Experiences
            </span>

          </h1>

          <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed px-2">

            Generate premium AI itineraries, discover curated tours,
            get expert travel support, and book unforgettable journeys —
            all in one platform.

          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">

            <a
              href="/generate"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all text-white px-7 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-200"
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
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-black mb-10 text-center text-gray-900">
          Popular Tours 🌍
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <a key={tour.id} href={`/tours?id=${tour.id}`}>
              <div className="bg-white/90 backdrop-blur border border-white/40 rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="overflow-hidden">
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="w-full h-52 object-cover hover:scale-105 transition-all duration-500"
                  />
                </div>

                <div className="p-5 space-y-3">

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

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold">
                      Explore
                    </div>

                  </div>

                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">

        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border p-8 text-center space-y-4">

          <p className="text-3xl">
            💬
          </p>

          <h3 className="text-2xl font-bold text-gray-900">
            Need Help Planning?
          </h3>

          <p className="text-gray-600 max-w-xl mx-auto">
            Talk directly with our travel team for personalized trip planning,
            luxury experiences, and custom travel support.
          </p>

          <a
            href="https://wa.me/917599921173"
            target="_blank"
            className="inline-block bg-green-500 hover:bg-green-600 transition-all text-white px-6 py-3 rounded-2xl font-semibold shadow-lg"
          >
            Chat on WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}