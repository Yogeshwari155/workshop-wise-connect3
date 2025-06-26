import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Workshops from './pages/Workshops';
import WorkshopDetail from './pages/WorkshopDetail';
import WorkshopRegistration from './pages/WorkshopRegistration';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode; requireRole?: string }> = ({ 
  children, 
  requireRole 
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/workshops" element={<Workshops />} />
    <Route path="/workshop/:id" element={<WorkshopDetail />} />
    <Route path="/workshop/:id/register" element={
      <PrivateRoute>
        <WorkshopRegistration />
      </PrivateRoute>
    } />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={
      <PrivateRoute>
        <UserDashboard />
      </PrivateRoute>
    } />
    <Route path="/admin" element={
      <PrivateRoute requireRole="admin">
        <AdminDashboard />
      </PrivateRoute>
    } />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;