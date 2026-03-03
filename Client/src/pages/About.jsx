import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-20">

          <div className="max-w-2xl">
            <span className="text-sm font-medium text-gray-500 tracking-wide uppercase">
              About
            </span>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mt-4 mb-6 leading-tight">
              Building a Smarter Music Experience
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed">
              Dot-In is a modern music streaming platform designed for
              intelligent discovery and seamless listening. We combine
              AI-powered recognition with clean design to deliver a fast,
              immersive and premium music experience.
            </p>

            <div className="mt-8 flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
              >
                Back to Home
              </button>

              <button
                onClick={() => navigate("/premium")}
                className="px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition"
              >
                Explore Premium
              </button>
            </div>
          </div>

          <div className="hidden md:block w-full max-w-sm">
            <div className="bg-white rounded-3xl p-8 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Why Dot-In?
              </h3>

              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>AI Recognition</span>
                  <span className="font-medium text-gray-900">Instant</span>
                </div>
                <div className="flex justify-between">
                  <span>Streaming Quality</span>
                  <span className="font-medium text-gray-900">High</span>
                </div>
                <div className="flex justify-between">
                  <span>Premium Support</span>
                  <span className="font-medium text-gray-900">Priority</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="grid gap-8 md:grid-cols-3">

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI Recognition
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Identify songs instantly using advanced audio detection
              technology built for accuracy and speed.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Smart Discovery
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Personalized recommendations powered by real-time listening
              behavior and intelligent algorithms.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Premium Experience
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enjoy ad-free streaming, unlimited skips, and high-quality
              audio with our premium subscription plans.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}