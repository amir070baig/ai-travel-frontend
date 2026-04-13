"use client";

import { useEffect, useState } from "react";

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/itineraries/admin"
      );

      const data = await res.json();
      setTours(data);
    };

    fetchTours();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Explore Tours ✨
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white p-6 rounded-2xl shadow-md space-y-3"
            >
              <h2 className="text-xl font-semibold">{tour.days}-Day {tour.city} Tour</h2>
              <p className="text-gray-600">{tour.contentJson}</p>

              <div className="flex justify-between items-center pt-3">
                <span className="font-bold text-lg">
                  ₹{tour.days * 2000}
                </span>

                <button
                  className="bg-black text-white px-4 py-2 rounded-xl"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}