import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CircleDollarSign, CheckSquare, Menu, X, LogOut, Bell, FileText, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../AuthContext';

import { syncService } from '../services/syncService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatusToast, setShowStatusToast] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatusToast(true);
      syncService.processQueue(); // Process pending syncs
      setTimeout(() => setShowStatusToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowStatusToast(true);
      setTimeout(() => setShowStatusToast(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for pending syncs if online
    if (navigator.onLine) {
      syncService.processQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Home' },
    { to: '/people', icon: Users, label: 'People' },
    { to: '/finance', icon: CircleDollarSign, label: 'Finance' },
    { to: '/activities', icon: CheckSquare, label: 'Activities' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Status Toast */}
      <AnimatePresence>
        {showStatusToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={cn(
              "fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm",
              isOnline ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
            )}
          >
            {isOnline ? <Wifi size={18} /> : <WifiOff size={18} />}
            <span>{isOnline ? "You are now online!" : "You are offline!"}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Header */}
      <header className="md:hidden bg-[#003366] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold text-lg tracking-tight">Fundraising Manager</h1>
        <div className="flex items-center gap-2">
          {!isOnline && <WifiOff size={18} className="text-red-400 animate-pulse" />}
          <button onClick={handleLogout} className="p-2 text-white/70 hover:text-white">
            <LogOut size={20} />
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Sidebar / Desktop Nav */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-[#003366] text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex-1 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-8 hidden md:block text-[#FFD700]">Fundraising Manager</h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-[#FFD700] shadow-inner" 
                    : "hover:bg-white/5 text-white/80 hover:text-white"
                )}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{user?.Name}</p>
              <p className="text-[10px] text-white/50 truncate uppercase tracking-wider">{user?.Role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center p-2 z-50">
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
              isActive ? "text-[#003366]" : "text-slate-400"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
