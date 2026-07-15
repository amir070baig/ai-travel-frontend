"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function HomePage() {
  const [tours, setTours] = useState<any[]>([]);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadMessage, setLeadMessage] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reference for smooth scrolling to the Experience Section
  const experienceSectionRef = useRef<HTMLDivElement>(null);

  const scrollToExperience = () => {
    experienceSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        setTours(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) {
      alert("Please fill in your name and email address so we can reach you. ✅");
      return;
    }

    setIsSubmitting(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/leads`, {
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
      alert("Our Agra travel experts will contact you shortly! ✅");
      setLeadName("");
      setLeadEmail("");
      setLeadPhone("");
      setLeadMessage("");
    } catch (err) {
      console.error("Error submitting lead:", err);
      alert("Something went wrong. Please try again or message us directly on WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/70 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">

      {/* NEW: LIVE AVAILABILITY SCARCITY BANNER */}
      <div className="bg-slate-900 text-white text-center py-2 px-4 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>High demand for sunrise slots. Secure your approved elite local guide and private transport today.</span>
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-12 lg:pt-24 overflow-hidden">
        <div className="text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xs px-4 py-2 rounded-full text-xs sm:text-sm text-slate-600 font-medium">
            💎 Elite Boutique Experiences • 📸 Built-in Vacation Photography • 🚫 100% Zero Shopping Traps
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <span className="bg-emerald-50/90 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
              👑 Directly Managed by Local Experts
            </span>
            <span className="bg-blue-50/90 border border-blue-200 text-blue-800 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-xs">
              🤝 Only 30% Deposit Required
            </span>
          </div>

          <h1 className="max-w-5xl mx-auto text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900">
            Don't Just Visit the Taj Mahal.{" "}
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 mt-2">
              Capture It Perfectly.
            </span>
            <span className="block text-xl sm:text-2xl lg:text-3xl text-slate-500 font-bold mt-6 tracking-wide uppercase">
              The Anti-Tour Factory Experience for Premium Travelers
            </span>
          </h1>

          <p className="text-slate-600 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg pt-2">
            Skip the crowded mass-tourism buses and aggressive souvenir commission traps. TourGen designs flawless, flexible private journeys across Agra and Delhi led by professional storytelling guides who know how to frame out crowds for perfect vacation photos.
          </p>

          {/* REFINED CONVERSION CTA: Directs immediately down to the action section */}
          <div className="pt-4">
            <button
              onClick={scrollToExperience}
              className="group bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-500/20 text-center transform active:scale-98 flex items-center gap-2 mx-auto cursor-pointer"
            >
              Curate Your Experience 
              <span className="transform group-hover:translate-y-1 transition-transform duration-200">↓</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. CHOOSE YOUR EXPERIENCE */}
      <section ref={experienceSectionRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-12 border-b border-slate-100 scroll-mt-6">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-bold uppercase tracking-wider text-xs">A Different Class of Local Hosting</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">How Do You Want to Explore?</h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            Whether you want an instantly locked all-inclusive itinerary or prefer to co-create custom luxury paths using our AI Engine, we guarantee elite, uncompromised execution.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Package Side */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-5" role="img" aria-label="monument">🕌</div>
              <h3 className="text-2xl font-extrabold text-slate-900">All-Inclusive Luxury Tours</h3>
              <p className="text-slate-500 mt-3 leading-relaxed text-sm">
                Lock down highly refined, direct private excursions covering the Taj Mahal, Agra Fort, or same-day journeys starting straight from Delhi. Fully inclusive of executive transport and skip-the-line monument entries.
              </p>
              <ul className="mt-6 space-y-3 text-slate-700 text-sm font-medium">
                <li className="flex items-center gap-2.5"><span className="text-blue-500">✓</span> Skip-The-Line VIP Express Entry</li>
                <li className="flex items-center gap-2.5"><span className="text-blue-500">✓</span> 100% Pure Sightseeing (No Forced Shopping)</li>
                <li className="flex items-center gap-2.5"><span className="text-blue-500">✓</span> Photography-Trained Professional Guides</li>
                <li className="flex items-center gap-2.5"><span className="text-blue-500">✓</span> Secure Spot with Only 30% Deposit</li>
              </ul>
            </div>
            <Link
              href="/tours"
              className="inline-block mt-8 bg-slate-900 hover:bg-slate-800 text-white text-center px-6 py-4 rounded-2xl font-bold transition shadow-xs"
            >
              View Direct Premium Tours →
            </Link>
          </div>

          {/* AI Custom Planner Side */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xs p-6 sm:p-8 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="text-4xl mb-5" role="img" aria-label="robot">🤖</div>
              <h3 className="text-2xl font-extrabold">Co-Design a Custom AI Journey</h3>
              <p className="text-blue-100 mt-3 leading-relaxed text-sm">
                Drop your timelines, personal interests, pacing styles, and fine-dining requests. Our custom travel matrix computes a seamless, highly optimized private concierge schedule in seconds.
              </p>
              <ul className="mt-6 space-y-3 text-blue-50 text-sm font-medium">
                <li className="flex items-center gap-2.5"><span className="text-white">✓</span> Tailored Exclusively Around Your Pacing</li>
                <li className="flex items-center gap-2.5"><span className="text-white">✓</span> AI Algorithmic Generation + Local Founder Verification</li>
                <li className="flex items-center gap-2.5"><span className="text-white">✓</span> Dynamic Private Vehicle Routing & Custom Stop Logic</li>
                <li className="flex items-center gap-2.5"><span className="text-white">✓</span> Transparent Luxury Multi-day Quotes</li>
              </ul>
            </div>
            <Link
              href="/generate"
              className="inline-block mt-8 bg-white text-blue-700 text-center px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 transition shadow-xs"
            >
              Generate Custom Plan →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. THE TOURGEN EXCLUSIVE GUARANTEES (REPLACED GENERIC VALUE PROPS) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-blue-600 font-bold uppercase tracking-wider text-xs">The Boutique Difference</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Why Discerning Travelers Bypass Corporate Travel Factories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🚫", title: "Zero Shop Commissions", desc: "Cheap portal operators lower prices to trap you inside high-pressure souvenir factories. TourGen takes €0 from shops. Your vacation time is entirely yours." },
            { icon: "📸", title: "Built-In Photo Portfolio", desc: "No blurry phone selfies. Our guides are trained specialists in composition, lighting, and angling to capture a clean, crowd-free memory collection." },
            { icon: "🥂", title: "Fluid Concierge Pacing", desc: "Large corporations use rigid, automated shifts. As a boutique operator, your private itinerary adapts instantly on the fly to match your mood and energy." },
            { icon: "🕵️‍♂️", title: "Direct Founder Trust", desc: "You are never a random booking number. Our founder manages or reviews your timeline logs directly to ensure absolute, elite execution." }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 text-center flex flex-col justify-between">
              <div>
                <span className="text-4xl block mb-4" role="img" aria-label="feature icon">{item.icon}</span>
                <h3 className="font-extrabold text-base text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mt-2">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS MAP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-bold uppercase tracking-wider text-xs">Seamless Planning Logistics</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">Elite Travel Orchestration Made Simple</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            { num: "✍️", title: "Share Your Ambitions", desc: "Input your preferred dates, party count, transport desires, and pacing targets securely." },
            { num: "🤖", title: "AI Compiles Blueprint", desc: "The engine maps dynamic travel channels, traffic offsets, and time-saving intervals instantly." },
            { num: "👨‍💼", title: "Founder Human Review", desc: "An expert local coordinator custom-verifies entry slots, optimal routes, and local nuances." },
            { num: "✈️", title: "Execute Peacefully", desc: "Pay a secure 30% deposit link, receive your tracking crew codes, and experience India beautifully." }
          ].map((step, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-xs text-center relative">
              <div className="text-4xl mb-4">{step.num}</div>
              <h3 className="text-lg font-extrabold text-slate-900">{step.title}</h3>
              <p className="text-slate-500 text-xs mt-2 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TOURS PREVIEW CARD GRID */}
      <section className="max-w-6xl mx-auto py-16 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-blue-600 font-bold uppercase tracking-wider text-xs">Curated Masterpiece Experiences</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Featured Private Luxury Tours</h2>
          </div>
          <Link href="/tours" className="text-blue-600 font-bold text-sm hover:underline shrink-0 flex items-center gap-1">
            See All Packages <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tours.slice(0, 3).map((tour) => (
            <div key={tour.id} className="group block">
              <div className="h-full flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <Link href={`/tours/${tour.id}`} className="overflow-hidden h-48 sm:h-56 lg:h-52 relative bg-slate-100 block">
                  {tour.imageUrl ? (
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-400 font-medium text-sm">
                      No Image Preview Available
                    </div>
                  )}
                </Link>

                <div className="p-6 space-y-4 flex flex-col flex-1 justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                        100% Private Luxury
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                        🚫 Zero Shopping Stops
                      </span>
                    </div>

                    <Link href={`/tours/${tour.id}`}>
                      <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                        {tour.title}
                      </h3>
                    </Link>

                    <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                      {tour.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">All-Inclusive Starting From</p>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{Number(tour.price).toLocaleString("en-IN")}
                          <span className="text-xs font-medium text-slate-500 ml-0.5">/person</span>
                        </p>
                      </div>
                      <Link href={`/tours/${tour.id}`} className="bg-blue-600 group-hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs">
                        View Details
                      </Link>
                    </div>

                    {/* NEW: FAST-TRACK LOW FRICTION WHATSAPP ACTION */}
                    <a
                      href={`https://wa.me/917599921173?text=Hi!%20I'm%20interested%20in%20arranging%20the%20premium%20${encodeURIComponent(tour.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-emerald-50 text-emerald-700 border border-emerald-200/60 py-2 rounded-xl text-xs font-bold transition hover:bg-emerald-100/70 flex items-center justify-center gap-1.5"
                    >
                      💬 Connect Directly with the Founder via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CORE BRAND VALUE TRUST WRAPPER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl relative">
          <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] bg-size-[16px_16px] opacity-10"></div>
          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-12 lg:p-16 relative z-10">
            <div>
              <p className="text-blue-400 font-bold uppercase tracking-wider text-xs">Uncompromised Travel Architecture</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Why Selective Travelers Trust TourGen</h2>
              <p className="text-slate-300 mt-4 leading-relaxed text-base">
                We combine the operational precision of an advanced algorithmic itinerary network with the high-touch hospitality of certified local fixers, ensuring your time in Agra is flawless.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Boutique Pacing", icon: "💎" },
                { label: "Elite Guided Execution", icon: "⭐" },
                { label: "Direct Concierge WhatsApp", icon: "💬" },
                { label: "Secure Escrow Booking", icon: "🔒" }
              ].map((pill, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-5 backdrop-blur-xs">
                  <div className="text-2xl" role="img" aria-label="trust metric icon">{pill.icon}</div>
                  <h3 className="text-white font-bold text-sm mt-2">{pill.label}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REVIEWS SHOWCASE SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-bold uppercase tracking-wide text-sm">Verified Traveler Journals</p>
          <h2 className="text-3xl font-black text-slate-900 mt-2">Stories From Travelers Who Chose Exclusivity</h2>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="text-4xl text-blue-200 font-serif leading-none mb-1">“</div>
                  <div className="text-amber-500 text-xs tracking-wider font-bold">
                    {"★".repeat(review.rating)}
                  </div>
                  <p className="mt-4 text-slate-600 leading-relaxed text-sm italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="border-t border-slate-100 mt-6 pt-4 space-y-1 text-xs text-slate-400 font-medium">
                  <p className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="text-xs">✔</span> Verified TourGen Traveler
                  </p>
                  <p className="font-semibold text-slate-700">📍 {review.itinerary?.city || "Agra"}</p>
                  <p className="text-[11px]">
                    🗓 {review.itinerary?.days || "1"} Day Trip • 👥 {review.itinerary?.groupSize || "2"} Travelers
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-sm text-slate-400 py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Loading traveler verification journals...
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/ai-reviews"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-2xl font-bold shadow-xs transition transform active:scale-98"
          >
            Read More Traveler Stories →
          </Link>
        </div>
      </section>

      {/* 7. REFINED LEAD INTAKE CONSULTATION FORM */}
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 relative">
          <h2 className="text-2xl sm:text-3xl font-black text-center text-slate-900">Request Custom Curated Flight Path Assistance</h2>
          <p className="text-center text-slate-500 mt-2 max-w-xl mx-auto text-xs sm:text-sm">
            Not sure which pacing variable matches your timeline logistics? Leave your message below. Our local planning desk will lay out complete custom map routes for you free of charge.
          </p>

          <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <input
              placeholder="Your Name *"
              type="text"
              required
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="border border-slate-200 bg-slate-50 rounded-xl p-3.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden text-slate-900"
              aria-label="Your Name"
            />

            <input
              placeholder="Your Email Address *"
              type="email"
              required
              value={leadEmail}
              onChange={(e) => setLeadEmail(e.target.value)}
              className="border border-slate-200 bg-slate-50 rounded-xl p-3.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden text-slate-900"
              aria-label="Your Email Address"
            />

            <div className="flex flex-col md:col-span-2">
              <input
                placeholder="Phone / WhatsApp Number (Optional for Direct Concierge Connection)"
                type="tel"
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden text-slate-900"
                aria-label="Phone Number"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <textarea
                placeholder="Tell us about your trip specs, dream dates, or specific vehicle preferences..."
                value={leadMessage}
                onChange={(e) => setLeadMessage(e.target.value)}
                className="border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium rounded-xl h-36 resize-none focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition outline-hidden text-slate-900"
                aria-label="Trip messages"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold mt-4 transition shadow-md shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {isSubmitting ? "Orchestrating Request Records..." : "Connect with a Local Coordinator →"}
            </button>
          </form>
        </div>
      </section>

      {/* QUICK LINKS SECTION RIGHT BEFORE FOOTER */}
        <section className="bg-slate-100 border-t border-b border-slate-200/60 py-6 text-center">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
            <span className="text-slate-400 normal-case font-medium">Looking for something specific?</span>
            <Link href="/agra-tours" className="text-slate-700 hover:text-blue-600 transition">Best Agra Tours</Link>
            <Link href="/tours" className="text-slate-700 hover:text-blue-600 transition">Taj Mahal Sunrise Tours</Link>
            <Link href="/generate" className="text-blue-600 hover:text-blue-700 transition">Generate AI Itinerary →</Link>
          </div>
        </section>

      {/* FOOTER SECTION */}
      <footer className="bg-slate-950 text-white mt-16 border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            
            <div>
              <h3 className="text-2xl font-black tracking-tight text-white">TourGen</h3>
              <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
                Boutique private travel experiences and algorithmic itinerary generation managed directly by verified local experts inside Agra, India.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">Explore</h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <Link href="/agra-tours" className="text-slate-400 hover:text-white transition">Agra Tours</Link>
                <Link href="/tours" className="text-slate-400 hover:text-white transition">Taj Mahal Experiences</Link>
                <Link href="/generate" className="text-slate-400 hover:text-white transition">Luxury Agra Trips</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">Legal</h4>
              <div className="flex flex-col gap-2.5 text-sm">
                <Link href="/terms" className="text-slate-400 hover:text-white transition">Terms & Conditions</Link>
                <Link href="/refund-policy" className="text-slate-400 hover:text-white transition">Refund Policy</Link>
                <Link href="/privacy" className="text-slate-400 hover:text-white transition">Privacy Policy</Link>
                <Link href="/contact" className="text-slate-400 hover:text-white transition">Contact Us</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200 mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-slate-300">
                <p className="text-slate-400 text-xs">Direct Founder WhatsApp Support:</p>
                <p className="font-semibold text-white">+91 75999 21173</p>
                <p className="text-slate-400 text-xs pt-1">Email Node:</p>
                <p className="font-semibold text-white text-xs break-all">tourgenteam@gmail.com</p>
                
                <div className="pt-2">
                  <a
                    href="https://wa.me/917599921173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 transition font-bold text-white text-xs px-4 py-2.5 rounded-xl shadow-xs"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-900 mt-12 pt-6 text-center text-slate-600 text-xs font-medium">
            © 2026 TourGen. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}