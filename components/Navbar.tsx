export default function Navbar() {
  return (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm">
      <h1 className="text-xl font-bold text-blue-600">AI Travel</h1>

      <div className="flex gap-6 text-gray-600">
        <a href="/">Home</a>
        <a href="/generate">Generate</a>
      </div>
    </div>
  );
}