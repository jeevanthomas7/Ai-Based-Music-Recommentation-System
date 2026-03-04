import { FiLogOut, FiShield, FiMenu, FiZap } from "react-icons/fi";
import { postLogout } from "../../api/authService";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({ onMenuClick }) {
  const navigate = useNavigate();

  async function logout() {
    try {
      await postLogout();
    } catch (e) { }
    localStorage.removeItem("dotin_token");
    localStorage.removeItem("dotin_user");
    localStorage.removeItem("dotin_role");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="h-16 max-w-[1600px] mx-auto px-4 md:px-6 flex items-center justify-between">


        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-xl text-gray-600 hover:bg-gray-100 md:hidden active:scale-95 transition-all"
          >
            <FiMenu size={20} />
          </button>

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all duration-300">
              <FiZap size={16} strokeWidth={3} />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-gray-900 text-base tracking-tighter uppercase italic leading-none">
                DOT<span className="text-sky-600 font-black">IN</span>
              </span>
              <span className="text-[7px] font-bold text-sky-500 uppercase tracking-[0.2em]">ADMIN PANEL</span>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-4">

          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            ADMIN
          </span>


          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-full
                       bg-gray-900 text-white text-sm font-medium
                       hover:bg-black transition"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
