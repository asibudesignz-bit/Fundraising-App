import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Mail, Key, ShieldCheck, UserPlus, User, GraduationCap, Briefcase } from 'lucide-react';
import { Member } from '../types';

export default function Login() {
  const { login, register } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [name, setName] = useState('');
  const [program, setProgram] = useState('');
  const [year, setYear] = useState('1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (isRegistering) {
      const newMember: Member = {
        Name: name,
        Email: email,
        Reg_Number: regNumber,
        Program: program,
        Year: parseInt(year),
        Role: 'Member',
        Total_Owed: 0,
        Status: 'Active'
      };
      const success = await register(newMember);
      if (!success) {
        setError('Registration failed. Please try again.');
        setLoading(false);
      }
    } else {
      const success = await login(email, regNumber);
      if (!success) {
        setError('Invalid credentials. Please check your email and registration number.');
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#003366] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#003366] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#003366]/20">
            <ShieldCheck size={32} className="text-[#FFD700]" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Fundraising Manager</h1>
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'Create your account' : 'Fundraising Department Portal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Program</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        required
                        type="text"
                        placeholder="BSc CS"
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all text-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Year</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all text-sm appearance-none"
                      >
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                required
                type="text"
                placeholder="BS/2023/001"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003366]/20 focus:border-[#003366] transition-all text-sm"
              />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-xs font-medium text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#003366] text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-[#003366]/20 hover:bg-[#002244] transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isRegistering ? <UserPlus size={20} /> : <LogIn size={20} />}
                <span>{isRegistering ? 'Create Account' : 'Enter Portal'}</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-[#003366] text-sm font-bold hover:underline"
          >
            {isRegistering ? 'Already have an account? Login' : 'New member? Register here'}
          </button>
        </div>

        <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-widest font-bold">
          Fundraising Department • UNIMA
        </p>
      </motion.div>
    </div>
  );
}
