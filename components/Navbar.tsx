"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchNotifications = async () => {

    try {

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      setNotifications(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          setUser(null);
          return;
        }

        const currentUser = await res.json();

        setUser(currentUser);

        await fetchNotifications();

      } catch (err) {
        console.error(err);
        setUser(null);
      }
    };

    loadUser();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);

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

      setUser(null);

      window.location.href="/login";

    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b shadow-sm">

      {/* LEFT */}
      <div className="flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <a href="/" className="flex items-center gap-3">
          <img
            src="/branding/logo.png"
            alt="TourGen"
            className="w-10 h-10 object-contain"
          />

          <div>
            <h1 className="font-black text-lg text-gray-900">
              TourGen
            </h1>

            <p className="text-xs text-gray-500">
              Generate. Customize. Travel.
            </p>
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">

          <a
            href="/generate"
            className="hover:text-blue-600 transition"
          >
            Generate
          </a>

          <a
            href="/tours"
            className="hover:text-blue-600 transition"
          >
            Tours
          </a>

          <a
            href="/my-requests"
            className="hover:text-blue-600 transition"
          >
            My Requests
          </a>

          {user?.role === "ADMIN" && (
            <a
              href="/admin"
              className="hover:text-blue-600 transition"
            >
              Admin
            </a>
          )}
        </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <button
          onClick={() =>
            setMobileMenuOpen(!mobileMenuOpen)
          }
          className="md:hidden text-2xl"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
        {!user ? (
          <>
            <a
              href="/login"
              className="hidden md:block text-blue-600"
            >
              Login
            </a>

            <a
              href="/register"
              className="hidden md:block text-blue-600"
            >
              Register
            </a>
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
                <div className="absolute right-0 mt-3 w-[90vw] max-w-sm max-h-96 overflow-y-auto bg-white border shadow-2xl rounded-3xl p-4 z-50">
                  <div className="flex justify-between items-center mb-4">

                    <h3 className="font-bold text-lg">
                      Notifications
                    </h3>

                    <button
                      onClick={async () => {

                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
                          {
                            method: "PATCH",
                            credentials: "include",
                          }
                        );

                        setNotifications((prev) =>
                          prev.map((n) => ({
                            ...n,
                            isRead: true,
                          }))
                        );

                      }}
                      className="text-sm text-blue-600"
                    >
                      Mark All Read
                    </button>

                  </div>

                  {notifications.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No notifications yet
                    </p>
                  )}

                  <div className="space-y-3">
                    {notifications.map((n, index) => (
                      <div
                        key={n.id}

                        onClick={async () => {
                        console.log("NOTIFICATION", n);

                          if (!n.isRead) {

                            await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/notifications/${n.id}/read`,
                              {
                                method: "PATCH",
                                credentials: "include",
                              }
                            );

                            setNotifications((prev) =>
                              prev.map((item) =>
                                item.id === n.id
                                  ? {
                                      ...item,
                                      isRead: true,
                                    }
                                  : item
                              )
                            );

                          }

                          if (n.link) {
                            window.location.href = n.link;
                          }

                        }}

                        className={`rounded-2xl p-3 border cursor-pointer ${
                          n.isRead
                            ? "bg-gray-50"
                            : "bg-blue-50 border-blue-300"
                        }`}
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
            <span className="hidden lg:block text-sm text-gray-600 max-w-[180px] truncate">
              👤 {user.email}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="hidden md:block text-red-500 font-semibold"
            >
              Logout
            </button>
          </>
        )}
      </div>

    </div>

    {mobileMenuOpen && (
      <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">

        <a
          href="/generate"
          className="block py-2"
        >
          Generate
        </a>

        <a
          href="/tours"
          className="block py-2"
        >
          Tours
        </a>

        <a
          href="/my-requests"
          className="block py-2"
        >
          My Requests
        </a>

        {user?.role === "ADMIN" && (
          <a
            href="/admin"
            className="block py-2"
          >
            Admin
          </a>
        )}

        {!user ? (
          <>
            <a
              href="/login"
              className="block py-2 text-blue-600"
            >
              Login
            </a>

            <a
              href="/register"
              className="block py-2 text-blue-600"
            >
              Register
            </a>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="block py-2 text-red-500"
          >
            Logout
          </button>
        )}
      </div>
    )}

    </div>
  );
}
