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
        { credentials: "include" }
      );
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          { credentials: "include" }
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

  const handleLogout = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
        { method: "POST", credentials: "include" }
      );
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs text-slate-800 antialiased">
      
      {/* MAIN CONTAINER */}
      <div className="max-w-6xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
        
        {/* BRAND LOGO */}
        <a href="/" className="flex items-center gap-3 group">
          <img
            src="/branding/logo.png"
            alt="TourGen"
            className="w-9 h-9 object-contain group-hover:scale-102 transition"
          />
          <div>
            <h1 className="font-black text-base text-slate-900 tracking-tight leading-none">
              Tour<span className="text-blue-600">Gen</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Generate • Customize
            </p>
          </div>
        </a>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <a href="/generate" className="hover:text-blue-600 transition">Generate</a>
          <a href="/tours" className="hover:text-blue-600 transition">Tours</a>
          <a href="/my-requests" className="hover:text-blue-600 transition">My Requests</a>
          {user?.role === "ADMIN" && (
            <a href="/admin" className="text-indigo-600 hover:text-indigo-700 transition font-black bg-indigo-50 px-2.5 py-1 rounded-lg">
              Admin Panel
            </a>
          )}
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="flex items-center gap-4">
          
          {/* NOTIFICATION HUB (ACCESSIBLE TO LOGGED IN USERS) */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-xl hover:bg-slate-50 rounded-xl transition cursor-pointer"
                aria-label="Toggle notifications"
              >
                🔔
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-32px)] sm:w-80 max-h-96 overflow-y-auto bg-white border border-slate-200 shadow-xl rounded-2xl p-4 z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-black text-sm text-slate-900">Notifications</h3>
                    <button
                      onClick={async () => {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
                          { method: "PATCH", credentials: "include" }
                        );
                        setNotifications((prev) =>
                          prev.map((n) => ({ ...n, isRead: true }))
                        );
                      }}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Mark All Read
                    </button>
                  </div>

                  {notifications.length === 0 && (
                    <p className="text-xs text-slate-400 py-4 text-center font-medium">No messages yet</p>
                  )}

                  <div className="space-y-2">
                    {notifications.map((n, index) => (
                      <div
                        key={n.id}
                        onClick={async () => {
                          if (!n.isRead) {
                            await fetch(
                              `${process.env.NEXT_PUBLIC_API_URL}/notifications/${n.id}/read`,
                              { method: "PATCH", credentials: "include" }
                            );
                            setNotifications((prev) =>
                              prev.map((item) =>
                                item.id === n.id ? { ...item, isRead: true } : item
                              )
                            );
                          }
                          if (n.link) window.location.href = n.link;
                        }}
                        className={`rounded-xl p-3 border text-left cursor-pointer transition-colors ${
                          n.isRead
                            ? "bg-slate-50/50 border-slate-100"
                            : "bg-blue-50/70 border-blue-200/60"
                        }`}
                      >
                        <p className="font-bold text-xs text-slate-900">
                          {index + 1}. {n.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-normal">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DESKTOP AUTH BAR */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <a href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">Login</a>
                <a href="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition">Register</a>
              </>
            ) : (
              <>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <div className="text-right">
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-wider leading-none">Logged In</p>
                  <p className="text-xs text-slate-700 font-bold max-w-37.5 truncate mt-0.5" title={user.email}>
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER TOGGLE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE CONTAINER DRAWER */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-slate-100 bg-white ${
          mobileMenuOpen ? "max-h-110city-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 py-5 space-y-4">
          
          {/* PROFILE BADGE ON MOBILE VIEW (FIXES ANONYMOUS FEELING) */}
          {user && (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-inner">
              <div className="space-y-0.5 min-w-0">
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-none">Account User</p>
                <p className="text-sm font-black text-slate-800 truncate pr-2" title={user.email}>
                  👤 {user.email}
                </p>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="bg-white border border-slate-200 text-red-500 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 shadow-xs"
              >
                Logout
              </button>
            </div>
          )}

          {/* SYSTEM LINK MATRIX */}
          <div className="flex flex-col gap-1">
            <a href="/generate" className="py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-between group">
              <span>Generate Itinerary</span>
              <span className="text-slate-300 group-hover:text-blue-600 text-sm transition">→</span>
            </a>
            <a href="/tours" className="py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-between group">
              <span>Explore Tours</span>
              <span className="text-slate-300 group-hover:text-blue-600 text-sm transition">→</span>
            </a>
            <a href="/my-requests" className="py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition flex items-center justify-between group">
              <span>My Requests</span>
              <span className="text-slate-300 group-hover:text-blue-600 text-sm transition">→</span>
            </a>
            {user?.role === "ADMIN" && (
              <a href="/admin" className="py-2.5 px-3 rounded-xl text-sm font-extrabold text-indigo-600 bg-indigo-50/60 block">
                🛡️ Admin Control Panel
              </a>
            )}
          </div>

          {/* GUEST SIGN IN FOR MOBILE */}
          {!user && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a href="/login" className="text-center border border-slate-200 text-slate-700 py-3 rounded-xl text-xs font-bold bg-white active:bg-slate-50 transition">
                Log In
              </a>
              <a href="/register" className="text-center bg-blue-600 text-white py-3 rounded-xl text-xs font-bold shadow-sm active:opacity-90 transition">
                Register
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}