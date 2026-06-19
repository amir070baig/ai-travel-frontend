export default function RefundPolicyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-12">

      <h1 className="text-3xl sm:text-4xl font-bold mb-4">
        Cancellation & Refund Policy
      </h1>

      <p className="text-gray-500 mb-8">
        Last Updated: June 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">

        {/* INTRO */}
        <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p>
            At TourGen, we aim to provide fair and transparent cancellation and refund policies
            for both our curated tours and AI-powered custom travel planning services.
          </p>
        </section>

        {/* PRE-BUILT TOURS */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Pre-Built Tour Bookings
          </h2>

          <p className="mb-4">
            The following refund policy applies to tours listed directly on the TourGen website,
            including Taj Mahal tours, Agra sightseeing tours, heritage experiences,
            and other pre-built travel products.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">
                    Cancellation Time
                  </th>

                  <th className="text-left p-3">
                    Refund Eligibility
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-3">
                    More than 72 hours before travel
                  </td>

                  <td className="p-3 font-semibold text-green-600">
                    100% Refund
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-3">
                    24 to 72 hours before travel
                  </td>

                  <td className="p-3 font-semibold text-orange-600">
                    50% Refund
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-3">
                    Less than 24 hours before travel
                  </td>

                  <td className="p-3 font-semibold text-red-600">
                    No Refund
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* AI CUSTOM TRIPS */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. AI Custom Travel Plans
          </h2>

          <p className="mb-4">
            This policy applies to personalized itineraries and custom travel plans
            generated through TourGen's AI Concierge service and reviewed by our travel team.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border rounded-xl overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">
                    Booking Status
                  </th>

                  <th className="text-left p-3">
                    Refund Eligibility
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr className="border-t">
                  <td className="p-3">
                    Supplier bookings not started
                  </td>

                  <td className="p-3 font-semibold text-green-600">
                    Up to 80% Refund
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="p-3">
                    Supplier bookings already started
                  </td>

                  <td className="p-3 font-semibold text-red-600">
                    No Refund
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4">
            Supplier bookings may include hotel reservations, transportation bookings,
            licensed guide arrangements, attraction reservations, and other third-party services.
          </p>
        </section>

        {/* REVIEW PROCESS */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            3. Cancellation Request Review
          </h2>

          <p>
            All cancellation requests are reviewed by the TourGen team.
            Refund eligibility is determined based on booking type,
            travel dates, supplier commitments, and applicable refund policies.
          </p>
        </section>

        {/* PROCESSING */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            4. Refund Processing Time
          </h2>

          <p>
            Approved refunds are generally processed within 7–10 business days.
            Actual credit timelines may vary depending on banks,
            payment providers, and card issuers.
          </p>
        </section>

        {/* EXCEPTIONS */}
        <section>
          <h2 className="text-2xl font-semibold mb-2">
            5. Exceptional Circumstances
          </h2>

          <p>
            TourGen may review refund requests on a case-by-case basis
            in exceptional situations including medical emergencies,
            government travel restrictions, natural disasters,
            or other unforeseen events.
          </p>
        </section>

        {/* CONTACT */}
        <section className="bg-gray-50 rounded-2xl p-5">
          <h2 className="text-2xl font-semibold mb-2">
            Need Help?
          </h2>

          <p>
            For questions regarding cancellations or refunds,
            please contact the TourGen support team.
          </p>
        </section>

      </div>
    </div>
  );
}