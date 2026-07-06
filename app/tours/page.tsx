"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ToursPage() {
  const [tours, setTours] = useState<any[]>([]);
  const router = useRouter();

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
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/70 py-12 px-4 text-slate-800 antialiased">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-200/60 shadow-xs px-4 py-2 rounded-full text-xs sm:text-sm text-slate-600 font-medium">
            🕌 Curated Agra Experiences • Verified Local Guides
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Discover Premium <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Agra & Taj Mahal Tours
            </span>
          </h1>

          <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
            Explore premium handcrafted experiences including crowd-avoiding Taj Mahal sunrise tours, 
            heritage journeys, and flexible day trips curated by native experts.
          </p>
        </div>

        {/* TOURS GRID */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tours.map((tour: any) => (
              <div 
                key={tour.id}
                className="group flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* IMAGE ROUTING CONTAINER */}
                <Link href={`/tours/${tour.id}`} className="overflow-hidden h-64 sm:h-72 relative bg-slate-100 block">
                  {tour.imageUrl ? (
                    <img
                      src={tour.imageUrl}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-sm">
                      No Tour Image Available
                    </div>
                  )}
                </Link>

                {/* CONTENT AREA */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between space-y-6">
                  <div className="space-y-4">
                    
                    {/* BADGES */}
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/50 text-xs font-bold uppercase tracking-wider">
                        💳 Pay 30% to Reserve
                      </span>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        Instant Confirmation
                      </span>
                      <span className="px-3 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold">
                        Free Cancellation
                      </span>
                    </div>

                    <Link href={`/tours/${tour.id}`} className="block">
                      <h2 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition tight">
                        {tour.title}
                      </h2>
                    </Link>

                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {tour.description}
                    </p>
                  </div>

                  {/* QUICK INFO SPECS */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Duration</p>
                      <p className="font-extrabold text-slate-800">Flexible Scheduling</p>
                    </div>
                    <div className="bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Includes</p>
                      <p className="font-extrabold text-slate-800">Guide + Transport</p>
                    </div>
                  </div>

                  {/* PRICE & ACTION FOOTER */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Starting From</p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900">
                        ₹{Number(tour.price).toLocaleString("en-IN")}
                        <span className="text-xs font-medium text-slate-500 ml-0.5">/person</span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Link
                        href={`/tours/${tour.id}`}
                        className="text-center bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
                      >
                        View Itinerary
                      </Link>

                      <a
                        href={`https://wa.me/917599921173?text=Hi!%20I'm%20interested%20in%20booking%20the%20${encodeURIComponent(tour.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center bg-emerald-50 text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100/70 px-4 py-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        💬 Quick Book
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-16 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
            <span className="text-3xl block mb-2">🕌</span>
            <p className="font-medium text-sm">Loading curated Agra packages...</p>
          </div>
        )}

      </div>
    </div>
  );
}