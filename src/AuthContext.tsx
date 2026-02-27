import React, { createContext, useContext, useState, useEffect } from 'react';
import { Member } from './types';
import { api } from './services/api';

interface AuthContextType {
  user: Member | null;
  login: (email: string, regNumber: string) => Promise<boolean>;
  register: (memberData: Member) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('magso_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, regNumber: string) => {
    try {
      const members = await api.getMembers();
      const foundUser = members.find(m => 
        m.Email.toLowerCase() === email.toLowerCase() && 
        m.Reg_Number.toLowerCase() === regNumber.toLowerCase()
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('magso_user', JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (memberData: Member) => {
    try {
      const teamMember = { ...memberData, Type: 'Team' as const };
      const result = await api.addMember(teamMember);
      if (result.success) {
        setUser(teamMember);
        localStorage.setItem('magso_user', JSON.stringify(teamMember));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('magso_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
