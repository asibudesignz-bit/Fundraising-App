import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Tag, 
  MapPin, 
  Info, 
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Task, Event, Member, Transaction, TaskStatus } from '../types';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { useAuth } from '../AuthContext';

export default function Activities() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCongrats, setShowCongrats] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tk, ev, mb] = await Promise.all([
        api.getTasks(),
        api.getEvents(),
        api.getMembers()
      ]);
      setTasks(tk);
      setEvents(ev);
      setMembers(mb);
    } catch (error) {
      console.error('Error fetching activities data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.Status === 'Done' ? 'Pending' : 'Done';
    try {
      await api.updateTask(task.Task_Name, { Status: newStatus });
      if (newStatus === 'Done') {
        setShowCongrats(true);
        setTimeout(() => setShowCongrats(false), 3000);
      }
      const updatedTasks = await api.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleQuickLog = async (activity: string, amount: number) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const newTransaction: Partial<Transaction> = {
        Date: format(new Date(), 'yyyy-MM-dd'),
        Member_Name: user.Name,
        Activity: activity,
        Amount: amount,
        Mode: 'Cash',
        Verified_By_Treasurer: 'No'
      };
      await api.addTransaction(newTransaction);
      // Optional: show success toast
    } catch (error) {
      console.error('Quick log failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Calendar Logic
  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map((day, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const dayEvents = events.filter(e => isSameDay(parseISO(e.Date), day));
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(day)}
              className={cn(
                "aspect-square p-1 rounded-xl border transition-all cursor-pointer relative flex flex-col items-center justify-center",
                !isCurrentMonth ? "text-slate-300 border-transparent" : "text-slate-900 border-slate-50",
                isSelected ? "bg-[#003366] text-white border-[#003366] shadow-lg shadow-[#003366]/20" : "hover:bg-slate-50"
              )}
            >
              <span className="text-xs font-bold">{format(day, 'd')}</span>
              {dayEvents.length > 0 && (
                <div className={cn(
                  "w-1 h-1 rounded-full mt-1",
                  isSelected ? "bg-[#FFD700]" : "bg-[#003366]"
                )} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const selectedDayEvents = events.filter(e => isSameDay(parseISO(e.Date), selectedDate));

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
          <h2 className="text-3xl font-bold text-slate-900">Activities</h2>
          <p className="text-slate-500">Events, tasks, and quick logging</p>
        </div>
        
        {/* Quick Log Row */}
        <div className="flex flex-wrap gap-2">
          <button
            disabled={submitting}
            onClick={() => handleQuickLog('Car Wash', 2000)}
            className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100 hover:bg-emerald-100 transition-all active:scale-95 disabled:opacity-50"
          >
            <Zap size={16} />
            Car Wash - MK 2000
          </button>
          <button
            disabled={submitting}
            onClick={() => handleQuickLog('Shoe Polish', 500)}
            className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-sm font-bold border border-amber-100 hover:bg-amber-100 transition-all active:scale-95 disabled:opacity-50"
          >
            <Sparkles size={16} />
            Shoe Polish - MK 500
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
          </div>

          {/* Event Details */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#003366] text-white rounded-xl">
                  <CalendarIcon size={20} />
                </div>
                <h3 className="font-bold text-slate-900">
                  Events for {format(selectedDate, 'MMMM do, yyyy')}
                </h3>
              </div>
              
              {selectedDayEvents.length > 0 ? (
                <div className="space-y-4">
                  {selectedDayEvents.map((event, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                      <h4 className="font-bold text-slate-900 text-lg">{event.Name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{event.Description}</p>
                      <div className="flex items-center gap-4 mt-4">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {event.Location}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> All Day
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-400">
                  <Info size={32} className="mb-2 opacity-20" />
                  <p className="text-sm italic">No events scheduled for this day.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Delegated Tasks</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {tasks.filter(t => t.Status === 'Pending').length} Pending
            </span>
          </div>

          <div className="space-y-3">
            {tasks.map((task, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 transition-all",
                  task.Status === 'Done' ? "opacity-60" : "hover:border-[#003366]/30"
                )}
              >
                <button
                  onClick={() => toggleTaskStatus(task)}
                  className={cn(
                    "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    task.Status === 'Done' 
                      ? "bg-[#003366] border-[#003366] text-white" 
                      : "border-slate-200 text-transparent hover:border-[#003366]"
                  )}
                >
                  <CheckSquare size={14} />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "font-bold text-sm truncate",
                    task.Status === 'Done' ? "text-slate-400 line-through" : "text-slate-900"
                  )}>
                    {task.Task_Name}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Assigned to {task.Assigned_To}
                  </p>
                </div>
                <div className={cn(
                  "px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest",
                  task.Priority === 'High' ? "bg-red-50 text-red-600" :
                  task.Priority === 'Medium' ? "bg-amber-50 text-amber-600" :
                  "bg-blue-50 text-blue-600"
                )}>
                  {task.Priority}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Congratulations Notification */}
      <AnimatePresence>
        {showCongrats && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#003366] text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10"
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="font-bold text-lg">Congratulations!</p>
              <p className="text-white/70 text-sm">Task completed successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
