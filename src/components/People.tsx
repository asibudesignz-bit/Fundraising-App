import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User, Mail, GraduationCap, Briefcase, DollarSign, X, Phone, Plus, Edit2, Save, ShoppingCart } from 'lucide-react';

import { api } from '../services/api';
import { Member, Transaction, MemberStatus } from '../types';

export default function People() {
  const [members, setMembers] = useState<Member[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'Team' | 'MAGSO Member'>('Team');

  const [isLoggingPurchase, setIsLoggingPurchase] = useState(false);
  const [purchaseData, setPurchaseData] = useState({ Activity: '', Amount: '' });

  const handleLogPurchase = async () => {
    if (!selectedMember) return;
    setSubmitting(true);
    try {
      await api.addTransaction({
        Date: new Date().toISOString().split('T')[0],
        Member_Name: selectedMember.Name,
        Activity: purchaseData.Activity,
        Amount: Number(purchaseData.Amount),
        Mode: 'Cash',
        Verified_By_Treasurer: 'No'
      });
      await fetchData();
      setIsLoggingPurchase(false);
      setPurchaseData({ Activity: '', Amount: '' });
    } catch (error) {
      console.error('Error logging purchase:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Form state for editing/adding
  const [formData, setFormData] = useState<Partial<Member>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, t] = await Promise.all([api.getMembers(), api.getTransactions()]);
      setMembers(m);
      setTransactions(t);
    } catch (error) {
      console.error('Error fetching people data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         m.Reg_Number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = (m.Type || 'MAGSO Member') === activeTab;
    return matchesSearch && matchesTab;
  });

  const getMemberTransactions = (name: string) => {
    return transactions.filter(t => t.Member_Name === name);
  };

  const handleEdit = (member: Member) => {
    setFormData(member);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!formData.Reg_Number) return;
    setSubmitting(true);
    try {
      const dataToSave = { ...formData, Type: activeTab };
      if (isAdding) {
        await api.addMember(dataToSave as Member);
      } else {
        await api.updateMember(formData.Reg_Number, dataToSave);
      }
      await fetchData();
      setIsEditing(false);
      setIsAdding(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && members.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003366]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">People</h2>
          <p className="text-slate-500">Manage team and organization members</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all"
            />
          </div>
          <button 
            onClick={() => {
              setFormData({ Status: 'Active', Role: 'Member', Year: 1, Type: activeTab });
              setIsAdding(true);
              setIsEditing(true);
            }}
            className="p-2 bg-[#003366] text-white rounded-xl hover:bg-[#002244] transition-colors"
          >
            <Plus size={24} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('Team')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'Team' ? "bg-white text-[#003366] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          Fundraising Team
        </button>
        <button
          onClick={() => setActiveTab('MAGSO Member')}
          className={cn(
            "px-6 py-2 rounded-xl text-sm font-bold transition-all",
            activeTab === 'MAGSO Member' ? "bg-white text-[#003366] shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          MAGSO Members
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <motion.div
              key={member.Reg_Number}
              layoutId={member.Reg_Number}
              onClick={() => setSelectedMember(member)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-colors">
                  <User size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{member.Name}</h3>
                  <p className="text-xs text-slate-500 truncate">{member.Role}</p>
                </div>
                {activeTab === 'Team' ? (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Online</span>
                  </div>
                ) : (
                  Number(member.Total_Owed) > 0 && (
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" title="Unpaid Pledges" />
                  )
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-400 italic">
            No {activeTab === 'Team' ? 'team members' : 'MAGSO members'} found.
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      <AnimatePresence>
        {(selectedMember || isAdding) && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setSelectedMember(null);
                setIsEditing(false);
                setIsAdding(false);
              }}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedMember?.Reg_Number || 'new-member'}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-white rounded-3xl z-50 shadow-2xl overflow-hidden"
            >
              <div className="bg-[#003366] p-8 text-white relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  {!isEditing && (
                    <button 
                      onClick={() => handleEdit(selectedMember!)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setSelectedMember(null);
                      setIsEditing(false);
                      setIsAdding(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center backdrop-blur-md">
                    <User size={48} />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formData.Name || ''}
                        onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                        placeholder="Full Name"
                        className="text-3xl font-bold bg-transparent border-b border-white/30 focus:outline-none w-full"
                      />
                    ) : (
                      <h2 className="text-3xl font-bold">{selectedMember?.Name}</h2>
                    )}
                    
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formData.Role || ''}
                        onChange={(e) => setFormData({ ...formData, Role: e.target.value })}
                        placeholder="Role"
                        className="text-white/70 font-medium bg-transparent border-b border-white/30 focus:outline-none w-full mt-1"
                      />
                    ) : (
                      <p className="text-white/70 font-medium">{selectedMember?.Role}</p>
                    )}

                    <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                      {isEditing ? (
                        <input 
                          type="text"
                          value={formData.Reg_Number || ''}
                          onChange={(e) => setFormData({ ...formData, Reg_Number: e.target.value })}
                          placeholder="Reg Number"
                          className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md focus:outline-none"
                        />
                      ) : (
                        <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md">
                          {selectedMember?.Reg_Number}
                        </span>
                      )}
                      
                      {isEditing ? (
                        <select 
                          value={formData.Status || 'Active'}
                          onChange={(e) => setFormData({ ...formData, Status: e.target.value as MemberStatus })}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold backdrop-blur-md focus:outline-none text-white"
                        >
                          <option value="Active" className="text-slate-900">Active</option>
                          <option value="Inactive" className="text-slate-900">Inactive</option>
                          <option value="Pending" className="text-slate-900">Pending</option>
                        </select>
                      ) : (
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md",
                          selectedMember?.Status === 'Active' ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                        )}>
                          {selectedMember?.Status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Information</h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <EditItem icon={Mail} label="Email" value={formData.Email || ''} onChange={(v) => setFormData({ ...formData, Email: v })} />
                        <EditItem icon={GraduationCap} label="Program" value={formData.Program || ''} onChange={(v) => setFormData({ ...formData, Program: v })} />
                        <EditItem icon={Briefcase} label="Year" value={formData.Year?.toString() || ''} onChange={(v) => setFormData({ ...formData, Year: v })} />
                        <EditItem icon={DollarSign} label="Total Owed" value={formData.Total_Owed?.toString() || ''} onChange={(v) => setFormData({ ...formData, Total_Owed: Number(v) })} />
                      </>
                    ) : (
                      <>
                        <InfoItem icon={Mail} label="Email" value={selectedMember?.Email || ''} />
                        <InfoItem icon={GraduationCap} label="Program" value={selectedMember?.Program || ''} />
                        <InfoItem icon={Briefcase} label="Year" value={`Year ${selectedMember?.Year}`} />
                        <InfoItem icon={DollarSign} label="Total Owed" value={`MK ${Number(selectedMember?.Total_Owed).toLocaleString()}`} />
                      </>
                    )}
                  </div>
                  {isEditing && (
                    <button 
                      onClick={handleSave}
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 bg-[#003366] text-white py-3 rounded-2xl font-bold shadow-lg hover:bg-[#002244] transition-all disabled:opacity-50"
                    >
                      {submitting ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <><Save size={20} /> Save Changes</>}
                    </button>
                  )}

                  {!isEditing && !isAdding && (
                    <div className="pt-4 border-t border-slate-100">
                      {isLoggingPurchase ? (
                        <div className="space-y-3 bg-slate-50 p-4 rounded-2xl">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quick Log Purchase</h4>
                            <button onClick={() => setIsLoggingPurchase(false)} className="text-slate-400 hover:text-slate-600">
                              <X size={14} />
                            </button>
                          </div>
                          <input 
                            type="text"
                            placeholder="Activity (e.g. Car Wash)"
                            value={purchaseData.Activity}
                            onChange={(e) => setPurchaseData({ ...purchaseData, Activity: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
                          />
                          <input 
                            type="number"
                            placeholder="Amount (MK)"
                            value={purchaseData.Amount}
                            onChange={(e) => setPurchaseData({ ...purchaseData, Amount: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003366]/20"
                          />
                          <button 
                            onClick={handleLogPurchase}
                            disabled={submitting || !purchaseData.Activity || !purchaseData.Amount}
                            className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                          >
                            {submitting ? 'Logging...' : 'Confirm Purchase'}
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsLoggingPurchase(true)}
                          className="w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 py-3 rounded-2xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-all"
                        >
                          <ShoppingCart size={20} /> Log Purchase
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {!isAdding && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Financial History</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                      {getMemberTransactions(selectedMember?.Name || '').length > 0 ? (
                        getMemberTransactions(selectedMember?.Name || '').map((t, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{t.Activity}</p>
                              <p className="text-[10px] text-slate-500">{t.Date}</p>
                            </div>
                            <p className="text-sm font-bold text-[#003366]">MK {Number(t.Amount).toLocaleString()}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400 italic">No transactions found.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function EditItem({ icon: Icon, label, value, onChange }: { icon: any, label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm font-semibold text-slate-900 bg-slate-50 border-b border-slate-200 focus:outline-none w-full"
        />
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
