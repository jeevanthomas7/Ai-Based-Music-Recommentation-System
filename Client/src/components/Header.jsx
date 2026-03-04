import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiX, FiChevronDown, FiUser, FiLogOut, FiZap, FiCreditCard } from "react-icons/fi";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMe, postLogout } from "../api/authService";

function initialsAvatar(name = "User") {
  const initials = name
    .split(" ")
    .map((w) => (w ? w[0] : ""))
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return `https://ui-avatars.com/api/?name=${initials}&background=0ea5e9&color=fff&bold=true`;
}

export default function Header({ initialUser = null, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path) => navigate(path);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("dotin_user");
    return saved ? JSON.parse(saved) : initialUser;
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const premiumRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const raw = localStorage.getItem("dotin_user");
      if (raw) setUser(JSON.parse(raw));
    };

    const fetchLatestUser = async () => {
      try {
        const res = await fetchMe();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem("dotin_user", JSON.stringify(res.user));
        } else if (res?.message === "Not authenticated") {
          localStorage.removeItem("dotin_user");
          localStorage.removeItem("dotin_token");
          setUser(null);
        }
      } catch (err) {
        console.error("Sync fetchMe failed:", err);
      }
    };

    fetchLatestUser();
    window.addEventListener("dotin_user_updated", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("dotin_user_updated", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
      if (premiumRef.current && !premiumRef.current.contains(e.target))
        setPremiumOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const logout = async () => {
    try {
      await postLogout().catch(() => { });
      localStorage.removeItem("dotin_user");
      localStorage.removeItem("dotin_token");
      setUser(null);
      go("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItem = (label, path) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => go(path)}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${active
          ? "bg-sky-50 text-sky-600 shadow-sm shadow-sky-100/50"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-2xl border-b border-gray-100 shadow-sm ${scrolled ? "shadow-md" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <FiMenu size={18} />
            </button>

            <div
              onClick={() => go("/")}
              className="flex items-center gap-1.5 md:gap-2 cursor-pointer group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-sky-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-7 h-7 md:w-9 md:h-9 rounded-lg md:rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FiZap size={18} strokeWidth={3} className="relative z-10 group-hover:animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-gray-900 text-lg tracking-tighter uppercase italic">
                  DOT<span className="text-sky-600">IN</span>
                </span>
                <span className="text-[8px] font-bold text-sky-500 uppercase tracking-[0.2em] ml-0.5">Premium AI</span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide px-2">
            {navItem("Home", "/")}
            {navItem("Explore AI", "/camera")}
            {navItem("About", "/about")}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            {!user?.isPremium && (
              <button
                onClick={() => go("/premium")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 hover:scale-105 transition-all"
              >
                <FiZap className="fill-current" />
                Go Premium
              </button>
            )}

            {!user ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => go("/login")}
                  className="text-sm font-bold text-gray-600 hover:text-gray-900"
                >
                  Log in
                </button>
                <button
                  onClick={() => go("/signup")}
                  className="px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-bold shadow-xl hover:bg-black transition-all"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {user.isPremium && (
                  <div
                    ref={premiumRef}
                    className="relative"
                  >
                    <button
                      onClick={() => setPremiumOpen(!premiumOpen)}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
                    >
                      <FiZap size={14} className="fill-current" />
                      Premium
                    </button>
                    {premiumOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <FiZap className="text-emerald-500" /> Active Subscription
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Current Plan</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold uppercase">{user.premiumPlan}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-500">Renewal Date</span>
                            <span className="font-bold text-gray-900">
                              {user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => go("/payments")}
                          className="mt-5 w-full py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all"
                        >
                          Manage Billing
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-gray-100 hover:bg-gray-50 transition-all"
                  >
                    <img
                      src={user?.avatar?.startsWith("http") ? user.avatar : initialsAvatar(user?.name)}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                      onError={(e) => { e.target.src = initialsAvatar(user?.name); }}
                      alt=""
                    />
                    <FiChevronDown className={`text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} size={16} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                      <div className="p-4 border-b bg-gray-50/50">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => go("/profile")}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-sky-50 text-sm font-medium text-gray-700 transition"
                        >
                          <FiUser className="text-gray-400" /> View Profile
                        </button>
                        <button
                          onClick={() => go("/payments")}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-sky-50 text-sm font-medium text-gray-700 transition"
                        >
                          <FiCreditCard className="text-gray-400" /> Billing
                        </button>
                      </div>
                      <div className="border-t py-2">
                        <button
                          onClick={logout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 text-sm font-bold transition"
                        >
                          <FiLogOut /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="h-14 md:h-16" />
    </>
  );
}
