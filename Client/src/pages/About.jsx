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
    <div className="min-h-screen bg-white text-gray-900 pt-8 pb-32 px-6 relative overflow-hidden font-sans">
     
      <div className="fixed top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-sky-200/30 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/20 rounded-full blur-[160px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[140px] pointer-events-none" />

   
      <div className="fixed top-6 right-8 z-50">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/70 backdrop-blur-xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:bg-white hover:scale-105 transition-all text-xs font-black italic tracking-widest uppercase text-gray-900 group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          Back to Home
        </button>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 mb-32 mt-12 md:mt-20">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-50 text-sky-600 text-[10px] font-black italic uppercase tracking-[0.2em] border border-sky-100/50">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
              The Future of Sound
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] text-gray-900">
              Building a <br />
              <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-indigo-600 bg-clip-text text-transparent italic">
                Smarter Experience
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-bold leading-relaxed mb-10 opacity-80">
              DOT IN is a modern music streaming platform designed for
              intelligent discovery. We combine AI-powered recognition with
              premium aesthetics to deliver a fast, immersive audio journey.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate("/premium")}
                className="px-10 py-5 rounded-[2rem] bg-gray-900 text-white text-xs font-black italic tracking-widest uppercase shadow-2xl shadow-gray-400/40 hover:bg-black hover:scale-105 transition-all flex items-center gap-4 group"
              >
                <FiZap className="fill-current text-yellow-400 group-hover:scale-125 transition-transform" size={18} />
                Go Premium Now
              </button>
            </div>
          </div>

         
          <div className="flex-1 relative w-full max-w-md lg:max-w-none">
            <div className="relative z-10 p-1 bg-white/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/60 shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
              <div className="bg-white rounded-[3.2rem] p-8 md:p-10 space-y-10">
                <div className="flex items-center justify-between p-5 rounded-3xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-sky-100 transition-all cursor-default">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-xl shadow-sky-200 group-hover:rotate-6 transition-transform">
                      <FiCpu size={24} />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase text-xs tracking-tighter text-gray-900">AI Logic Engine</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Quantum Processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 italic tracking-tighter">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    v4.5 ACTIVE
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-3xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all cursor-default">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-200 group-hover:rotate-6 transition-transform">
                      <FiMusic size={24} />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase text-xs tracking-tighter text-gray-900">Audio Fidelity</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">32-bit Lossless</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1.5 h-4 bg-emerald-100 rounded-full group-hover:bg-emerald-500 transition-colors" style={{ transitionDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 rounded-3xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all cursor-default">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200 group-hover:rotate-6 transition-transform">
                      <FiShield size={24} />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase text-xs tracking-tighter text-gray-900">Encrypted Cloud</h4>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Decentralized Auth</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-widest border border-indigo-100">SECURE</span>
                </div>
              </div>
            </div>
            {/* Visual Flare */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-sky-500/10 via-emerald-500/10 to-indigo-500/10 rounded-[4rem] blur-[80px] -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-sky-100/50 rounded-[4rem] rotate-6 -z-20 scale-110" />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-12 rounded-[3.5rem] bg-white/60 backdrop-blur-xl border border-white shadow-2xl shadow-gray-200/50 hover:shadow-sky-100 hover:bg-white hover:-translate-y-3 transition-all duration-700"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-white shadow-lg flex items-center justify-center mb-10 group-hover:scale-125 transition-transform duration-700 group-hover:rotate-12 border border-gray-50">
                {f.icon}
              </div>
              <h3 className="text-2xl font-black italic uppercase text-gray-900 mb-6 tracking-tighter">{f.title}</h3>
              <p className="text-gray-500 text-sm font-bold leading-relaxed opacity-80">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-40 pt-20 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-4 italic tracking-tighter">DOT<span className="text-sky-600">IN</span></h2>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">© 2026 Innovate Sound Lab. Design for Decades.</p>
          </div>
          <div className="flex gap-6">
            <button className="w-14 h-14 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:scale-110 transition-all duration-500">
              <FiGithub size={24} />
            </button>
            <button className="w-14 h-14 rounded-[1.5rem] bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:scale-110 transition-all duration-500">
              <FiTwitter size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
