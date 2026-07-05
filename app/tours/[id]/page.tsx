"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  const [language, setLanguage] = useState("English");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
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
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            tourId: params.id,
            rating,
            comment,
          }),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {

        alert(
          data.message ||
          "Unable to submit review"
        );

        return;

      }

      setReviews((prev) => [
        data,
        ...prev,
      ]);

      setComment("");

      setRating(5);

      alert(
        "Review submitted successfully!"
      );

    } catch (err) {

      console.error(err);

      alert(
        "Something went wrong"
      );

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
            guideLanguage: language,
            fullName,
            email,
            country,
            whatsapp,
            hotelPickup: hotelName,
            specialRequests,
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
        setBookingStatus(
          errorData.message ||
          "Booking failed. Please try again."
        );
      }
    } catch (err) {
      setBookingStatus(
        "Booking failed. Please try again."
      );
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

  let hoursUntilTour: number | null = null;

  if (travelDate) {
    let tourHour = 6;

    if (timeSlot === "Morning") tourHour = 9;
    if (timeSlot === "Afternoon") tourHour = 14;
    if (timeSlot === "Sunset") tourHour = 17;

    const selectedTourDateTime = new Date(
      `${travelDate}T${String(tourHour).padStart(2, "0")}:00:00`
    );

    hoursUntilTour =
      (selectedTourDateTime.getTime() - Date.now()) /
      (1000 * 60 * 60);
  }

  const daysUntilTour =
    hoursUntilTour !== null
      ? Math.floor(hoursUntilTour / 24)
      : null;

  const isLateBooking =
    hoursUntilTour !== null &&
    hoursUntilTour < 12;


  const galleryImages =
    tour.gallery?.filter(
      (img: string) => img !== tour.imageUrl
    ) || [];

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
            <div className="mt-3 flex flex-wrap items-center gap-4">

              <p className="text-2xl sm:text-3xl font-black text-white">
                ₹{tour.price.toLocaleString()}
                <span className="ml-1 text-base font-medium text-gray-200">
                  /person
                </span>
              </p>

              <div className="rounded-full bg-emerald-500 px-4 py-1 text-sm font-bold">
                Free Cancellation Available*
              </div>

            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {tour.duration && (
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  ⏰ {tour.duration}
                </span>
              )}

              {tour.pickupPoint && (
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  🚗 Pickup Included
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Starting from
            </p>

            <p className="text-2xl font-black text-emerald-600">
              ₹{tour.price.toLocaleString()}
              <span className="text-base font-medium text-gray-500">
                /person
              </span>
            </p>
          </div>

          <button
            onClick={() =>
              document
                .getElementById("booking-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-2xl bg-emerald-600 px-6 py-3 font-bold text-white hover:bg-emerald-700"
          >
            Book Now
          </button>

        </div>
      </div>

      
      {/* QUICK FACTS */}
      {/* <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-lg border p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <div className="text-center">
              <div className="text-3xl mb-2">⏰</div>
              <p className="font-bold">Duration</p>
              <p className="text-gray-600">
                {tour.duration || "N/A"}
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🚗</div>
              <p className="font-bold">Pickup</p>
              <p className="text-gray-600">
                {tour.pickupPoint || "N/A"}
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">🕒</div>
              <p className="font-bold">Pickup Time</p>
              <p className="text-gray-600">
                {tour.pickupTime || "N/A"}
              </p>
            </div>

            <div className="text-center">
              <div className="text-3xl mb-2">📅</div>
              <p className="font-bold">Availability</p>
              <p className="text-gray-600">
                Daily
              </p>
            </div>

          </div>
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">
        {/* DESCRIPTION */}
        <div className="bg-white rounded-3xl shadow border p-6">
          <h2 className="text-2xl font-bold mb-4">Tour Overview</h2>
          <p className="text-gray-700 leading-relaxed">{tour.description}</p>
        </div>


        {/* BOOKING CTA */}
        <div id="booking-section" className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
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

              {/* Payment Schedule */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 max-w-3xl mx-auto">
                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  💳 Payment Schedule
                </h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <p>
                    ✅ Reserve this tour with a <strong> 30% advance payment</strong>.
                  </p>
                  <p>
                    💰 The remaining <strong> 70%</strong> can be paid <strong> when your tour begins</strong> or at any convenient time during your tour.
                  </p>
                  <p>
                    🤝 No full payment is required before your travel date.
                  </p>
                </div>
              </div>
              
              <div className="max-w-3xl mx-auto bg-gray-50 border rounded-2xl p-6 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Travel Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {hoursUntilTour === null ? (
                    <p className="text-sm text-gray-500 mt-2">
                      📅 Select your preferred travel date.
                    </p>
                  ) : hoursUntilTour >= 24 ? (
                    <p className="text-sm text-green-700 mt-2">
                      ⏰ Tour starts in{" "}
                      <span className="font-semibold">
                        {daysUntilTour} {daysUntilTour === 1 ? "day" : "days"}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-amber-700 mt-2">
                      ⏰ Tour starts in{" "}
                      <span className="font-semibold">
                        {Math.floor(hoursUntilTour)} hours
                      </span>
                    </p>
                  )}
                  {hoursUntilTour !== null && hoursUntilTour < 12 && (
                    <p className="mt-2 text-sm text-red-600 font-medium">
                      ⚠ Fixed tours require at least 12 hours advance notice.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full border p-3 rounded-xl"
                  >
                    <option value="Sunrise">
                      Sunrise (6:00 AM)
                    </option>
                    <option value="Morning">
                      Morning (9:00 AM)
                    </option>
                    <option value="Afternoon">
                      Afternoon (2:00 PM)
                    </option>
                    <option value="Sunset">
                      Sunset (5:00 PM)
                    </option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Number of Travelers</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={travelers}
                    onChange={(e) => setTravelers(Number(e.target.value))}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Preferred Guide Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="English">🇬🇧 English</option>
                    <option value="Hindi">🇮🇳 Hindi</option>
                    <option value="French">🇫🇷 French</option>
                    <option value="Spanish">🇪🇸 Spanish</option>
                    <option value="German">🇩🇪 German</option>
                    <option value="Italian">🇮🇹 Italian</option>
                    <option value="Japanese">🇯🇵 Japanese</option>
                    <option value="Russian">🇷🇺 Russian</option>
                    <option value="Chinese">🇨🇳 Chinese</option>
                  </select>
                </div>
              </div>

              <div className="my-8 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <p className="text-sm text-gray-600">
                  Reserve your tour today with only
                </p>
                <p className="mt-2 text-4xl font-black text-emerald-600">
                  ₹{Math.floor(tour.price * travelers * 0.3).toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-gray-600">
                  30% advance • Remaining balance during your tour
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("traveler-info")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-5 rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-700"
                >
                  Continue Booking
                </button>
              </div>

              <div
                id="traveler-info"
                className="max-w-3xl mx-auto bg-gray-50 border rounded-2xl p-6 mt-8"
              >
                <h3 className="text-xl font-bold mb-5">
                  Lead Traveler Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      placeholder="john@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      placeholder="United Kingdom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full border p-3 rounded-xl"
                      placeholder="+44 7123456789"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-1">
                    Hotel / Pickup Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                    className="w-full border p-3 rounded-xl"
                    placeholder="Hotel name or pickup address"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-semibold mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full border p-3 rounded-xl"
                    rows={4}
                    placeholder="Dietary requirements, accessibility needs, child seat, etc."
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="flex flex-wrap justify-center gap-6 border-t border-gray-200 pt-6 mt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  🔒 <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  ⚡ <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center gap-2">
                  📞 <span>Customer Support</span>
                </div>
              </div>

              {hoursUntilTour !== null && isLateBooking && (
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
                  : "Reserve Your Tour"}
              </button>

              <div className="text-center mb-4">
                <Link
                  href="/refund-policy"
                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                >
                  📋 Refund Policy & Cancellation Policy →
                </Link>
              </div>

              {bookingStatus && (
                <p className="text-center text-sm sm:text-base font-medium mt-2 text-indigo-600">{bookingStatus}</p>
              )}
            </div>
          </div>
        </div>


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

        {/* ITINERARY */}
        {tour.itinerary?.length > 0 && (
          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-bold mb-6">
              Tour Itinerary
            </h2>

            <div className="space-y-4">
              {tour.itinerary.map((step: string, index: number) => (
                <div
                  key={index}
                  className="relative flex gap-5 pb-8"
                >
                  {/* Timeline Line */}
                  {index !== tour.itinerary.length - 1 && (
                    <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-300"></div>
                  )}

                  {/* Timeline Dot */}
                  <div className="relative z-10 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow shrink-0 mt-1"></div>

                  {/* Content */}
                  <div className="flex-1">
                      <p className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full">
                        {step.split("|")[0]}
                      </p>

                    <p className="text-gray-700 mt-1 leading-relaxed">
                      {step.split("|")[1]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {galleryImages.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {galleryImages.map((img: string, index: number) => (
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

        {/* WHY BOOK WITH TOURGEN */}

        <div className="bg-white rounded-3xl shadow border p-6">
          <h2 className="text-2xl font-bold mb-6">
            Why Book With TourGen?
          </h2>

          <div className="mb-8 rounded-2xl bg-blue-50 border border-blue-100 p-5">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🛡️</div>

              <div>
                <h3 className="font-semibold text-lg text-gray-900">
                  Book with confidence
                </h3>

                <p className="text-gray-600 mt-2">
                  Every TourGen experience is designed to provide transparent pricing,
                  professional service, and dedicated support from booking to the end
                  of your journey.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div className="flex gap-4">
              <div className="text-3xl">🏛️</div>

              <div>
                <h3 className="font-semibold">
                  Local Expertise
                </h3>

                <h4 className="font-semibold">
                  Carefully Curated Tours
                </h4>

                <p className="text-gray-600 text-sm mt-1">
                  Every tour is thoughtfully planned to help you experience Agra's most iconic attractions with comfort and convenience.
                </p>

                <p className="text-gray-600 text-sm mt-1">
                  Transparent Pricing
                  No hidden charges. You'll always know exactly what's included before you book.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">💳</div>

              <div>
                <h3 className="font-semibold">
                  Secure Online Payments
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  Pay safely using trusted online payment methods.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">🚗</div>

              <div>
                <h3 className="font-semibold">
                  Comfortable Transportation
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  Clean, air-conditioned vehicles with professional drivers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="text-3xl">📞</div>

              <div>
                <h3 className="font-semibold">
                  Dedicated Support
                </h3>

                <p className="text-gray-600 text-sm mt-1">
                  Our team is available to assist you before and during your tour.
                </p>
              </div>
            </div>

          </div>
        </div>

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
                <div className="bg-gray-50 rounded-2xl border p-5">
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
                <div
                  key={review.id}
                  className="bg-white border rounded-3xl shadow-sm p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-lg">
                        {review.user?.email?.split("@")[0] || "Anonymous"}
                      </p>

                      <p className="text-sm text-gray-500">
                        Verified Traveler
                      </p>
                    </div>
                    <div className="text-yellow-500 text-lg">
                      {"⭐".repeat(review.rating || 5)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-7">
                    {review.comment}
                </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">
                  ⭐
                </div>

                <p className="font-semibold text-lg">
                  No Reviews Yet
                </p>

                <p className="text-gray-500 mt-2">
                  Be the first traveler to share your experience.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* FAQs */}
        {tour.faq?.length > 0 && (
          <div className="bg-white rounded-3xl shadow border p-6">
            <h2 className="text-2xl font-bold mb-6">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {tour.faq.map((item: string, index: number) => {
                const [question, answer] = item.split("|");

                return(
                  <div
                    key={index}
                    className="border rounded-2xl bg-gray-50 p-5 hover:bg-gray-100 transition"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl shrink-0">
                        ❓
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {item.split("|")[0]}
                        </h3>

                        <p className="text-gray-600 mt-2 leading-relaxed">
                          {item.split("|")[1]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}
