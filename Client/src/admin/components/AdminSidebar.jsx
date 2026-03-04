import { NavLink, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiStar,
  FiMusic,
  FiDisc,
  FiX,
  FiZap
} from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/songs", label: "Songs", icon: FiMusic },
  { to: "/admin/albums", label: "Albums", icon: FiDisc }
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-lg">
              <FiZap size={16} strokeWidth={3} />
            </div>
            <span className="font-black text-gray-900 text-lg tracking-tighter uppercase italic">
              DOT<span className="text-sky-600">IN</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              onClick={() => onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black italic tracking-tighter uppercase transition-all duration-300
              ${isActive
                  ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-100">
          <div className="bg-sky-50 rounded-2xl p-4">
            <p className="text-[10px] font-black italic tracking-tighter uppercase text-sky-600 mb-1">Status</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-bold text-sky-900 uppercase tracking-widest">System Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
