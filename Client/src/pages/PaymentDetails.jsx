import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCreditCard, FiClock, FiCheckCircle, FiCalendar, FiPackage } from "react-icons/fi";
import API from "../api/api";

export default function PaymentDetails() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      API.get("/auth/me"),
      API.get("/payments/my", { params: { t: Date.now() } })
    ])
      .then(([userRes, payRes]) => {
        setUser(userRes.data?.user || userRes.data);
        setPayments(Array.isArray(payRes.data) ? payRes.data : []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-bold">Syncing billing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Billing & Payments</h1>
            <p className="text-gray-500 font-medium mt-1">Manage your subscriptions and view payment history.</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 transition-all"
          >
            <FiArrowLeft /> Back to Home
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16" />

              <h2 className="text-lg font-bold text-gray-900 mb-8 flex items-center gap-3 relative">
                <FiPackage className="text-sky-500" /> Current Plan
              </h2>

              {user?.isPremium ? (
                <div className="relative">
                  <div className="mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest border border-emerald-100">
                      Active Subscription
                    </span>
                    <h3 className="text-3xl font-black text-gray-900 mt-4 capitalize">{user.premiumPlan} Plan</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Renewal Date</span>
                      <span className="text-gray-900 font-extrabold">
                        {user.premiumExpiresAt ? new Date(user.premiumExpiresAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-400 font-bold">Status</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
                        <FiCheckCircle /> Verified
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/premium")}
                    className="mt-10 w-full py-4 rounded-2xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition-all"
                  >
                    Upgrade Plan
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-400 font-medium mb-6">No active subscription found.</p>
                  <button
                    onClick={() => navigate("/premium")}
                    className="w-full py-4 rounded-2xl bg-sky-500 text-white font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-100"
                  >
                    Get Premium
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
            <div className="px-8 py-8 border-b border-gray-50 flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <FiClock className="text-sky-500" /> Payment History
              </h1>
              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                {payments.length} Transactions
              </span>
            </div>

            {payments.length === 0 ? (
              <div className="p-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCreditCard className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-400 font-medium">No payment records yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="hidden md:table w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                      <th className="px-8 py-4">Transaction Date</th>
                      <th className="py-4">Subscription Plan</th>
                      <th className="py-4 text-right">Amount Paid</th>
                      <th className="py-4 text-center">Status</th>
                      <th className="px-8 py-4">Order ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {payments.map(p => (
                      <tr key={p._id} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-500 flex items-center justify-center">
                              <FiCalendar size={14} />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </td>
                        <td className="py-5">
                          <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-bold capitalize">
                            {p.plan}
                          </span>
                        </td>
                        <td className="py-5 text-right font-black text-gray-900">₹{p.amount}</td>
                        <td className="py-5 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-extrabold uppercase">
                            <FiCheckCircle size={10} /> Success
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded group-hover:bg-white transition-colors">
                            {p.orderId}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="md:hidden divide-y divide-gray-50">
                  {payments.map(p => (
                    <div key={p._id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                          <h4 className="font-extrabold text-gray-900 capitalize">{p.plan} Plan</h4>
                        </div>
                        <span className="text-xl font-black text-gray-900">₹{p.amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold">SUCCESS</span>
                        <span className="text-[10px] font-mono text-gray-400">ID: {p.orderId.substring(0, 10)}...</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
