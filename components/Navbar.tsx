"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow">

      {/* LEFT */}
      <div className="flex gap-4 items-center">
        <a href="/">Home</a>
        <a href="/generate">Generate</a>
        <a href="/tours">Tours</a>
        <a href="/my-requests">My Requests</a>
        {token && JSON.parse(localStorage.getItem("user") || "{}").role === "ADMIN" && (
          <a href="/admin">Admin</a>
        )}
      </div>

      {/* RIGHT */}
      <div>
        {!token ? (
          <div className="flex gap-4">
            <a href="/login" className="text-blue-600">Login</a>
            <a href="/register" className="text-blue-600">Register</a>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="text-red-500 font-semibold"
          >
            Logout
          </button>
        )}
      </div>

    </div>
  );
}