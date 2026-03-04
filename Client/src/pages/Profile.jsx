import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiShield, FiLogOut, FiArrowLeft, FiZap, FiCreditCard } from "react-icons/fi";
import API from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then(res => {
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(res.data);
        }
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <img
                src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name + "&background=0ea5e9&color=fff"}
                alt={user.name}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-2xl shadow-sky-100 group-hover:scale-105 transition-transform duration-500"
              />
              {user.isPremium && (
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-emerald-500 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                  <FiZap className="text-white fill-current" size={20} />
                </div>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user.name}</h1>
              <p className="text-gray-500 mt-1 flex items-center gap-2 font-medium">
                {user.email}
              </p>
              <div className="flex gap-2 mt-4">
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {user.role}
                </span>
                {user.isPremium && (
                  <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    Premium Member
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <FiArrowLeft /> Back
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all flex items-center gap-2"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
              <FiUser className="text-sky-500" /> Personal Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Full Name</label>
                <div className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-2">{user.name}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email Address</label>
                <div className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-2">{user.email}</div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Account Role</label>
                <div className="font-bold text-gray-800 text-lg border-b border-gray-50 pb-2 capitalize">{user.role}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FiShield className="text-emerald-500" /> Subscription Status
              </h2>

              {user.isPremium ? (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100">
                    <p className="text-emerald-800 font-bold flex items-center gap-2 mb-2">
                      <FiZap className="fill-current" /> Premium Membership Active
                    </p>
                    <p className="text-emerald-600 text-sm font-medium">
                      You have full access to all AI features and ad-free music streaming.
                    </p>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <span className="text-gray-500 font-bold text-xs uppercase">Current Plan</span>
                    <span className="font-extrabold text-gray-900 uppercase">{user.premiumPlan}</span>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <span className="text-gray-500 font-bold text-xs uppercase">Valid Until</span>
                    <span className="font-extrabold text-gray-900">
                      {user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiZap className="text-gray-400" size={24} />
                  </div>
                  <p className="text-gray-500 font-medium mb-6">Upgrade to Premium for an enhanced experience</p>
                  <button
                    onClick={() => navigate("/premium")}
                    className="px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all"
                  >
                    Go Premium
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/payments")}
              className="mt-8 text-sky-600 font-bold text-sm hover:underline flex items-center justify-center gap-2"
            >
              <FiCreditCard /> View Payment History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
