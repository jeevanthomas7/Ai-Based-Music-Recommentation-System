import { useEffect, useState } from "react";
import API from "../../api/api";
import StatCard from "../components/StatCard";
import { FiShield, FiTrendingUp, FiTrendingDown, FiDollarSign, FiUsers } from "react-icons/fi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    API.get("/admin/users").then(r => setUsers(r.data));
    API.get("/payments/all").then(r => setPayments(r.data.payments));
  }, []);

  const totalRevenue = payments.reduce(
    (s, p) => s + (p.amount || 0),
    0
  );

  const premiumUsers = users.filter(u => u.isPremium).length;

  const revenueByMonth = {};
  payments.forEach(p => {
    const m = new Date(p.createdAt).toLocaleString("default", {
      month: "short"
    });
    revenueByMonth[m] = (revenueByMonth[m] || 0) + p.amount;
  });

  const revenueData = Object.keys(revenueByMonth).map(m => ({
    month: m,
    revenue: revenueByMonth[m]
  }));

  const usersByMonth = {};
  users.forEach(u => {
    const m = new Date(u.createdAt).toLocaleString("default", {
      month: "short"
    });
    usersByMonth[m] = (usersByMonth[m] || 0) + 1;
  });

  const userChartData = Object.keys(usersByMonth).map(m => ({
    month: m,
    users: usersByMonth[m]
  }));

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-gray-900">
          Admin <span className="text-sky-600">Console</span>
        </h1>
        <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest flex items-center gap-2">
          <FiShield className="text-emerald-500" /> System Overview & Analytics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={users.length}
          subtitle="Registered Members"
          to="/admin/users"
          gradient="from-indigo-600 to-indigo-800"
        />

        <StatCard
          title="Premium Users"
          value={premiumUsers}
          subtitle="Active Subscriptions"
          gradient="from-emerald-600 to-emerald-800"
        />

        <StatCard
          title="Payments"
          value={payments.length}
          subtitle="Successful Trns"
          gradient="from-sky-600 to-sky-800"
        />

        <StatCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          subtitle="Gross Earnings"
          gradient="from-amber-500 to-amber-700"
        />
      </div>


      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xs font-black italic tracking-widest text-gray-400 uppercase mb-1">Analytics</h3>
              <h4 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">User Growth</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FiUsers size={20} />
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userChartData}>
                <defs>
                  <linearGradient id="userFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#6366F1' }}
                />
                <Area dataKey="users" stroke="#6366F1" fill="url(#userFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xs font-black italic tracking-widest text-gray-400 uppercase mb-1">Performance</h3>
              <h4 className="text-xl font-black italic tracking-tighter text-gray-900 uppercase">Revenue Insight</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FiDollarSign size={20} />
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#10B981' }}
                />
                <Area dataKey="revenue" stroke="#10B981" fill="url(#revFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
