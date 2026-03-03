import React, { useEffect, useRef, useState } from "react";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { HiOutlineMusicalNote } from "react-icons/hi2";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchMe, postLogout } from "../api/authService";

function initialsAvatar(name = "User") {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return `https://ui-avatars.com/api/?name=${initials}&background=111827&color=fff`;
}

export default function Header({ initialUser = null }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(initialUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  const profileRef = useRef(null);
  const premiumRef = useRef(null);

  useEffect(() => {
    const syncUser = () => {
      const raw = localStorage.getItem("dotin_user");
      if (raw) setUser(JSON.parse(raw));
    };
    syncUser();
    window.addEventListener("dotin_user_updated", syncUser);
    return () =>
      window.removeEventListener("dotin_user_updated", syncUser);
  }, []);
useEffect(() => {
  async function sync() {
    try {
      const res = await fetchMe();
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem("dotin_user", JSON.stringify(res.user));
      }
    } catch (err) {
      console.log("FetchMe failed:", err);
    }
  }
  sync();
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

  const go = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const logout = async () => {
    await postLogout().catch(() => {});
    localStorage.removeItem("dotin_user");
    localStorage.removeItem("dotin_token");
    setUser(null);
    go("/login");
  };

  const navItem = (label, path) => {
    const active = location.pathname === path;
    return (
      <button
        onClick={() => go(path)}
        className={`relative text-sm font-medium transition ${
          active ? "text-black" : "text-gray-500 hover:text-black"
        }`}
      >
        {label}
        {active && (
          <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-black rounded-full" />
        )}
      </button>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="relative h-16 flex items-center justify-between">

            <div
              onClick={() => go("/")}
              className="flex items-center gap-3 cursor-pointer"
            ><div className="w-9 h-8 rounded-xl bg-zinc-900 flex items-center justify-center text-white">
  <HiOutlineMusicalNote size={15} />
</div>
              <span className="font-semibold text-gray-900 text-lg tracking-tight">
                DOT  IN
              </span>
            </div>

            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10">
              {navItem("Home", "/")}
              {navItem("Explore AI", "/camera")}
              {navItem("About", "/about")}
            </div>

            <div className="hidden md:flex items-center gap-6">

              {!user?.isPremium && (
                <button
                  onClick={() => go("/premium")}
                  className="px-5 py-2 rounded-full bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                >
                  Go Premium
                </button>
              )}

              {user?.isPremium && (
                <div ref={premiumRef} className="relative">
                  <button
                    onClick={() => setPremiumOpen(v => !v)}
                    className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold"
                  >
                    Premium
                  </button>

                  {premiumOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white border rounded-xl shadow-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Premium Subscription
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Plan</span>
                          <span className="capitalize font-medium text-gray-900">
                            {user?.premiumPlan}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span>Expires</span>
                          <span className="font-medium text-gray-900">
                            {user?.premiumExpiresAt
                              ? new Date(user.premiumExpiresAt).toLocaleDateString()
                              : "-"}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate("/payments")}
                        className="mt-4 w-full py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition"
                      >
                        More Details
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!user ? (
                <>
                  <button
                    onClick={() => go("/login")}
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => go("/signup")}
                    className="px-4 py-2 rounded-full bg-black text-white text-sm"
                  >
                    Get Started
                  </button>
                </>
              ) : (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(v => !v)}
                    className="flex items-center gap-2"
                  >
                    <img
                      src={
                        user?.avatar
                          ? user.avatar.startsWith("http")
                            ? user.avatar
                            : `${import.meta.env.VITE_API_URL}/${user.avatar}`
                          : initialsAvatar(user?.name)
                      }
                      onError={(e) => {
                        e.target.src = initialsAvatar(user?.name);
                      }}
                      className="w-9 h-9 rounded-full border object-cover"
                      alt=""
                    />
                    <FiChevronDown size={16} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border rounded-xl shadow-lg overflow-hidden">
                      <button
                        onClick={() => go("/profile")}
                        className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm"
                      >
                        Profile
                      </button>

                      {user?.isPremium && (
                        <button
                          onClick={() => go("/payments")}
                          className="block w-full px-4 py-3 text-left hover:bg-gray-50 text-sm"
                        >
                          Premium Details
                        </button>
                      )}

                      <button
                        onClick={logout}
                        className="block w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button onClick={() => setMobileOpen(true)}>
                <FiMenu size={22} />
              </button>
            </div>

          </div>
        </div>
      </header>

      <div className="h-16" />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <aside className="w-72 bg-white h-full p-6 shadow-lg">
            <div className="flex justify-between mb-6">
              <span className="font-semibold text-lg">Menu</span>
              <button onClick={() => setMobileOpen(false)}>
                <FiX size={22} />
              </button>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <button onClick={() => go("/")}>Home</button>
              <button onClick={() => go("/camera")}>Explore AI</button>
              <button onClick={() => go("/about")}>About</button>

              {!user?.isPremium && (
                <button onClick={() => go("/premium")}>Go Premium</button>
              )}

              {user?.isPremium && (
                <button onClick={() => go("/payments")}>Premium Details</button>
              )}

              {user && (
                <>
                  <button onClick={() => go("/profile")}>Profile</button>
                  <button onClick={logout} className="text-red-600">
                    Logout
                  </button>
                </>
              )}
            </div>
          </aside>

          <div
            className="flex-1 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
}