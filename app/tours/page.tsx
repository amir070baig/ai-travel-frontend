"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ToursPage() {
  
  const [tours, setTours] = useState<any[]>([]);

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

        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setTours([]);
      }
    };

    fetchTours();
  }, []);

  const handleBooking = async (tourId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tourId: tourId, // ✅ FIXED
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Booking failed:", data);
        alert("Booking failed");
        return;
      }

      alert("Booking confirmed ✅");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
    console.log("TOURS:", tours)
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50 py-10 px-4">
      <div className="max-w-5xl mx-auto px-1 sm:px-0 space-y-6">

        <div className="text-center space-y-4 mb-12">

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600">
            ✨ Curated Agra Experiences
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-gray-900">
            Discover Premium
            <span className="block text-blue-600">
              Agra Tours
            </span>
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Explore handcrafted experiences including Taj Mahal sunrise tours,
            luxury heritage journeys, food walks, and unforgettable cultural adventures.
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {tours.map((tour: any) => (
            <a
              key={tour.id}
              href={`/tours/${tour.id}`}
              className="block"
            >
              <div
                key={tour.id}
                className="bg-white/90 backdrop-blur border border-white/40 shadow-xl shadow-black/5 rounded-3xl p-4 sm:p-7  space-y-5 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="w-full h-52 sm:h-64 object-cover hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="space-y-3">

                  <div className="flex flex-wrap gap-2">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      Bestseller
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      Instant Confirmation
                    </span>

                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-medium">
                      Free Cancellation
                    </span>

                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 leading-snug">
                    {tour.title}
                  </h2>

                </div>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {tour.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm">

                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-gray-400 text-xs mb-1">
                      Duration
                    </p>

                    <p className="font-semibold text-gray-800">
                      Full Day Experience
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3">
                    <p className="text-gray-400 text-xs mb-1">
                      Includes
                    </p>

                    <p className="font-semibold text-gray-800">
                      Guide + Pickup
                    </p>
                  </div>

                </div>

                <div className="flex justify-between items-center pt-3">
                  <div>

                    <p className="text-sm text-gray-400">
                      Starting From
                    </p>

                    <p className="text-2xl md:text-3xl font-black text-gray-900">
                      ₹{tour.price}
                      <span className="text-sm font-medium text-gray-500">
                        /person
                      </span>
                    </p>

                  </div>

                  <div className="flex gap-3">

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleBooking(tour.id);
                      }}
                      className="bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-semibold shadow-lg shadow-blue-200"
                    >
                      Book Now
                    </button>

                    <div className="border border-gray-200 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl font-semibold text-gray-700 bg-white">
                      View Details
                    </div>

                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}