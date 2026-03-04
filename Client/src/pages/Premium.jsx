import { useState } from "react";
import { createOrder, verifyPayment } from "../api/paymentService";
import { useNavigate } from "react-router-dom";
import { FiCheck, FiZap, FiStar, FiArrowLeft, FiLoader } from "react-icons/fi";

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
        name: "DOT IN",
        description: `${plan.toUpperCase()} Premium Subscription`,
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
            navigate("/profile");
          }
        },
        modal: {
          ondismiss: () => setLoadingPlan(null)
        },
        prefill: {
          name: user?.name,
          email: user?.email
        },
        theme: { color: "#0ea5e9" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (e) {
      setErr(e.message || "Payment failed");
      setLoadingPlan(null);
    }
  }

  const plans = [
    {
      id: "monthly",
      name: "Starter Pro",
      price: 99,
      period: "month",
      desc: "Perfect for casual listeners",
      features: ["Ad-free listening", "Unlimited Skips", "Standard Quality Audio", "Single Device"]
    },
    {
      id: "yearly",
      name: "Ultimate Yearly",
      price: 249,
      period: "year",
      desc: "Best for music enthusiasts",
      popular: true,
      features: ["Ad-free listening", "Unlimited Skips", "Ultra-HD Audio", "Up to 3 Devices", "Priority Support", "Early Access to New AI Features"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-8 pb-32 px-6 overflow-hidden">
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-lg">
                <FiStar size={16} />
              </div>
              <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-widest">Premium Membership</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4">
              Elevate Your <span className="bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">Soundtrack</span>
            </h1>
            <p className="text-gray-500 font-medium">Ad-free music, ultra-high quality audio, and exclusive AI features curated just for you.</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-100 text-gray-700 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            <FiArrowLeft /> Back home
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative bg-white rounded-[2rem] p-8 border transition-all duration-500 hover:-translate-y-2 flex flex-col ${p.popular ? "border-sky-500 shadow-2xl shadow-sky-100" : "border-gray-100 shadow-xl shadow-gray-200/50"
                }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-8 px-4 py-1.5 rounded-full bg-sky-500 text-white text-[10px] font-black tracking-widest uppercase shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-black text-gray-900">{p.name}</h2>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-wider">{p.desc}</p>
                </div>
                <div className={`p-3 rounded-2xl ${p.popular ? 'bg-sky-50 text-sky-500' : 'bg-gray-50 text-gray-400'}`}>
                  {p.id === 'monthly' ? <FiZap size={24} /> : <FiStar size={24} />}
                </div>
              </div>

              <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-400">₹</span>
                  <span className="text-5xl font-black text-gray-900 tabular-nums">{p.price}</span>
                  <span className="text-gray-400 font-bold text-sm">/{p.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-10 flex-grow">
                {p.features.map(f => (
                  <div key={f} className="flex items-center gap-3">
                    <FiCheck size={16} className={p.popular ? 'text-sky-500' : 'text-emerald-500'} strokeWidth={4} />
                    <span className="text-gray-600 font-bold text-xs">{f}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={loadingPlan === p.id}
                onClick={() => handleBuy(p.id)}
                className={`w-full py-4 rounded-2xl text-sm font-black transition-all disabled:opacity-50 ${p.popular
                  ? "bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-100"
                  : "bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-100"
                  }`}
              >
                {loadingPlan === p.id ? (
                  <span className="flex items-center justify-center gap-2">
                    <FiLoader className="animate-spin" /> Syncing...
                  </span>
                ) : (
                  `Upgrade to ${p.id === 'monthly' ? 'Monthly' : 'Yearly'}`
                )}
              </button>
            </div>
          ))}
        </div>

        {err && (
          <div className="mt-10 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-center text-[10px] font-black uppercase tracking-widest animate-shake max-w-sm mx-auto">
            {err}
          </div>
        )}

        <div className="mt-20 flex flex-col items-center">
          <div className="flex items-center gap-4 grayscale opacity-30 hover:opacity-100 transition-all duration-700 mb-4 h-6">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.2em]">Secure Checkout Powered by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
