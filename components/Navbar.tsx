"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
        {user?.role === "ADMIN" && (
          <a href="/admin">Admin</a>
        )}
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {!user ? (
          <>
            <a href="/login" className="text-blue-600">Login</a>
            <a href="/register" className="text-blue-600">Register</a>
          </>
        ) : (
          <>
            {/* USER INFO */}
            <span className="text-sm text-gray-600">
              👤 {user.email}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="text-red-500 font-semibold"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </div>
  );
}