import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Megaphone, Info, CheckCircle2, Clock, Trash2, Filter } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'announcement' | 'general';
  status: 'unread' | 'read';
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<'all' | 'announcements' | 'general'>('all');
  
  const notifications: Notification[] = [
    { id: '1', title: 'New Announcement', message: 'General Meeting scheduled for tomorrow at LT1.', time: '2 hours ago', type: 'announcement', status: 'unread' },
    { id: '2', title: 'Task Completed', message: 'John Doe completed "Draft Proposal" beforehand.', time: '5 hours ago', type: 'general', status: 'read' },
    { id: '3', title: 'Document Uploaded', message: 'Jane Smith uploaded "Financial_Report_Q1.pdf".', time: '1 day ago', type: 'general', status: 'read' },
    { id: '4', title: 'Badge Awarded', message: 'Congratulations! You earned the "Early Bird" badge.', time: '2 days ago', type: 'general', status: 'read' },
  ];

  const filtered = notifications.filter(n => {
    if (activeTab === 'all') return true;
    return n.type === activeTab.slice(0, -1);
  });

  return (
    <div className="space-y-8 pb-24 md:pb-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-500">Stay updated with team activity</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          {(['all', 'announcements', 'general'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all",
                activeTab === tab ? "bg-[#003366] text-white shadow-lg shadow-[#003366]/20" : "text-slate-400 hover:text-slate-600"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((n) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "p-6 rounded-[2rem] border transition-all flex gap-4 group",
                n.status === 'unread' ? "bg-white border-[#003366]/10 shadow-md" : "bg-slate-50 border-slate-100"
              )}
            >
              <div className={cn(
                "p-4 rounded-2xl shrink-0 h-fit",
                n.type === 'announcement' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
              )}>
                {n.type === 'announcement' ? <Megaphone size={24} /> : <Bell size={24} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {n.time}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{n.message}</p>
                <div className="mt-4 flex items-center gap-3">
                  {n.status === 'unread' && (
                    <button className="text-[10px] font-bold text-[#003366] uppercase tracking-widest flex items-center gap-1 hover:underline">
                      <CheckCircle2 size={12} /> Mark as read
                    </button>
                  )}
                  <button className="text-[10px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Info size={32} />
            </div>
            <p className="text-slate-400 font-medium">No notifications in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
