import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiZap, FiMusic, FiCpu, FiShield, FiGithub, FiTwitter } from "react-icons/fi";

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FiCpu className="text-sky-500" size={24} />,
      title: "AI Recognition",
      desc: "Identify songs instantly using advanced audio detection technology built for accuracy and speed."
    },
    {
      icon: <FiMusic className="text-emerald-500" size={24} />,
      title: "Smart Discovery",
      desc: "Personalized recommendations powered by real-time listening behavior and intelligent algorithms."
    },
    {
      icon: <FiShield className="text-indigo-500" size={24} />,
      title: "Premium Experience",
      desc: "Enjoy ad-free streaming, unlimited skips, and high-quality audio with our premium subscription plans."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pt-8 pb-20 px-6 overflow-hidden">
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-sky-100/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative">
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
          <div className="flex-1 text-center lg:text-left">
            <button
              onClick={() => navigate("/")}
              className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all text-sm font-bold text-gray-600 hover:scale-105"
            >
              <FiArrowLeft /> Back to Home
            </button>
            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-6">
              The Future of Sound
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-[1.1] text-gray-900">
              Building a Smarter <br />
              <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-indigo-600 bg-clip-text text-transparent">
                Music Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium leading-relaxed mb-10">
              DOT IN is a modern music streaming platform designed for
              intelligent discovery and seamless listening. We combine
              AI-powered recognition with clean design to deliver a fast,
              immersive, and high-end experience.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/premium")}
                className="px-8 py-4 rounded-2xl bg-gray-900 text-white font-bold shadow-xl hover:bg-black hover:scale-105 transition-all flex items-center gap-3"
              >
                <FiZap className="fill-current text-yellow-400" /> Upgrade to Premium
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="relative z-10 p-8 rounded-[3rem] bg-white border border-gray-100 shadow-2xl shadow-sky-100/50">
              <div className="space-y-8">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100/50 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-200 group-hover:rotate-6 transition-transform">
                      <FiCpu size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">AI Engine</h4>
                      <p className="text-xs text-gray-500">v4.2.0 Active</p>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100/50 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:rotate-6 transition-transform">
                      <FiMusic size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Audio Quality</h4>
                      <p className="text-xs text-gray-500">Ultra HD Streaming</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-1 h-3 bg-emerald-200 rounded-full" />)}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100/50 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                      <FiShield size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Secure Access</h4>
                      <p className="text-xs text-gray-500">RSA 256 Encryption</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-tighter">Verified</span>
                </div>
              </div>
            </div>
            {/* Decorative background element */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-500/10 to-emerald-500/10 rounded-[3.5rem] blur-2xl -z-10" />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:shadow-sky-100 hover:-translate-y-2 transition-all duration-500"
            >
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{f.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-32 pt-20 border-t border-gray-200/50 flex flex-col md:flex-row items-center justify-between gap-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 italic">DOT<span className="text-sky-600">IN</span></h2>
            <p className="text-gray-500 font-medium">© 2026 Innovate Sound Lab. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <button className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:shadow-lg transition-all">
              <FiGithub size={20} />
            </button>
            <button className="w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:shadow-lg transition-all">
              <FiTwitter size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
