"use client";

import { useEffect, useState } from "react";

export default function AIReviewsPage() {

  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/ai`
        );

        const data = await res.json();

        setReviews(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        setReviews([]);

      } finally {

        setLoading(false);

      }

    };

    fetchReviews();

  }, []);

  const averageRating =
    reviews.length
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + review.rating,
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-500">
          Loading reviews...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-linear-to-r from-blue-700 to-indigo-700 text-white">

        <div className="max-w-6xl mx-auto py-20 px-6 text-center">

          <h1 className="text-5xl font-black">

            AI Concierge Success Stories

          </h1>

          <p className="mt-6 text-xl opacity-90 max-w-3xl mx-auto">

            Discover how travelers used TourGen's AI
            to create unforgettable journeys.

          </p>

        </div>

      </div>

      {/* Rating card */}
      <div className="max-w-6xl mx-auto px-6 -mt-12">

        <div className="bg-white rounded-3xl shadow-xl border p-8 text-center">

          <div className="text-6xl">
            ⭐
          </div>

          <h2 className="text-5xl font-black mt-4">
            {averageRating}
          </h2>

          <p className="mt-3 text-gray-600">
            Based on {reviews.length} verified AI travel experiences
          </p>

        </div>

      </div>

      {/* Review grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {reviews.length === 0 ? (

          <div className="text-center py-20">

            <h2 className="text-3xl font-bold">
              No success stories yet
            </h2>

            <p className="mt-4 text-gray-600">
              Be the first traveler to share your
              AI itinerary experience.
            </p>

          </div>

        ) : (

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {reviews.map((review) => (

              <div
                key={review.id}
                className="bg-white rounded-3xl border shadow-sm p-6 hover:shadow-xl transition flex flex-col h-full"
              >

                <div className="text-2xl">
                  {"⭐".repeat(review.rating)}
                </div>

                <p className="mt-5 leading-relaxed text-gray-700 line-clamp-4">
                  "{review.comment}"
                </p>

                <hr className="my-6" />

                <div className="space-y-2 text-sm">

                  <p>✔ Verified AI Traveler</p>

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

                <p className="mt-5 text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );

}