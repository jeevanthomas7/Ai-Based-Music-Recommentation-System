import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { postGoogleCredential } from "../api/authService";
import { FiZap, FiMusic, FiCpu, FiShield } from "react-icons/fi";

export default function Login() {
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
      setErr(e.response?.data?.message || e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">

      {/* Background blobs — matching site style */}
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

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
      <div className="text-center mb-10 max-w-xl">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-[1.1] text-gray-900 mb-4">
          Log In To{" "}
          <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-indigo-600 bg-clip-text text-transparent">
            Continue
          </span>
        </h1>
        <p className="text-base sm:text-lg text-gray-500 font-medium">
          Access your DOTIN account and pick up right where you left off.
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-200/50 p-8 relative">

        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: <FiCpu size={12} />, label: "AI Mood Detection" },
            { icon: <FiMusic size={12} />, label: "Smart Playlists" },
            { icon: <FiShield size={12} />, label: "Secure Login" },
          ].map((chip, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500"
            >
              <span className="text-sky-500">{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>

        {/* Google Sign-in */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setErr("Google sign-in failed")}
            shape="rectangular"
            size="large"
            text="signin_with"
            width={320}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-sky-600 text-xs font-black italic tracking-widest uppercase my-3 animate-pulse">
            <FiZap size={12} className="fill-current" /> Signing in…
          </div>
        )}

        {err && (
          <div className="text-center text-red-500 text-sm font-bold my-3 px-4 py-3 rounded-2xl bg-red-50 border border-red-100">
            {err}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Switch to signup */}
        <div className="text-center">
          <p className="text-sm text-gray-500 font-medium">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-sky-600 font-black italic tracking-tight uppercase hover:text-sky-700 transition-colors hover:underline underline-offset-2"
            >
              Get Started →
            </button>
          </p>
        </div>

        {/* Active indicator chip */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">AI Core Active</span>
        </div>
      </div>

      {/* Terms */}
      <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed max-w-xs">
        By continuing, you agree to our{" "}
        <span className="text-gray-600 hover:underline cursor-pointer">Terms of Service</span>{" "}
        and{" "}
        <span className="text-gray-600 hover:underline cursor-pointer">Privacy Policy</span>.
      </p>
    </div>
  );
}