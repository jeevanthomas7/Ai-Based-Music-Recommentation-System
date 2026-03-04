import { useNavigate } from "react-router-dom";

export default function StatCard({
  title,
  value,
  subtitle,
  to,
  gradient = "from-emerald-500 to-emerald-700"
}) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => to && navigate(to)}
      className={`w-full text-left rounded-3xl p-6 relative overflow-hidden group
        bg-gradient-to-br ${gradient}
        text-white border border-white/10 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
        <div className="w-16 h-16 rounded-full bg-white blur-2xl" />
      </div>

      <div className="relative z-10">
        <div className="text-[10px] font-black italic tracking-[0.2em] uppercase opacity-80 mb-2">{title}</div>

        <div className="text-4xl font-black italic tracking-tighter leading-none">
          {value}
        </div>

        {subtitle && (
          <div className="mt-3 text-[10px] font-bold opacity-70 uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-white" />
            {subtitle}
          </div>
        )}
      </div>
    </button>
  );
}
