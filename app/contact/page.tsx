export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <div className="text-center mb-12">

        <h1 className="text-5xl font-black text-gray-900">
          Contact TourGen
        </h1>

        <p className="text-gray-600 mt-4 text-lg">
          We'd love to help plan your next journey.
        </p>

      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white border rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Contact Information
          </h2>

          <div className="space-y-4 text-gray-700">

            <p>
              📍 Agra, Uttar Pradesh, India
            </p>

            <p>
              📧 tourgenteam@gmail.com
            </p>

            <p>
              📱 +91 75999 21173
            </p>

            <p>
              available 24/7 for support and inquiries
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-3xl p-8 shadow-sm">

          <h2 className="text-2xl font-bold mb-6">
            Quick Support
          </h2>

          <p className="text-gray-600 mb-6">
            For the fastest response, contact us on
            WhatsApp.
          </p>

          <a
            href="https://wa.me/917599921173"
            target="_blank"
            className="inline-block bg-green-500 text-white px-6 py-4 rounded-2xl font-semibold"
          >
            Chat on WhatsApp
          </a>

        </div>

      </div>

    </div>
  );
}