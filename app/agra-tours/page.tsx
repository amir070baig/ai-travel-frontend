export const metadata = {
  title:
    "Best Agra Tours | Taj Mahal Experiences",

  description:
    "Discover premium Agra tours including Taj Mahal sunrise experiences, Agra Fort visits, luxury local guides, and private cultural tours.",

  keywords: [
    "Agra tours",
    "Taj Mahal tour",
    "Agra travel",
    "Agra itinerary",
    "Sunrise Taj Mahal",
  ],
};

export default function AgraToursSEOPage() {

  return (

    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50">

      {/* HERO */}

      <div className="relative h-125">

        <img
          src="https://images.unsplash.com/photo-1564507592333-c60657eea523"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">

          <div className="text-center text-white max-w-4xl px-4">

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Best Agra Tours &
              Taj Mahal Experiences

            </h1>

            <p className="mt-6 text-lg md:text-2xl text-gray-200">

              Discover curated Agra journeys including sunrise Taj Mahal tours,
              luxury experiences, cultural walks, and personalized local adventures.

            </p>

            <a
              href="/tours"
              className="inline-block mt-8 bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg"
            >
              Explore Tours
            </a>

          </div>

        </div>

      </div>

      {/* CONTENT */}

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-14">

        {/* INTRO */}

        <div className="bg-white rounded-3xl shadow border p-8">

          <h2 className="text-4xl font-black mb-6">
            Why Visit Agra?
          </h2>

          <p className="text-gray-700 leading-relaxed text-lg">

            Agra is home to one of the most iconic monuments in the world —
            the Taj Mahal. Beyond the Taj, travelers can explore Mughal heritage,
            vibrant local markets, authentic food experiences, luxury hotels,
            and centuries of fascinating history.

          </p>

        </div>

        {/* TOUR TYPES */}

        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white rounded-3xl border shadow p-6">

            <h3 className="text-2xl font-bold mb-4">
              Sunrise Tours
            </h3>

            <p className="text-gray-600 leading-relaxed">

              Experience the Taj Mahal during golden sunrise hours with fewer crowds,
              cooler weather, and unforgettable photography opportunities.

            </p>

          </div>

          <div className="bg-white rounded-3xl border shadow p-6">

            <h3 className="text-2xl font-bold mb-4">
              Heritage Experiences
            </h3>

            <p className="text-gray-600 leading-relaxed">

              Explore Agra Fort, Mughal architecture, and hidden historical gems
              with expert local guides.

            </p>

          </div>

          <div className="bg-white rounded-3xl border shadow p-6">

            <h3 className="text-2xl font-bold mb-4">
              Luxury Private Tours
            </h3>

            <p className="text-gray-600 leading-relaxed">

              Premium personalized experiences with private transportation,
              curated itineraries, and local travel support.

            </p>

          </div>

        </div>

        {/* FAQ */}

        <div className="bg-white rounded-3xl border shadow p-8">

          <h2 className="text-4xl font-black mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">

            <div>

              <h3 className="font-bold text-xl">
                What is the best time to visit the Taj Mahal?
              </h3>

              <p className="text-gray-600 mt-2 leading-relaxed">

                Sunrise is considered the best time because crowds are smaller
                and lighting conditions are ideal for photography.

              </p>

            </div>

            <div>

              <h3 className="font-bold text-xl">
                Are private guides included?
              </h3>

              <p className="text-gray-600 mt-2 leading-relaxed">

                Many premium tours include local expert guides and private transport.

              </p>

            </div>

            <div>

              <h3 className="font-bold text-xl">
                Can I customize my itinerary?
              </h3>

              <p className="text-gray-600 mt-2 leading-relaxed">

                Yes. Our AI-assisted planning system allows fully personalized
                Agra travel experiences.

              </p>

            </div>

          </div>

        </div>

        {/* CTA */}

        <div className="bg-white rounded-3xl border shadow-xl p-10 text-center">

          <h2 className="text-5xl font-black">
            Plan Your Agra Experience
          </h2>

          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">

            Discover curated tours, AI-assisted itineraries,
            and premium local travel experiences.

          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">

            <a
              href="/tours"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold"
            >
              Browse Tours
            </a>

            <a
              href="https://wa.me/917599921173"
              target="_blank"
              className="bg-green-500 text-white px-8 py-4 rounded-2xl font-semibold"
            >
              Talk on WhatsApp
            </a>

          </div>

        </div>

      </div>

    </div>

  );
}