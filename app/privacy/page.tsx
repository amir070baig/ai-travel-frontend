export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-6">
        Privacy Policy
      </h1>

      <p className="text-gray-500 mb-8">
        Last Updated: June 2026
      </p>

      <div className="space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Information We Collect
          </h2>

          <p>
            TourGen may collect information including:
          </p>

          <ul className="list-disc pl-6 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Travel preferences</li>
            <li>Booking information</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            How We Use Information
          </h2>

          <ul className="list-disc pl-6">
            <li>Generate personalized itineraries</li>
            <li>Process travel requests and bookings</li>
            <li>Provide customer support</li>
            <li>Send booking and service updates</li>
            <li>Improve our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Third-Party Services
          </h2>

          <p>
            TourGen may use trusted third-party providers
            including payment processors, email services,
            AI providers, and travel suppliers to deliver
            our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Data Security
          </h2>

          <p>
            We take reasonable measures to protect your
            information. However, no method of electronic
            storage or transmission is completely secure.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">
            Contact
          </h2>

          <p>
            If you have questions regarding this Privacy
            Policy, please contact TourGen support.
          </p>
        </section>

      </div>
    </div>
  );
}