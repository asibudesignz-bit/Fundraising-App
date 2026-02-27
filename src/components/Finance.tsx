import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CircleDollarSign, Calendar, User, Tag, CreditCard, CheckCircle2, Clock, X } from 'lucide-react';
import { api } from '../services/api';
import { Member, Transaction, PaymentMode } from '../types';
import { format } from 'date-fns';

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    Member_Name: '',
    Activity: '',
    Amount: '',
    Mode: 'Cash' as PaymentMode,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [t, m] = await Promise.all([api.getTransactions(), api.getMembers()]);
        setTransactions(t);
        setMembers(m);
      } catch (error) {
        console.error('Error fetching finance data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newTransaction: Partial<Transaction> = {
        Date: format(new Date(), 'yyyy-MM-dd'),
        Member_Name: formData.Member_Name,
        Activity: formData.Activity,
        Amount: Number(formData.Amount),
        Mode: formData.Mode,
        Verified_By_Treasurer: 'No' // Default to No for verification flow
      };
      
      await api.addTransaction(newTransaction);
      
      // Refresh data
      const updatedTransactions = await api.getTransactions();
      setTransactions(updatedTransactions);
      setIsFormOpen(false);
      setFormData({ Member_Name: '', Activity: '', Amount: '', Mode: 'Cash' });
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Finance</h2>
          <p className="text-slate-500">Track collections and expenditures</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#003366] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-[#003366]/20 hover:bg-[#002244] transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>New Transaction</span>
        </button>
      </header>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Activity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Mode</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-500">{t.Date}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{t.Member_Name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{t.Activity}</td>
                  <td className="px-6 py-4 font-bold text-[#003366]">MK {Number(t.Amount).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {t.Mode}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {t.Verified_By_Treasurer === 'Yes' ? (
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                        <CheckCircle2 size={14} /> Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-amber-600 font-bold text-xs">
                        <Clock size={14} /> Pending
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-white rounded-3xl z-50 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Add Transaction</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Member Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select
                      required
                      value={formData.Member_Name}
                      onChange={(e) => setFormData({ ...formData, Member_Name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] appearance-none"
                    >
                      <option value="">Select Member</option>
                      {members.map(m => (
                        <option key={m.Reg_Number} value={m.Name}>{m.Name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Activity Type</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Membership Fee, Donation"
                      value={formData.Activity}
                      onChange={(e) => setFormData({ ...formData, Activity: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount (MK)</label>
                    <div className="relative">
                      <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="number"
                        placeholder="0.00"
                        value={formData.Amount}
                        onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Mode</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        required
                        value={formData.Mode}
                        onChange={(e) => setFormData({ ...formData, Mode: e.target.value as PaymentMode })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] appearance-none"
                      >
                        <option value="Cash">Cash</option>
                        <option value="AirtelMoney">Airtel Money</option>
                        <option value="TnM">TnM Mpamba</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  disabled={submitting}
                  type="submit"
                  className="w-full bg-[#003366] text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#003366]/20 hover:bg-[#002244] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {submitting ? 'Processing...' : 'Submit Transaction'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
