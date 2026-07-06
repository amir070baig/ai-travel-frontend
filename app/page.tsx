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
          { credentials: "include" }
        );
        const data = await res.json();
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
                  if (b.rating !== a.rating) return b.rating - a.rating;
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                })
                .slice(0, 3)
            : []
        );
      } catch (err) {
        console.error("Error fetching reviews:", err);
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
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold shadow-xs">
              💳 Only 30% Advance Required
            </span>
            <span className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold shadow-xs">
              🤝 Pay the Rest During Your Tour
            </span>
          </div>

          {/* Fixed Text Visibility: Adjusted font layout from white to high-contrast slate */}
          <h1 className="max-w-5xl mx-auto text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-tight text-slate-900">
            Book the Best{" "}
            <span className="block text-blue-600 mt-2">
              Taj Mahal & Agra Tours
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-bold mt-6 tracking-normal">
              or Create Your Own AI Travel Itinerary
            </span>
          </h1>

          <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg">
            Choose from professionally curated <strong>Taj Mahal and Agra tours</strong>, 
            or let our <strong>AI travel planner</strong> create a personalized itinerary that is 
            reviewed by our local travel experts before you book.
          </p>

          {/* Restored and Redesigned Hero Call To Action Buttons */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto justify-center items-center gap-4 pt-6">
            <a
              href="/generate"
              className="w-full sm:w-auto bg-linear-to-r from-blue-600 to-indigo-600 hover:opacity-95 transition-all text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 text-center"
            >
              🤖 Generate AI Trip
            </a>
            <a
              href="/tours"
              className="w-full sm:w-auto bg-white border border-gray-200 hover:bg-gray-50 transition-all text-gray-900 px-8 py-4 rounded-2xl font-bold text-center shadow-xs"
            >
              Explore Tours
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <a href="/agra-tours" className="hover:text-blue-600 transition">Best Agra Tours</a>
            <span>•</span>
            <a href="/tours" className="hover:text-blue-600 transition">Taj Mahal Sunrise Tours</a>
            <span>•</span>
            <a href="/generate" className="hover:text-blue-600 transition">Generate AI Itinerary</a>
          </div>
        </div>
      </div>

      {/* QUICK VALUE PROPS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-4xl mb-4">🧠</p>
            <h3 className="font-bold text-base text-gray-900">AI-Powered Itineraries</h3>
            <p className="text-gray-500 text-xs leading-relaxed mt-2">
              Personalized travel plans based on your interests, budget and travel style.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-4xl mb-4">🏨</p>
            <h3 className="font-bold text-base text-gray-900">Hotel Pickup & Drop</h3>
            <p className="text-gray-500 text-xs leading-relaxed mt-2">
              Every itinerary is reviewed by experienced Agra travel specialists.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-4xl mb-4">🧳</p>
            <h3 className="font-bold text-base text-gray-900">Expert Support</h3>
            <p className="text-gray-500 text-xs leading-relaxed mt-2">
              WhatsApp Assistance: Chat with our team before, during and after your trip.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center">
            <p className="text-4xl mb-4">📍</p>
            <h3 className="font-bold text-base text-gray-900">Best-Selling Agra Tours</h3>
            <p className="text-gray-500 text-xs leading-relaxed mt-2">
              Private tours designed for unforgettable Taj Mahal experiences.
            </p>
          </div>
        </div>
      </div>

      {/* CHOOSE YOUR EXPERIENCE */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-bold uppercase tracking-wide text-sm">Two Ways to Experience Agra</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">Choose How You Want to Travel</h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-sm sm:text-base">
            Whether you already know which tour you want or need help planning your perfect journey, TourGen has you covered.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Ready Made Tours */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-6">Inbound Packages</div>
              <h3 className="text-2xl font-bold text-gray-900">Book Ready-Made Tours</h3>
              <p className="text-gray-600 mt-3 leading-relaxed text-sm">
                Choose from our professionally curated Taj Mahal, Agra Fort, Fatehpur Sikri and Delhi to Agra tours. Perfect if you want instant booking.
              </p>
              <ul className="mt-6 space-y-3 text-gray-700 text-sm">
                <li className="flex items-center gap-2"><span>✅</span> Instant booking</li>
                <li className="flex items-center gap-2"><span>✅</span> Fixed itinerary</li>
                <li className="flex items-center gap-2"><span>✅</span> Local guides</li>
                <li className="flex items-center gap-2"><span>✅</span> Only 30% advance payment</li>
              </ul>
            </div>
            <a
              href="/tours"
              className="inline-block mt-8 bg-blue-600 text-white text-center px-6 py-3.5 rounded-2xl font-semibold hover:bg-blue-700 transition"
            >
              Explore Tours →
            </a>
          </div>

          {/* AI Planner */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-md p-6 sm:p-8 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold">Create a Custom AI Trip</h3>
              <p className="text-blue-100 mt-3 leading-relaxed text-sm">
                Tell us your destination, budget and travel style. Our AI creates a personalized itinerary that is reviewed by our travel experts before booking.
              </p>
              <ul className="mt-6 space-y-3 text-blue-50 text-sm">
                <li className="flex items-center gap-2"><span>✅</span> Personalized itinerary</li>
                <li className="flex items-center gap-2"><span>✅</span> AI + Human expert review</li>
                <li className="flex items-center gap-2"><span>✅</span> Flexible travel planning</li>
                <li className="flex items-center gap-2"><span>✅</span> Custom pricing</li>
              </ul>
            </div>
            <a
              href="/generate"
              className="inline-block mt-8 bg-white text-blue-700 text-center px-6 py-3.5 rounded-2xl font-semibold hover:bg-gray-100 transition"
            >
              Generate My Trip →
            </a>
          </div>
        </div>
      </div>

      {/* HOW AI WORKS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-bold uppercase tracking-wide text-sm">AI Trip Planning Made Simple</p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-2">How AI + Local Experts Plan Your Trip</h2>
          <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-sm sm:text-base">
            We combine artificial intelligence with local travel expertise to create personalized journeys that match your budget and travel style.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs text-center">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-lg font-bold text-gray-900">Tell Us Your Plans</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">Share your destination, travel dates, budget and interests.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-bold text-gray-900">AI Creates Itinerary</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">Our AI generates a personalized itinerary tailored to your preferences.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs text-center">
            <div className="text-4xl mb-4">👨‍💼</div>
            <h3 className="text-lg font-bold text-gray-900">Local Expert Review</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">Our travel specialists verify routes, pricing and local recommendations.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs text-center">
            <div className="text-4xl mb-4">✈️</div>
            <h3 className="text-lg font-bold text-gray-900">Book & Travel</h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">Approve your itinerary, pay the advance and enjoy your journey.</p>
          </div>
        </div>
      </div>

      {/* TOURS PREVIEW */}
      <div className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
        <h2 className="text-3xl font-black mb-10 text-center text-gray-900">
          Most Popular Taj Mahal & Agra Tours
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <a key={tour.id} href={`/tours/${tour.id}`} className="group">
              <div className="h-full flex flex-col bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="overflow-hidden h-52 relative">
                  <img
                    src={tour.imageUrl}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />
                </div>

                <div className="p-6 space-y-4 flex flex-col flex-1 justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                        Bestseller
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        💳 30% Deposit
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                      {tour.title}
                    </h3>

                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Starting From</p>
                      <p className="text-2xl font-black text-gray-900">
                        ₹{tour.price.toLocaleString()}
                        <span className="text-xs font-normal text-gray-500 ml-0.5">/person</span>
                      </p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-lg">
          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-12 lg:p-16">
            <div>
              <p className="text-blue-400 font-bold uppercase tracking-wider text-xs">Trusted Travel Planning</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Why Travelers Choose TourGen</h2>
              <p className="text-slate-300 mt-4 leading-relaxed text-base sm:text-lg">
                We combine modern AI technology with experienced local travel experts to deliver stress-free travel planning and unforgettable Agra experiences.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl">⭐</div>
                <h3 className="text-white font-bold text-sm mt-2">Local Experts</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl">🤖</div>
                <h3 className="text-white font-bold text-sm mt-2">AI + Human Planning</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl">💬</div>
                <h3 className="text-white font-bold text-sm mt-2">WhatsApp Support</h3>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-2xl">🔒</div>
                <h3 className="text-white font-bold text-sm mt-2">Secure Booking</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WHY BOOK WITH US CARD GRID */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-bold uppercase tracking-wide text-sm">Why Travelers Choose TourGen</p>
          <h2 className="text-3xl font-black text-gray-900 mt-2">Book With Confidence</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm">
            We combine local expertise, flexible payments and personalized support to make your Agra experience simple and stress-free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">💳</div>
            <h3 className="font-bold text-gray-900 text-lg">Only 30% to Reserve</h3>
            <p className="text-gray-500 mt-2 text-xs leading-relaxed">
              Secure your booking today and pay the remaining balance when your tour begins.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="font-bold text-gray-900 text-lg">AI + Local Experts</h3>
            <p className="text-gray-500 mt-2 text-xs leading-relaxed">
              AI creates your itinerary, then our local travel specialists personally review it.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="font-bold text-gray-900 text-lg">Private Experiences</h3>
            <p className="text-gray-500 mt-2 text-xs leading-relaxed">
              Carefully selected tours with experienced local guides and flexible scheduling.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-bold text-gray-900 text-lg">Real Human Support</h3>
            <p className="text-gray-500 mt-2 text-xs leading-relaxed">
              Need help? Chat with us on WhatsApp before, during and after your trip.
            </p>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-bold uppercase tracking-wide text-sm">Real Traveler Reviews</p>
          <h2 className="text-3xl font-black text-gray-900 mt-2">Travelers Love Their TourGen Experience</h2>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-sm">
            Read genuine feedback from travelers who booked tours or created personalized itineraries with TourGen.
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl text-blue-200 font-serif leading-none mb-2">“</div>
                  <div className="text-amber-500 text-sm tracking-wide">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p className="mt-4 text-gray-600 leading-relaxed text-sm italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="border-t border-gray-100 mt-6 pt-4 space-y-1 text-xs text-gray-400 font-medium">
                  <p className="text-emerald-600 font-semibold flex items-center gap-1"><span>✔</span> Verified AI Traveler</p>
                  <p>📍 {review.itinerary?.city || "Agra"}</p>
                  <p>🗓 {review.itinerary?.days || "1"} Day Trip • 👥 {review.itinerary?.groupSize || "2"} Travelers</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <a
            href="/ai-reviews"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-semibold shadow-xs transition"
          >
            Read More Traveler Stories →
          </a>
        </div>
      </div>

      {/* LEAD INTAKE CONSULTATION FORM */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10">
          <h2 className="text-3xl font-black text-center text-gray-900">Need Help Planning Your Trip?</h2>
          <p className="text-center text-gray-500 mt-2 max-w-xl mx-auto text-sm">
            Not sure which tour is right for you? Tell us about your travel plans and our Agra travel experts will recommend the perfect experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <input
              placeholder="Your Name"
              type="text"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="border border-gray-300 bg-white rounded-xl p-3.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden"
            />

            <input
              placeholder="Your Email"
              type="email"
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              className="border border-gray-300 bg-white rounded-xl p-3.5 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden"
            />

            <input
              placeholder="Phone Number"
              type="text"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              className="border border-gray-300 bg-white p-3.5 text-sm rounded-xl md:col-span-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden"
            />

            <textarea
              placeholder="Tell us about your trip plans..."
              value={leadMessage}
              onChange={(e) => setLeadMessage(e.target.value)}
              className="border border-gray-300 bg-white p-3.5 text-sm rounded-xl h-36 md:col-span-2 resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden"
            />
          </div>

          <button
            onClick={async () => {
              if(!leadName || !leadEmail) {
                alert("Please complete required Name and Email inputs.");
                return;
              }
              await fetch("/leads", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: leadName,
                  email: leadEmail,
                  phone: leadPhone,
                  message: leadMessage,
                }),
              });
              alert("Our travel experts will contact you shortly ✅");
              setLeadName("");
              setLeadEmail("");
              setLeadPhone("");
              setLeadMessage("");
            }}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold mt-6 hover:bg-blue-700 transition shadow-md shadow-blue-100"
          >
            Get Free Travel Advice →
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-slate-950 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            
            {/* BRAND */}
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">TourGen</h3>
              <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                Premium AI-powered travel planning, curated Agra tours, and personalized local experiences.
              </p>
            </div>

            {/* SEO LINKS */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-200 mb-4">Explore</h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="/agra-tours" className="text-slate-400 hover:text-white transition">Agra Tours</a>
                <a href="/tours" className="text-slate-400 hover:text-white transition">Taj Mahal Experiences</a>
                <a href="/generate" className="text-slate-400 hover:text-white transition">Luxury Agra Trips</a>
              </div>
            </div>

            {/* LEGAL - Fixed color contrast from text-gray-600 to text-slate-400 */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-200 mb-4">Legal</h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="/terms" className="text-slate-400 hover:text-white transition">Terms & Conditions</a>
                <a href="/refund-policy" className="text-slate-400 hover:text-white transition">Refund Policy</a>
                <a href="/privacy" className="text-slate-400 hover:text-white transition">Privacy Policy</a>
                <a href="/contact" className="text-slate-400 hover:text-white transition">Contact Us</a>
              </div>
            </div>

            {/* CONTACT - Fixed color contrast from text-gray-600 to text-slate-300 */}
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wider text-slate-200 mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p>WhatsApp: +91 75999 21173</p>
                <p>Email: tourgenteam@gmail.com</p>
                <p>Agra, India</p>
                <a
                  href="https://wa.me/917599921173"
                  target="_blank"
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 transition font-bold text-white text-xs px-4 py-2.5 rounded-xl mt-2"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="border-t border-slate-800 mt-12 pt-6 text-center text-slate-500 text-xs">
            © 2026 TourGen. All rights reserved.
          </div>
        </div>
      </div>

    </div>
  );
}