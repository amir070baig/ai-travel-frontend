"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);

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

        console.log("TOURS:", data);

        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tours:", err);
        setTours([]);
      }
    };

    fetchTours();

    const fetchReviews = async () => {

      try {

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/reviews/ai`
        );

        const data = await res.json();

        setReviews(
          Array.isArray(data)
            ? data
                .sort((a, b) => {
                  if (b.rating !== a.rating) {
                    return b.rating - a.rating;
                  }

                  return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                  );
                })
                .slice(0, 3)
            : []
        );

      } catch (err) {

        console.error(
          "Error fetching reviews:",
          err
        );

      }

    };

    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">

        <div className="text-center space-y-6">

          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-sm text-gray-600">
            🕌 Agra Tours • 🤖 AI Trip Planner • ⭐ Local Experts
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-5">

            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              💳 Only 30% Advance Required
            </span>

            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              🤝 Pay the Rest During Your Tour
            </span>

          </div>

          <h1 className="max-w-5xl mx-auto text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight text-white">

            Book the Best
            <span className="block text-blue-600">
              Taj Mahal & Agra Tours
            </span>

            <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-700 font-bold mt-6">
              or Create Your Own AI Travel Itinerary
            </span>

          </h1>

          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg">

            Choose from professionally curated
            <strong> Taj Mahal and Agra tours</strong>,
            or let our
            <strong> AI travel planner</strong>
            create a personalized itinerary that is
            reviewed by our local travel experts before
            you book.

          </p>
          

          <div className="flex flex-wrap justify-center gap-4 mt-6">

            <a
              href="/agra-tours"
              className="text-blue-600 font-semibold hover:underline"
            >
              Best Agra Tours
            </a>

            <a
              href="/tours"
              className="text-blue-600 font-semibold hover:underline"
            >
              Taj Mahal Sunrise Tours
            </a>

            <a
              href="/generate"
              className="text-blue-600 font-semibold hover:underline"
            >
              Generate AI Itinerary
            </a>

          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center gap-4 pt-4">

            <a
              href="/generate"
              className="bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition-all text-white px-7 py-4 rounded-2xl font-semibold shadow-lg shadow-blue-200"
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

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-5xl mb-5">🧠</p>
            <h3 className="font-bold text-lg text-gray-900">
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                🤖AI-Powered Itineraries
                Personalized travel plans based on your interests, budget and travel style.
              </p>
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-5xl mb-5">🏨</p>
            <h3 className="font-bold text-lg text-gray-900">
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                👨‍💼Local Travel Experts
                Every itinerary is reviewed by experienced Agra travel specialists.
              </p>
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-5xl mb-5">🧳</p>
            <h3 className="font-bold text-lg text-gray-900">
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                📞Expert Support
                💬WhatsApp Assistance
                Need help? Chat with our team before, during and after your trip.
              </p>
            </h3>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-5xl mb-5">📍</p>
            <h3 className="font-bold text-lg text-gray-900">
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                🕌Best-Selling Agra Tours
                Private tours designed for unforgettable Taj Mahal experiences.
              </p>
            </h3>
          </div>

        </div>

      </div>

      {/* CHOOSE YOUR EXPERIENCE */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        <div className="text-center mb-14">

          <p className="text-blue-600 font-semibold">
            Two Ways to Experience Agra
          </p>

          <h2 className="text-4xl font-black mt-3">
            Choose How You Want to Travel
          </h2>

          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            Whether you already know which tour you want or need help planning your
            perfect journey, TourGen has you covered.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          {/* Ready Made Tours */}

          <div className="bg-white rounded-3xl border shadow-lg p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">

            <div className="text-5xl mb-6">
              🕌
            </div>

            <h3 className="text-2xl font-bold">
              Book Ready-Made Tours
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Choose from our professionally curated Taj Mahal,
              Agra Fort, Fatehpur Sikri and Delhi to Agra tours.
              Perfect if you want instant booking.
            </p>

            <ul className="mt-6 space-y-3 text-gray-700">

              <li>✅ Instant booking</li>

              <li>✅ Fixed itinerary</li>

              <li>✅ Local guides</li>

              <li>✅ Only 30% advance payment</li>

            </ul>

            <a
              href="/tours"
              className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
            >
              Explore Tours →
            </a>

          </div>

          {/* AI Planner */}

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all">

            <div className="text-5xl mb-6">
              🤖
            </div>

            <h3 className="text-2xl font-bold">
              Create a Custom AI Trip
            </h3>

            <p className="text-blue-100 mt-4 leading-relaxed">
              Tell us your destination, budget and travel style.
              Our AI creates a personalized itinerary that is
              reviewed by our travel experts before booking.
            </p>

            <ul className="mt-6 space-y-3 text-blue-50">

              <li>✅ Personalized itinerary</li>

              <li>✅ AI + Human expert review</li>

              <li>✅ Flexible travel planning</li>

              <li>✅ Custom pricing</li>

            </ul>

            <a
              href="/generate"
              className="inline-block mt-8 bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold hover:bg-gray-100 transition"
            >
              Generate My Trip →
            </a>

          </div>

        </div>

      </div>

      {/* HOW AI WORKS */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        <div className="text-center mb-14">

          <p className="text-blue-600 font-semibold">
            AI Trip Planning Made Simple
          </p>

          <h2 className="text-4xl font-black mt-3">
            How AI + Local Experts Plan Your Trip
          </h2>

          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            We combine artificial intelligence with local travel expertise to create
            personalized journeys that match your budget and travel style.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl border p-6 shadow-sm text-center">

            <div className="text-5xl mb-5">
              ✍️
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Tell Us Your Plans
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Share your destination, travel dates, budget and interests.
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-6 shadow-sm text-center">

            <div className="text-5xl mb-5">
              🤖
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              AI Creates Your Itinerary
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Our AI generates a personalized itinerary tailored to your preferences.
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-6 shadow-sm text-center">

            <div className="text-5xl mb-5">
              👨‍💼
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Local Experts Review It
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Our travel specialists verify routes, pricing and local recommendations.
            </p>

          </div>

          <div className="bg-white rounded-3xl border p-6 shadow-sm text-center">

            <div className="text-5xl mb-5">
              ✈️
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Book & Travel
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Approve your itinerary, pay the advance and enjoy your journey.
            </p>

          </div>

        </div>

      </div>


      <div className="max-w-6xl mx-auto px-4">
        <div className="border-t border-gray-200"></div>
      </div>


      {/* TOURS PREVIEW */}
      <div className="max-w-6xl mx-auto py-20 lg:py-24 px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-black mb-10 text-center text-gray-900">
          Most Popular Taj Mahal & Agra Tours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <a key={tour.id} href={`/tours/${tour.id}`}>
              <div className="h-full flex flex-col bg-white/90 backdrop-blur border border-white/40 rounded-3xl overflow-hidden shadow-xl shadow-black/5 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="overflow-hidden">
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="w-full h-52 object-cover hover:scale-105 transition-all duration-500"
                  />
                </div>

                <div className="p-6 space-y-3 flex flex-col flex-1">

                  <div className="flex flex-wrap gap-2">

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                      Bestseller
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      💳 Only 30% to Reserve
                    </span>

                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                      🚗 Hotel Pickup Included
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

                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold">
                      View Tour →
                    </div>

                  </div>

                </div>
              </div>
            </a>
          ))}
        </div>
      </div>


      {/* TRUST SECTION */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden">

          <div className="grid lg:grid-cols-2 gap-10 items-center p-10 lg:p-16">

            <div>

              <p className="text-blue-400 font-semibold">
                Trusted Travel Planning
              </p>

              <h2 className="text-4xl font-black text-white mt-3">
                Why Travelers Choose TourGen
              </h2>

              <p className="text-slate-300 mt-6 leading-relaxed text-lg">

                We combine modern AI technology with experienced local travel experts
                to deliver stress-free travel planning and unforgettable Agra
                experiences.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <div className="bg-white/10 rounded-2xl p-6">

                <div className="text-3xl">
                  ⭐
                </div>

                <h3 className="text-white font-bold mt-3">
                  Local Experts
                </h3>

              </div>

              <div className="bg-white/10 rounded-2xl p-6">

                <div className="text-3xl">
                  🤖
                </div>

                <h3 className="text-white font-bold mt-3">
                  AI Planning
                </h3>

              </div>

              <div className="bg-white/10 rounded-2xl p-6">

                <div className="text-3xl">
                  💬
                </div>

                <h3 className="text-white font-bold mt-3">
                  WhatsApp Support
                </h3>

              </div>

              <div className="bg-white/10 rounded-2xl p-6">

                <div className="text-3xl">
                  🔒
                </div>

                <h3 className="text-white font-bold mt-3">
                  Secure Booking
                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

      

      {/* Why book with us */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20">

        <div className="text-center mb-14">

          <p className="text-blue-600 font-semibold">
            Why Travelers Choose TourGen
          </p>

          <h2 className="text-4xl font-black mt-3">
            Book With Confidence
          </h2>

          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
            We combine local expertise, flexible payments and personalized support
            to make your Agra experience simple and stress-free.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

            <div className="text-5xl mb-5">💳</div>

            <h3 className="text-xl font-bold text-gray-900">
              Only 30% to Reserve
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Secure your booking today and pay the remaining balance when your tour begins.
            </p>

          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

            <div className="text-5xl mb-5">🤖</div>

            <h3 className="text-xl font-bold text-gray-900">
              AI + Local Experts
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              AI creates your itinerary, then our local travel specialists personally review it.
            </p>

          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

            <div className="text-5xl mb-5">⭐</div>

            <h3 className="text-xl font-bold text-gray-900">
              Private Experiences
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Carefully selected tours with experienced local guides and flexible scheduling.
            </p>

          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">

            <div className="text-5xl mb-5">📱</div>

            <h3 className="text-xl font-bold text-gray-900">
              Real Human Support
            </h3>

            <p className="text-gray-600 mt-4 leading-relaxed">
              Need help? Chat with us on WhatsApp before, during and after your trip.
            </p>

          </div>

        </div>

      </div>

      


      {/* Payment Banner */}
      {/* <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">

          <div className="text-center">

            <h2 className="text-2xl sm:text-3xl font-black">
              💳 Book with Confidence
            </h2>

            <p className="mt-4 text-blue-100 text-lg leading-relaxed max-w-3xl mx-auto">
              Reserve your tour today with only
              <strong> 30% advance payment</strong>.
              Pay the remaining
              <strong> 70%</strong>
              when your tour begins or anytime during your journey.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white/10 rounded-2xl p-5">

                <div className="text-3xl mb-3">
                  💳
                </div>

                <h3 className="font-bold">
                  Only 30% Today
                </h3>

                <p className="text-sm text-blue-100 mt-2">
                  Secure your booking with a small advance payment.
                </p>

              </div>

              <div className="bg-white/10 rounded-2xl p-5">

                <div className="text-3xl mb-3">
                  🤝
                </div>

                <h3 className="font-bold">
                  Pay Later
                </h3>

                <p className="text-sm text-blue-100 mt-2">
                  Pay the remaining balance when your tour begins.
                </p>

              </div>

              <div className="bg-white/10 rounded-2xl p-5">

                <div className="text-3xl mb-3">
                  🔒
                </div>

                <h3 className="font-bold">
                  Secure Booking
                </h3>

                <p className="text-sm text-blue-100 mt-2">
                  Transparent pricing with secure online payments.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div> */}


      {/* AI SUCCESS STORIES */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-24">

        <div className="text-center mb-12">

          <p className="text-blue-600 font-semibold">

            Real Traveler Reviews

          </p>

          <h2 className="text-4xl font-black mt-3">

            Travelers Love Their TourGen Experience

          </h2>

          <p className="text-gray-600 mt-4 max-w-3xl mx-auto">

            Read genuine feedback from travelers who booked tours or created personalized itineraries with TourGen.

          </p>

        </div>

        {reviews.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {reviews.map((review) => (

                <div
                  key={review.id}
                  className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col"
                >

                  <div className="text-5xl text-blue-100 leading-none mb-3">
                    “
                  </div>

                  <div className="text-2xl tracking-wide">

                    {"⭐".repeat(review.rating)}

                  </div>

                  <p className="mt-5 text-gray-700 leading-relaxed italic">

                    "{review.comment}"

                  </p>

                  <div className="border-t border-gray-100 my-6"></div>

                  <div className="mt-auto space-y-2 text-sm text-gray-600">

                    <p>

                      ✔ Verified AI Traveler

                    </p>

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

                </div>

              ))}

            </div>
          )
        }

        <div className="text-center mt-10">

          <a
            href="/ai-reviews"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-3xl font-semibold transition"
          >

            Read More Traveler Stories →

          </a>

        </div>

      </div>



      <div className="max-w-4xl mx-auto px-4 py-14">

        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-8 ">

          <h2 className="text-4xl font-black text-center">
            Need Help Planning Your Trip?
          </h2>

          <p className="text-center text-gray-600 mt-4">
            Not sure which tour is right for you? Tell us about your travel plans and our Agra travel experts will recommend the perfect experience.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-8">

            <input
              placeholder="Your Name"

              value={leadName}

              onChange={(e) =>
                setLeadName(
                  e.target.value
                )
              }

              className="border border-gray-300 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
            />

            <input
              placeholder="Your Email"

              value={leadEmail}

              onChange={(e) =>
                setLeadEmail(
                  e.target.value
                )
              }

              className="border border-gray-300 rounded-2xl p-4 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
            />

            <input
              placeholder="Phone Number"

              value={leadPhone}

              onChange={(e) =>
                setLeadPhone(
                  e.target.value
                )
              }

              className="border p-4 rounded-2xl md:col-span-2"
            />

            <textarea
              placeholder="Tell us about your trip plans..."

              value={leadMessage}

              onChange={(e) =>
                setLeadMessage(
                  e.target.value
                )
              }

              className="border p-4 rounded-2xl h-40 md:col-span-2"
            />

          </div>

          <button
            onClick={async () => {

              await fetch(
                "/leads",
                {
                  method: "POST",

                  credentials: "include",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    name: leadName,
                    email: leadEmail,
                    phone: leadPhone,
                    message: leadMessage,
                  }),
                }
              );

              alert(
                "Our travel experts will contact you shortly ✅"
              );

              setLeadName("");
              setLeadEmail("");
              setLeadPhone("");
              setLeadMessage("");

            }}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold mt-8 hover:shadow-md hover:border-blue-300"
          >
            Get Free Travel Advice →
          </button>

        </div>

      </div>


      


      {/* FOOTER */}

      <div className="bg-slate-950 text-white mt-20">

        <div className="max-w-6xl mx-auto px-6 py-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* BRAND */}

            <div>

              <h3 className="text-3xl font-extrabold tracking-tight text-white">
                TourGen
              </h3>

              <p className="text-slate-400 mt-4 leading-relaxed">
                Premium AI-powered travel planning,
                curated Agra tours, and personalized
                local experiences.
              </p>

            </div>

            {/* SEO LINKS */}

            <div>

              <h4 className="font-bold text-lg mb-4">
                Explore
              </h4>

              <div className="flex flex-col gap-3">

                <a
                  href="/agra-tours"
                  className="text-gray-600 hover:text-white transition"
                >
                  Agra Tours
                </a>

                <a
                  href="/tours"
                  className="text-gray-600 hover:text-white transition"
                >
                  Taj Mahal Experiences
                </a>

                <a
                  href="/generate"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Luxury Agra Trips
                </a>

              </div>

            </div>


            {/* LEGAL */}

            <div>

              <h4 className="font-bold text-lg mb-4">
                Legal
              </h4>

              <div className="flex flex-col gap-3">

                <a
                  href="/terms"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Terms & Conditions
                </a>

                <a
                  href="/refund-policy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Refund Policy
                </a>

                <a
                  href="/privacy"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </a>

                <a
                  href="/contact"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Contact Us
                </a>

              </div>

            </div>

            {/* CONTACT */}

            <div>

              <h4 className="font-bold text-lg mb-4">
                Contact
              </h4>

              <div className="space-y-3 text-gray-600">

                <p>
                  WhatsApp:
                  +91 75999 21173
                </p>

                <p>
                  Email:
                  tourgenteam@gmail.com
                </p>

                <p>
                  Agra, India
                </p>

                <a
                  href="https://wa.me/917599921173"
                  target="_blank"
                  className="inline-block bg-green-600 hover:bg-green-700 transition text-white px-5 py-3 rounded-2xl mt-3"
                >
                  Chat on WhatsApp
                </a>

              </div>

            </div>

          </div>

          {/* BOTTOM */}

          <div className="border-t border-slate-800 mt-12 pt-6 text-center text-gray-500 text-sm">

            © 2026 TourGen.
            All rights reserved.

          </div>

        </div>

      </div>

    </div>
  );
}