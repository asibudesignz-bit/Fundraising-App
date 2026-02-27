import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Users, AlertCircle, Search, ArrowUpRight, Copy, Check, Wallet, Landmark, Smartphone, Banknote, Bell, Award } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { api } from '../services/api';
import { Member, Transaction } from '../types';
import { format } from 'date-fns';

export default function Dashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, t] = await Promise.all([api.getMembers(), api.getTransactions()]);
        setMembers(m);
        setTransactions(t);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const totalCollected = transactions
    .filter(t => t.Verified_By_Treasurer === 'Yes')
    .reduce((sum, t) => sum + Number(t.Amount), 0);

  const outstandingPledges = members.reduce((sum, m) => sum + Number(m.Total_Owed), 0);

  // Subtotals by account
  const subtotals = transactions
    .filter(t => t.Verified_By_Treasurer === 'Yes')
    .reduce((acc, t) => {
      acc[t.Mode] = (acc[t.Mode] || 0) + Number(t.Amount);
      return acc;
    }, {} as Record<string, number>);

  const pieData = [
    { name: 'Airtel', value: subtotals['AirtelMoney'] || 0, color: '#ef4444' },
    { name: 'TnM', value: subtotals['TnM'] || 0, color: '#f59e0b' },
    { name: 'Bank', value: 0, color: '#3b82f6' }, // Placeholder for National Bank
    { name: 'Cash', value: subtotals['Cash'] || 0, color: '#10b981' },
  ];

  const chartData = transactions
    .filter(t => t.Verified_By_Treasurer === 'Yes')
    .reduce((acc: any[], t) => {
      const date = format(new Date(t.Date), 'MMM dd');
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.amount += Number(t.Amount);
      } else {
        acc.push({ name: date, amount: Number(t.Amount) });
      }
      return acc;
    }, [])
    .slice(-7);

  const filteredActivity = transactions
    .filter(t => 
      t.Member_Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.Activity.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .slice(0, 5);

  const paymentDetails = [
    { id: 'airtel', label: 'Airtel Money', value: '0987920432', name: 'Mpatso Mchenula', icon: Smartphone },
    { id: 'tnm', label: 'Tnm Mpamba', value: '0894323455', name: 'Wonderful Nkhata', icon: Smartphone },
    { id: 'bank', label: 'National Bank', value: '1011404614', name: 'Wonderful Nkhata', icon: Landmark },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Home</h2>
          <p className="text-slate-500">Fundraising Department Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-[#003366] transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      {/* Payment Details Card */}
      <section className="bg-[#003366] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-[#003366]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Wallet size={20} className="text-[#FFD700]" />
            Payment Accounts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentDetails.map((detail) => (
              <div key={detail.id} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 group">
                <div className="flex justify-between items-start mb-2">
                  <detail.icon size={20} className="text-[#FFD700]" />
                  <button 
                    onClick={() => copyToClipboard(detail.value, detail.id)}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {copied === detail.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/50" />}
                  </button>
                </div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{detail.label}</p>
                <p className="text-lg font-bold mt-1">{detail.value}</p>
                <p className="text-xs text-white/70 mt-1">{detail.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
            <Banknote size={20} className="text-[#FFD700] shrink-0" />
            <p className="text-xs text-amber-100 italic">
              <span className="font-bold">Important:</span> All cash payments must be handed directly to the Treasurer.
            </p>
          </div>
        </div>
      </section>

      {/* Financial Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Funds" 
          value={`MK ${totalCollected.toLocaleString()}`} 
          icon={TrendingUp} 
          trend="+12%" 
          color="emerald" 
        />
        <StatCard 
          label="Expected Funds" 
          value={`MK ${outstandingPledges.toLocaleString()}`} 
          icon={AlertCircle} 
          color="amber" 
        />
        <StatCard 
          label="Active Members" 
          value={members.length.toString()} 
          icon={Users} 
          color="blue" 
        />
        <StatCard 
          label="Top Badges" 
          value="12 Earned" 
          icon={Award} 
          color="indigo" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Financial Distribution</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase">Monthly</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">MK {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Collection Trends</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(v) => `MK ${v/1000}k`} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#003366' : '#94a3b8'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-8">
          {/* Announcements */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Announcements</h3>
              <button className="text-[#003366] text-xs font-bold hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Executive</p>
                <p className="text-sm font-bold text-slate-900">General Meeting Tomorrow</p>
                <p className="text-xs text-slate-500 mt-1">Venue: LT1 @ 16:30</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Treasurer</p>
                <p className="text-sm font-bold text-slate-900">Submit Pledges for T-shirts</p>
                <p className="text-xs text-slate-500 mt-1">Deadline: Friday 28th</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
              <button className="text-[#003366] text-xs font-bold hover:underline flex items-center gap-1">
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            <div className="space-y-4">
              {filteredActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className={cn(
                    "mt-1.5 w-2 h-2 rounded-full shrink-0",
                    activity.Verified_By_Treasurer === 'Yes' ? "bg-emerald-500" : "bg-amber-500"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{activity.Member_Name}</p>
                    <p className="text-[10px] text-slate-500">{activity.Activity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">MK {Number(activity.Amount).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: { label: string, value: string, icon: any, trend?: string, color: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-2xl", colors[color])}>
          <Icon size={24} />
        </div>
        {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>}
      </div>
      <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
