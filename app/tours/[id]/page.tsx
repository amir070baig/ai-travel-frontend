"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

export default function TourDetailsPage({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = use(paramsPromise);
  const router = useRouter();

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
      console.log(
        "ADVANCE AMOUNT:",
        Math.floor(tour.price * 0.3)
      );
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
            advanceAmount:
              tour?.price
                ? Math.floor(
                    tour.price *
                    travelers *
                    0.3
                  )
                : 0
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();

        setBookingStatus(
          "Redirecting to payment..."
        );

        router.push(
          `/payment/${data.booking.id}`
        );
      } else {
        const errorData = await res.json();
        console.error("Booking error details:", errorData);
        setBookingStatus("Booking failed. Please try again.");
      }
    } catch (err) {
      setBookingStatus("Booking failed. Please try again.");
      console.error(err);
    }
  };


  if (!tour) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const selectedDate = travelDate
    ? new Date(travelDate)
    : null;

  selectedDate?.setHours(0, 0, 0, 0);

  const selectedTravelDate =
    travelDate
      ? new Date(`${travelDate}T00:00:00`)
      : null;

  const hoursUntilTour =
    selectedTravelDate
      ? (
          selectedTravelDate.getTime() -
          Date.now()
        ) /
        (1000 * 60 * 60)
      : 9999;

  const isLateBooking =
    hoursUntilTour < 12;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">
      {/* HERO */}
      <div className="relative h-70 sm:h-100 md:h-125">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="p-4 sm:p-8 text-white">
            <h1 className="text-2xl sm:text-4xl font-black leading-tight">{tour.title}</h1>
            <p className="mt-2 text-sm sm:text-lg">Starting from ₹{tour.price}/person</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow border p-6">
          <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
          <p className="text-gray-700 leading-relaxed">{tour.description}</p>
        </div>

        {/* GALLERY */}
        {tour.gallery?.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tour.gallery.map((img: string, index: number) => (
                <img
                  key={index}
                  src={img}
                  alt="Gallery image"
                  className="rounded-3xl h-56 sm:h-72 w-full object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* HIGHLIGHTS */}
        {tour.highlights?.length > 0 && (
          <div className="bg-white rounded-3xl shadow border p-4 sm:p-6">
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
        {(tour.inclusions?.length > 0 || tour.exclusions?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tour.inclusions?.length > 0 && (
              <div className="bg-white rounded-3xl shadow border p-6">
                <h2 className="text-2xl font-bold mb-6 text-green-700">Included</h2>
                <div className="space-y-3">
                  {tour.inclusions.map((item: string, index: number) => (
                    <p key={index}>✅ {item}</p>
                  ))}
                </div>
              </div>
            )}

            {tour.exclusions?.length > 0 && (
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
        )}

        {/* DETAILS */}
        {(tour.duration || tour.pickupPoint || tour.pickupTime) && (
          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-bold mb-6">Tour Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tour.duration && (
                <div className="bg-gray-50 rounded-2xl border p-5">
                  <h3 className="font-bold text-lg mb-2">Duration</h3>
                  <p className="text-gray-600">{tour.duration}</p>
                </div>
              )}

              {tour.pickupPoint && (
                <div className="bg-gray-50 rounded-2xl border p-5">
                  <h3 className="font-bold text-lg mb-2">Pickup Point</h3>
                  <p className="text-gray-600">{tour.pickupPoint}</p>
                </div>
              )}

              {tour.pickupTime && (
                <div className="bg-white rounded-2xl border p-5">
                  <h3 className="font-bold text-lg mb-2">Pickup Time</h3>
                  <p className="text-gray-600">{tour.pickupTime}</p>
                </div>
              )}
            </div>
          </div>
        )}

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
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border rounded-2xl p-5 bg-gray-50">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between sm:items-center mb-3">
                    <p className="font-semibold truncate max-w-45">
                      {review.user?.email || "Anonymous user"}
                    </p>
                    <p>{"⭐".repeat(review.rating || 5)}</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic text-center py-4">No reviews yet. Be the first to leave one!</p>
            )}
          </div>
        </div>

        {/* BOOKING CTA */}
        <div className="bg-white rounded-3xl shadow-xl border p-4 sm:p-8 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black">Ready to Book Your Adventure?</h2>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm text-yellow-800 max-w-2xl mx-auto">
            A 30% advance payment is required to confirm your booking.
            Remaining amount can be paid before the trip date.
          </div>

          {/* EXACT PLACEMENT: Availability note renders cleanly contextually below the payment info */}
          {tour.availabilityNote && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 text-left max-w-2xl mx-auto">
              <h3 className="font-bold text-lg mb-2 text-yellow-900">
                Important Booking Information
              </h3>
              <p className="text-yellow-800">
                {tour.availabilityNote}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Date</label>
              <input 
                type="date" 
                value={travelDate} 
                onChange={(e) => setTravelDate(e.target.value)} 
                className="w-full border p-3 rounded-xl"
              />
              <p className="text-xs text-gray-500 mt-1">
                Fixed tours require at least 12 hours advance notice.
              </p>
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

          {isLateBooking && (
            <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-2xl p-4 mb-4">

              <p className="font-semibold">
                Advance Notice Required
              </p>

              <p className="mt-2">
                This tour requires at least 12 hours advance notice.
              </p>

              <p className="mt-2">
                For urgent or last-minute bookings, please contact TourGen directly.
              </p>

              <a
                href="https://wa.me/7599921173"
                target="_blank"
                className="block mt-3 text-green-600 underline"
              >
                Contact TourGen Support
              </a>

            </div>
          )}

          <button
            onClick={handleBooking}
            disabled={isLateBooking}
            className={`mt-4 w-full sm:w-auto text-white font-bold px-10 py-4 rounded-2xl shadow-lg transition ${
              isLateBooking
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLateBooking
              ? "Advance Notice Required"
              : "Confirm & Book Now"}
          </button>

          {bookingStatus && (
            <p className="text-center text-sm sm:text-base font-medium mt-2 text-indigo-600">{bookingStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}
