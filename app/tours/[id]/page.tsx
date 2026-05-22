"use client";

import { useEffect, useState, use } from "react";

export default function TourDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);

  const [tour, setTour] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);  
  const [comment, setComment] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("Sunrise");
  const [travelers, setTravelers] = useState(2);
  const [bookingStatus, setBookingStatus] = useState("");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/tours/${params.id}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        setTour(data);

        const reviewRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/${params.id}`,
          {
            credentials: "include",
          }
        );
        const reviewData = await reviewRes.json();
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      } catch (err) {
        console.error("Failed to load tour data", err);
      }
    };

    fetchTour();
  }, [params.id]);

  const handleReviewSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tourId: params.id,
            rating,
            comment,
          }),
        }
      );

      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setComment("");
        setRating(5);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async () => {
    setBookingStatus("Processing...");

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
            tourId: params.id,
            travelDate: travelDate || new Date().toISOString().split('T')[0], // Fallback to today if empty
            timeSlot,
            travelers,
            advanceAmount: Math.floor(tour.price * 0.3),
          }),
        }
      );

      if (res.ok) {
        setBookingStatus("Booking confirmed successfully! 🎉");
      } else {
        const errorData = await res.json();
        console.error("Booking error details:", errorData);
        setBookingStatus("Booking failed. Please try again.");
      }
    } catch (err) {
      setBookingStatus("An error occurred during booking.");
      console.error(err);
    }
  };


  if (!tour) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* HERO */}
      <div className="relative h-100">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-8 text-white">
            <h1 className="text-4xl font-black">{tour.title}</h1>
            <p className="mt-2 text-lg">Starting from ₹{tour.price}/person</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow border p-6">
          <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
          <p className="text-gray-700 leading-relaxed">{tour.description}</p>
        </div>

        {/* GALLERY */}
        {tour.gallery && tour.gallery.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tour.gallery.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt="Gallery image"
                  className="rounded-3xl h-72 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* HIGHLIGHTS */}
        {tour.highlights && tour.highlights.length > 0 && (
          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-bold mb-6">Highlights</h2>
            <div className="space-y-3">
              {tour.highlights.map((item: string, index: number) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="text-blue-600">✨</div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INCLUSIONS & EXCLUSIONS */}
        <div className="grid md:grid-cols-2 gap-6">
          {tour.inclusions && (
            <div className="bg-white rounded-3xl shadow border p-6">
              <h2 className="text-2xl font-bold mb-6 text-green-700">Included</h2>
              <div className="space-y-3">
                {tour.inclusions.map((item: string, index: number) => (
                  <p key={index}>✅ {item}</p>
                ))}
              </div>
            </div>
          )}

          {tour.exclusions && (
            <div className="bg-white rounded-3xl shadow border p-6">
              <h2 className="text-2xl font-bold mb-6 text-red-700">Excluded</h2>
              <div className="space-y-3">
                {tour.exclusions.map((item: string, index: number) => (
                  <p key={index}>❌ {item}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="bg-white rounded-3xl shadow border p-6">
          <h2 className="text-2xl font-bold mb-6">Tour Details</h2>
          <div className="space-y-3">
            <p><strong>Duration:</strong> {tour.duration}</p>
            <p><strong>Pickup:</strong> {tour.pickupPoint}</p>
          </div>
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white rounded-3xl shadow border p-6 space-y-6">
          <h2 className="text-3xl font-black">Customer Reviews</h2>

          {/* REVIEW FORM */}
          <div className="space-y-4">
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border p-3 rounded-2xl w-full"
            >
              <option value={5}>⭐⭐⭐⭐⭐</option>
              <option value={4}>⭐⭐⭐⭐</option>
              <option value={3}>⭐⭐⭐</option>
              <option value={2}>⭐⭐</option>
              <option value={1}>⭐</option>
            </select>

            <textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-4 rounded-2xl w-full h-32"
            />

            <button
              onClick={handleReviewSubmit}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition"
            >
              Submit Review
            </button>
          </div>

          {/* REVIEWS LIST */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border rounded-2xl p-5 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-semibold">{review.user?.email || "Anonymous user"}</p>
                  <p>{"⭐".repeat(review.rating || 5)}</p>
                </div>
                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BOOKING CTA */}
        <div className="bg-white rounded-3xl shadow-xl border p-8 text-center space-y-6">
          <h2 className="text-3xl font-black">Ready to Book Your Adventure?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Date</label>
              <input 
                type="date" 
                value={travelDate} 
                onChange={(e) => setTravelDate(e.target.value)} 
                className="w-full border p-3 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time Slot</label>
              <select 
                value={timeSlot} 
                onChange={(e) => setTimeSlot(e.target.value)} 
                className="w-full border p-3 rounded-xl"
              >
                <option value="Sunrise">Sunrise</option>
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Travelers</label>
              <input 
                type="number" 
                min="1" 
                value={travelers} 
                onChange={(e) => setTravelers(Number(e.target.value))} 
                className="w-full border p-3 rounded-xl"
              />
            </div>
          </div>

          <button
            onClick={handleBooking}
            className="mt-4 bg-emerald-600 text-white font-bold px-10 py-4 rounded-2xl shadow-lg hover:bg-emerald-700 transition inline-block"
          >
            Confirm & Book Now
          </button>

          {bookingStatus && (
            <p className="text-center font-medium mt-2 text-indigo-600">{bookingStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
