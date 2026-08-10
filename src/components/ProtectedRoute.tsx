import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['user', 'admin'] 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b0d] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-cyber-blue-800 opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-l-2 border-cyber-blue-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold tracking-wider text-cyber-blue-500 uppercase animate-pulse">
            SEC
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the path they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If authenticated but role not allowed, redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
