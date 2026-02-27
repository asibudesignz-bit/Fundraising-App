import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import People from './components/People';
import Finance from './components/Finance';
import Activities from './components/Activities';
import Documents from './components/Documents';
import Notifications from './components/Notifications';
import Login from './components/Login';
import { AuthProvider, useAuth } from './AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="people" element={<People />} />
            <Route path="finance" element={<Finance />} />
            <Route path="activities" element={<Activities />} />
            <Route path="documents" element={<Documents />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
