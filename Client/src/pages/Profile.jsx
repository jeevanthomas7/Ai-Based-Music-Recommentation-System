import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("dotin_token");
    localStorage.removeItem("dotin_user");
    localStorage.removeItem("dotin_role");
    navigate("/login");
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100">
        Loading profile...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8">

        <div className="flex flex-col items-center text-center">
          <img
            src={user.avatar || "/default-avatar.png"}
            alt={user.name}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
          />

          <h2 className="mt-5 text-2xl font-bold text-gray-900">
            {user.name}
          </h2>

          <p className="text-sm text-gray-600 mt-1">
            {user.email}
          </p>

          <span className="mt-3 inline-flex px-4 py-1.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700">
            {user.role}
          </span>
        </div>

        <div className="mt-10 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
          >
            Back to Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}
