export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">
        Terms & Conditions
      </h1>

      <p className="text-gray-500 mb-8">
        Last Updated: June 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Welcome to TourGen
          </h2>

          <p>
            TourGen provides AI-powered travel planning,
            customized itinerary design, concierge support,
            curated tours, and booking assistance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Services
          </h2>

          <ul className="list-disc pl-6">
            <li>AI-generated travel itineraries</li>
            <li>Personalized itinerary revisions</li>
            <li>Travel consultation</li>
            <li>Curated Agra tour packages</li>
            <li>Booking coordination and support</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            AI Generated Content
          </h2>

          <p>
            AI-generated itineraries are intended for travel
            planning purposes only. Final arrangements,
            pricing, availability, operating hours, and
            third-party services may vary and are subject to
            confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            User Responsibilities
          </h2>

          <ul className="list-disc pl-6">
            <li>Provide accurate information</li>
            <li>Review itinerary details carefully</li>
            <li>Verify travel requirements and documents</li>
            <li>Comply with local laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Bookings & Payments
          </h2>

          <p>
            Certain services require advance payment.
            Bookings remain subject to supplier
            availability and final confirmation.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Limitation of Liability
          </h2>

          <p>
            TourGen shall not be liable for travel delays,
            supplier cancellations, weather conditions,
            government restrictions, or circumstances
            beyond reasonable control.
          </p>
        </section>

      </div>
    </div>
  );
}