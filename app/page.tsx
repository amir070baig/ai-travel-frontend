export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <h1 className="text-5xl font-bold mb-4">
        Plan Your Trip with AI ✨
      </h1>

      <p className="text-gray-600 mb-6 max-w-xl">
        Instantly generate smart travel itineraries and turn them into real bookings.
      </p>

      <a
        href="/generate"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Get Started
      </a>
    </div>
  );
}