"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    fetch("https://ai-travel-backend-production.up.railway.app/tours")
      .then((res) => res.json())
      .then((data) => setTours(data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="text-center py-16 px-6 bg-white shadow">
        <h1 className="text-4xl font-bold mb-4">
          Plan Your Perfect Trip with AI ✨
        </h1>
        <p className="text-gray-600 mb-6">
          Generate itineraries, get expert review, and book your trip — all in one place
        </p>

        <a
          href="/generate"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Start Planning
        </a>
      </div>

      {/* TOURS PREVIEW */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Popular Tours 🌍
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <div key={tour.id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="text-lg font-semibold">{tour.title}</h3>
              <p className="text-gray-500">{tour.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div className="text-center pb-10 text-gray-600">
        Need help? Contact us on WhatsApp: +91-7599921173
      </div>

    </div>
  );
}