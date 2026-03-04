import { useMemo, useState } from "react";

export default function UserTable({ users = [] }) {
  const [role, setRole] = useState("all");
  const [premium, setPremium] = useState("all");

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = role === "all" ? true : u.role === role;
      const matchPremium =
        premium === "all"
          ? true
          : premium === "premium"
            ? u.isPremium
            : !u.isPremium;

      return matchRole && matchPremium;
    });
  }, [users, role, premium]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/40 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="appearance-none pl-5 pr-12 py-3 rounded-2xl border border-gray-100 text-[10px] font-black italic tracking-widest uppercase bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-sky-100 outline-none transition-all cursor-pointer"
            >
              <option value="all">ALL ROLES</option>
              <option value="user">USERS</option>
              <option value="admin">ADMINS</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={premium}
              onChange={(e) => setPremium(e.target.value)}
              className="appearance-none pl-5 pr-12 py-3 rounded-2xl border border-gray-100 text-[10px] font-black italic tracking-widest uppercase bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-100 outline-none transition-all cursor-pointer"
            >
              <option value="all">ALL PLANS</option>
              <option value="premium">PREMIUM</option>
              <option value="free">FREE</option>
            </select>
          </div>
        </div>

        <div className="px-5 py-2 rounded-full bg-gray-50 border border-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
          Found <span className="text-gray-900 font-black italic tracking-tight">{filteredUsers.length}</span> Results
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden relative">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-6 text-[10px] font-black italic tracking-widest text-gray-400 uppercase">User Identification</th>
              <th className="px-8 py-6 text-[10px] font-black italic tracking-widest text-gray-400 uppercase">Contact Info</th>
              <th className="px-8 py-6 text-[10px] font-black italic tracking-widest text-gray-400 uppercase text-center">System Role</th>
              <th className="px-8 py-6 text-[10px] font-black italic tracking-widest text-gray-400 uppercase text-center">Plan Status</th>
              <th className="px-8 py-6 text-[10px] font-black italic tracking-widest text-gray-400 uppercase text-right">Joined Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <p className="text-sm font-bold text-gray-300 uppercase tracking-widest italic font-black">No Database Matches Found</p>
                </td>
              </tr>
            )}

            {filteredUsers.map((u) => (
              <tr key={u._id} className="group hover:bg-gray-50/50 transition-all duration-300 cursor-default">
                <td className="px-8 py-6 group-hover:pl-10 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-700 font-black italic text-sm border border-indigo-200 shadow-sm uppercase tracking-tighter">
                      {u.name ? u.name[0] : "?"}
                    </div>
                    <div className="font-black italic tracking-tighter text-gray-900 uppercase text-sm">
                      {u.name || "UNNAMED USER"}
                    </div>
                  </div>
                </td>

                <td className="px-8 py-6 text-[11px] font-bold text-gray-500 uppercase tracking-tight">
                  {u.email}
                </td>

                <td className="px-8 py-6 text-center">
                  <span className={`inline-flex px-4 py-1.5 text-[9px] font-black italic tracking-widest uppercase rounded-full border shadow-sm ${u.role === "admin"
                    ? "bg-sky-50 text-sky-700 border-sky-100"
                    : "bg-gray-50 text-gray-600 border-gray-100"
                    }`}>
                    {u.role}
                  </span>
                </td>

                <td className="px-8 py-6 text-center">
                  <span className={`inline-flex px-4 py-1.5 text-[9px] font-black italic tracking-widest uppercase rounded-full border shadow-sm ${u.isPremium
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-gray-50 text-gray-400 border-gray-100"
                    }`}>
                    {u.isPremium ? "PREMIUM" : "FREE"}
                  </span>
                </td>

                <td className="px-8 py-6 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
            <p className="text-xs font-black italic tracking-widest text-gray-300 uppercase">Empty Database</p>
          </div>
        )}

        {filteredUsers.map((u) => (
          <div key={u._id} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group active:scale-[0.98] transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/30 blur-3xl -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />

            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center text-indigo-700 font-black italic text-lg border border-indigo-200 shadow-sm uppercase tracking-tighter">
                    {u.name ? u.name[0] : "?"}
                  </div>
                  <div>
                    <h4 className="font-black italic tracking-tighter text-gray-900 uppercase text-base">{u.name || "UNNAMED USER"}</h4>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              </div>

              <div className="py-3 px-4 rounded-2xl bg-gray-50/50 border border-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-tight break-all">
                {u.email}
              </div>

              <div className="flex gap-2">
                <span className={`flex-1 px-4 py-3 text-[10px] font-black italic tracking-widest uppercase rounded-2xl border text-center shadow-sm ${u.role === "admin"
                  ? "bg-sky-50 text-sky-700 border-sky-100"
                  : "bg-gray-50 text-gray-500 border-gray-100"
                  }`}>
                  {u.role}
                </span>

                <span className={`flex-1 px-4 py-3 text-[10px] font-black italic tracking-widest uppercase rounded-2xl border text-center shadow-sm ${u.isPremium
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-gray-50 text-gray-400 border-gray-100"
                  }`}>
                  {u.isPremium ? "PREMIUM" : "FREE"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}