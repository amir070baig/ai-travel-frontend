"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchNotifications = async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
            {
              credentials: "include",
            }
          );

          const data = await res.json();
          setNotifications(Array.isArray(data) ? data : []);
        } catch (err) {
          console.error(err);
        }
      };

      fetchNotifications();

      const interval = setInterval(
        fetchNotifications,
        30000
      );

      return () => clearInterval(interval);
    }
  }, []);

  // Corrected async handler function
  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between md:items-center px-4 sm:px-6 py-4 bg-white/90 backdrop-blur border-b shadow-sm sticky top-0 z-50">

      {/* LEFT */}
      <div className="flex flex-wrap gap-3 sm:gap-4 items-center text-sm sm:text-base">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/branding/logo.png"
            alt="AI Travel Concierge"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-black text-lg text-gray-900">
              AI Travel Concierge
            </h1>
            <p className="text-xs text-gray-500">
              Curated Journeys. Local Expertise. AI Precision.
            </p>
          </div>
        </a>
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
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative text-2xl"
              >
                🔔
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 max-h-96 overflow-y-auto bg-white border shadow-2xl rounded-3xl p-4 z-50">
                  <h3 className="font-bold text-lg mb-4">
                    Notifications
                  </h3>

                  {notifications.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No notifications yet
                    </p>
                  )}

                  <div className="space-y-3">
                    {notifications.map((n, index) => (
                      <div
                        key={n.id}
                        className="bg-gray-50 rounded-2xl p-3 border"
                      >
                        <p className="font-semibold text-sm text-gray-900">
                          {index + 1}. {n.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* USER INFO */}
            <span className="hidden sm:block text-sm text-gray-600">
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
