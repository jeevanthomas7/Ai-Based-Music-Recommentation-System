import { FiZap, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi";

export default function Footer() {
  const footerLinks = [
    {
      title: "Company",
      links: [
        { name: "Our Story", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Press Kit", href: "#" },
      ]
    },
    {
      title: "Discover",
      links: [
        { name: "Explore AI", href: "/camera" },
        { name: "Mood Playlists", href: "/camera" },
        { name: "New Releases", href: "/" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "#" },
        { name: "Contact Us", href: "#" },
        { name: "Premium FAQ", href: "/premium" },
      ]
    }
  ];

  return (
    <footer className="w-full bg-white pt-10 pb-6 px-6 relative overflow-hidden border-t border-gray-100">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sky-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative text-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 mb-8">

          <div className="lg:col-span-4 max-w-sm">
            <div className="flex items-center gap-2 mb-6 cursor-pointer group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-all duration-500">
                <FiZap size={18} strokeWidth={3} className="group-hover:animate-pulse" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-gray-900 text-lg tracking-tighter uppercase italic">
                  DOT<span className="text-sky-600">IN</span>
                </span>
                <span className="text-[8px] font-bold text-sky-500 uppercase tracking-[0.2em] ml-0.5">Premium AI</span>
              </div>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed mb-5">
              Revolutionizing the way you experience music through advanced AI mood detection. Your soundtrack, perfectly tuned to your soul.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <FiInstagram />, href: "https://instagram.com" },
                { icon: <FiTwitter />, href: "https://twitter.com" },
                { icon: <FiFacebook />, href: "https://facebook.com" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-400 hover:-translate-y-1 transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="text-gray-900 font-extrabold text-[10px] uppercase tracking-widest mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        onClick={link.href === "#" ? (e) => e.preventDefault() : undefined}
                        className="text-gray-500 hover:text-sky-600 font-bold text-sm transition-colors duration-300 flex items-center group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-sky-500 mr-0 group-hover:mr-2 transition-all duration-300 rounded-full" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
            <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              © 2025 DOT IN LABORATORIES
            </span>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-200" />
            <div className="flex gap-4">
              {["Privacy", "Terms", "Cookies"].map((legal) => (
                <a key={legal} href="#" className="text-gray-400 hover:text-sky-600 text-[9px] font-black uppercase tracking-widest transition-colors">
                  {legal}
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-sky-700 uppercase tracking-widest leading-none">AI CORE v2.0 ACTIVE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
