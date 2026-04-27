"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function ToursPage() {
  
  const [tours, setTours] = useState<any[]>([]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch(
          "https://ai-travel-backend-production.up.railway.app/tours"
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
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }

      const res = await fetch(
        "https://ai-travel-backend-production.up.railway.app/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold text-center">
          Explore Tours ✨
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {tours.map((tour: any) => (
            <div
              key={tour.id}
              className="bg-white p-6 rounded-2xl shadow-md space-y-3"
            >
              <h2 className="text-xl font-semibold">{tour.title}</h2>
              <p className="text-gray-600">{tour.description}</p>

              <div className="flex justify-between items-center pt-3">
                <span className="font-bold text-lg">
                  ₹{tour.price}
                </span>

                <button
                  onClick={() => handleBooking(tour.id)}
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