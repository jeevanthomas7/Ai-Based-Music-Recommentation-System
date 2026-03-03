import { useState } from "react";
import { createOrder, verifyPayment } from "../api/paymentService";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function loadRazorpay() {
    if (window.Razorpay) return true;
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      document.body.appendChild(script);
    });
  }

  async function handleBuy(plan) {
    setLoadingPlan(plan);
    setErr("");

    try {
      await loadRazorpay();

      const amount = plan === "monthly" ? 99 : 249;
      const order = await createOrder(amount, plan);
      const user = JSON.parse(localStorage.getItem("dotin_user"));

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Dot-In Premium",
        description: "Unlimited music streaming",
        order_id: order.orderId,
        handler: async (res) => {
          const data = await verifyPayment({
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
            plan,
            amount
          });

          if (data?.user) {
            localStorage.setItem("dotin_user", JSON.stringify(data.user));
            window.dispatchEvent(
              new CustomEvent("dotin_user_updated", { detail: data.user })
            );
            navigate("/");
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null)
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: { color: "#10B981" }
      };

      new window.Razorpay(options).open();
    } catch (e) {
      setErr(e.message || "Payment failed");
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Upgrade to Premium
            </h1>
            <p className="text-gray-600 text-lg">
              Enjoy unlimited streaming without ads.
            </p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition whitespace-nowrap"
          >
            Back to Home
          </button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {[
            { plan: "monthly", price: 99, label: "Monthly" },
            { plan: "yearly", price: 249, label: "Yearly" }
          ].map((p) => (
            <div
              key={p.plan}
              className="relative bg-white rounded-2xl border shadow-sm p-8 md:p-10 flex flex-col hover:shadow-md transition"
            >
              {p.plan === "yearly" && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-3 py-1 rounded-full">
                  Best Value
                </span>
              )}

              <h2 className="text-2xl font-semibold text-gray-900">
                {p.label} Plan
              </h2>

              <div className="mt-6">
                <span className="text-4xl md:text-5xl font-bold text-gray-900">
                  ₹{p.price}
                </span>
                <span className="text-gray-500 ml-2">
                  /{p.plan === "monthly" ? "month" : "year"}
                </span>
              </div>

              <ul className="mt-8 space-y-3 text-gray-600 text-sm">
                <li>✔ Ad-free listening</li>
                <li>✔ Unlimited skips</li>
                <li>✔ High quality audio</li>
                <li>✔ Priority support</li>
              </ul>

              <button
                disabled={loadingPlan === p.plan}
                onClick={() => handleBuy(p.plan)}
                className="mt-10 w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-60"
              >
                {loadingPlan === p.plan ? "Processing…" : "Get Premium"}
              </button>
            </div>
          ))}

        </div>

        {err && (
          <p className="text-center text-red-500 mt-10">{err}</p>
        )}

      </div>
    </div>
  );
}