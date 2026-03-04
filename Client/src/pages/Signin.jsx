import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { postGoogleCredential } from "../api/authService";
import { FiZap, FiMusic, FiStar, FiHeadphones } from "react-icons/fi";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("dotin_user");
      if (!raw) return;
      const user = JSON.parse(raw);
      if (user?.role === "admin") navigate("/admin");
      else navigate("/");
    } catch { }
  }, [navigate]);

  async function handleGoogle(response) {
    setLoading(true);
    setErr("");
    try {
      const credential = response?.credential;
      if (!credential) throw new Error("Google credential missing");
      const data = await postGoogleCredential(credential);
      if (!data) throw new Error("Invalid server response");
      if (data.token) localStorage.setItem("dotin_token", data.token);
      if (data.user) {
        localStorage.setItem("dotin_user", JSON.stringify(data.user));
        localStorage.setItem("dotin_role", data.user.role || "user");
        if (data.user.role === "admin") {
          navigate("/admin");
          return;
        }
      }
      navigate("/");
      window.location.reload();
    } catch (e) {
      setErr(e.response?.data?.message || e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  const perks = [
    { icon: <FiZap size={16} />, color: "text-sky-500 bg-sky-50 border-sky-100", title: "AI Mood Detection", desc: "Instant music matched to how you feel" },
    { icon: <FiMusic size={16} />, color: "text-emerald-500 bg-emerald-50 border-emerald-100", title: "Smart Playlists", desc: "Auto-curated based on your tastes" },
    { icon: <FiHeadphones size={16} />, color: "text-indigo-500 bg-indigo-50 border-indigo-100", title: "Unlimited Listening", desc: "No caps, no ads, just pure music" },
    { icon: <FiStar size={16} />, color: "text-amber-500 bg-amber-50 border-amber-100", title: "Premium Access", desc: "Exclusive tracks and early releases" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center px-6 py-14 relative overflow-hidden">

      {/* Background blobs */}
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Logo */}
      <div
        className="flex items-center gap-2 mb-12 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-300">
          <FiZap size={20} strokeWidth={3} />
        </div>
        <div className="flex flex-col -space-y-1">
          <span className="font-black text-gray-900 text-xl tracking-tighter uppercase italic">
            DOT<span className="text-sky-600">IN</span>
          </span>
          <span className="text-[8px] font-bold text-sky-500 uppercase tracking-[0.2em] ml-0.5">Premium AI</span>
        </div>
      </div>

      {/* Headline */}
      <div className="text-center mb-12 max-w-xl">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.1] text-gray-900 mb-4">
          Create Your{" "}
          <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-indigo-600 bg-clip-text text-transparent">
            Account
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 font-medium">
          Join thousands already discovering music the smarter way.
        </p>
      </div>

      {/* Perks Grid */}
      <div className="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {perks.map((p, i) => (
          <div key={i} className={`flex flex-col items-start gap-2 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all`}>
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${p.color}`}>
              {p.icon}
            </div>
            <div>
              <div className="text-xs font-black italic tracking-tight uppercase text-gray-900 leading-tight">{p.title}</div>
              <div className="text-[9px] font-medium text-gray-400 mt-0.5 leading-snug">{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Sign-up Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 relative">

        {/* Active indicator chip */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Free to Join</span>
        </div>

        <p className="text-xs font-black italic tracking-[0.2em] uppercase text-gray-400 mb-5 text-center">
          Sign Up With
        </p>

        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setErr("Google sign-in failed")}
            shape="rectangular"
            size="large"
            text="signup_with"
            width={320}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sky-600 text-xs font-black italic tracking-widest uppercase my-3 animate-pulse">
            <FiZap size={12} className="fill-current" /> Creating account…
          </div>
        )}

        {err && (
          <div className="text-center text-red-500 text-sm font-bold my-3 px-4 py-3 rounded-2xl bg-red-50 border border-red-100">
            {err}
          </div>
        )}

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-sky-600 font-black italic tracking-tight uppercase hover:text-sky-700 transition-colors hover:underline underline-offset-2"
            >
              Log In →
            </button>
          </p>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed max-w-xs">
        By signing up, you agree to our{" "}
        <span className="text-gray-600 hover:underline cursor-pointer">Terms of Service</span>{" "}
        and{" "}
        <span className="text-gray-600 hover:underline cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  );
}