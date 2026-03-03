import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        setUser(userRes.data.user);
        setPayments(Array.isArray(payRes.data) ? payRes.data : []);
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 text-gray-500">
        Loading payment details…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

       
        {user?.isPremium && (
          <div className="bg-white/90 backdrop-blur rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Current Subscription
            </h2>

            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-gray-500">Plan:</span>{" "}
                <span className="font-medium capitalize">
                  {user.premiumPlan}
                </span>
              </div>

              <div>
                <span className="text-gray-500">Expires On:</span>{" "}
                <span className="font-medium">
                  {new Date(user.premiumExpiresAt).toLocaleDateString()}
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
                Premium Active
              </span>
            </div>
          </div>
        )}

        {/* PAYMENT HISTORY */}
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow border border-white">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">
              Payment History
            </h1>

            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm rounded-lg bg-white border hover:bg-gray-100 transition"
            >
              Back to Home
            </button>
          </div>

          {payments.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No payment records found
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="px-6 py-4">Date</th>
                      <th>Plan</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Order ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p._id} className="border-b last:border-none">
                        <td className="px-6 py-4">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="capitalize">{p.plan}</td>
                        <td>₹{p.amount}</td>
                        <td>
                          <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                            success
                          </span>
                        </td>
                        <td className="text-xs text-gray-500 truncate max-w-[160px]">
                          {p.orderId}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS */}
              <div className="md:hidden space-y-4 p-4">
                {payments.map(p => (
                  <div key={p._id} className="bg-white rounded-xl shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-semibold">₹{p.amount}</div>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                        success
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {p.plan} plan
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
