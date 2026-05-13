"use client";

import { useEffect, useState } from "react";

export default function TourDetailsPage({
  params,
}: any) {

  const [tour, setTour] = useState<any>(null);

  useEffect(() => {

    const fetchTour = async () => {

      const res = await fetch(
        `https://ai-travel-backend-production.up.railway.app/tours/${params.id}`
      );

      const data = await res.json();

      setTour(data);
    };

    fetchTour();

  }, [params.id]);

  if (!tour) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">

      {/* HERO */}
      <div className="relative h-[400px]">

        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-end">

          <div className="p-8 text-white">

            <h1 className="text-4xl font-black">
              {tour.title}
            </h1>

            <p className="mt-2 text-lg">
              Starting from ₹{tour.price}/person
            </p>

          </div>

        </div>

      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">

        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-4">
            Tour Overview
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {tour.description}
          </p>

        </div>

        {/* GALLERY */}
        <div>

          <h2 className="text-2xl font-bold mb-6">
            Gallery
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {tour.gallery.map((img: string, index: number) => (
              <img
                key={index}
                src={img}
                className="rounded-3xl h-72 w-full object-cover"
              />
            ))}

          </div>

        </div>

        {/* HIGHLIGHTS */}
        <div className="bg-white rounded-3xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-6">
            Highlights
          </h2>

          <div className="space-y-3">

            {tour.highlights.map(
              (item: string, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 items-start"
                >
                  <div className="text-blue-600">
                    ✨
                  </div>

                  <p>{item}</p>
                </div>
              )
            )}

          </div>

        </div>

        {/* INCLUSIONS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-3xl shadow border p-6">

            <h2 className="text-2xl font-bold mb-6 text-green-700">
              Included
            </h2>

            <div className="space-y-3">

              {tour.inclusions.map(
                (item: string, index: number) => (
                  <p key={index}>
                    ✅ {item}
                  </p>
                )
              )}

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow border p-6">

            <h2 className="text-2xl font-bold mb-6 text-red-700">
              Excluded
            </h2>

            <div className="space-y-3">

              {tour.exclusions.map(
                (item: string, index: number) => (
                  <p key={index}>
                    ❌ {item}
                  </p>
                )
              )}

            </div>

          </div>

        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-3xl shadow border p-6">

          <h2 className="text-2xl font-bold mb-6">
            Tour Details
          </h2>

          <div className="space-y-3">

            <p>
              <strong>Duration:</strong>{" "}
              {tour.duration}
            </p>

            <p>
              <strong>Pickup:</strong>{" "}
              {tour.pickupPoint}
            </p>

          </div>

        </div>

        {/* CTA */}
        <div className="bg-white rounded-3xl shadow-xl border p-8 text-center space-y-4">

          <h2 className="text-3xl font-black">
            Ready to Explore Agra?
          </h2>

          <p className="text-gray-600">
            Talk with our travel experts and book your experience today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <a
              href={`https://wa.me/917599921173?text=${encodeURIComponent(
                `Hi, I'm interested in the ${tour.title} tour.`
              )}`}
              target="_blank"
              className="bg-green-500 text-white px-6 py-4 rounded-2xl font-semibold"
            >
              Talk on WhatsApp
            </a>

          </div>

        </div>

      </div>

    </div>
  );
}