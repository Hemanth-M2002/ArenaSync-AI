import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, activeContext, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to signin while saving the attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user is admin, redirect to admin dashboard (prevent collision with fan routes)
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // If authenticated as fan but no active session context, redirect to selection page
  if (!activeContext && location.pathname !== '/select-context' && location.pathname !== '/ticket-verification') {
    return <Navigate to="/select-context" replace />;
  }

  return children;
};

export default ProtectedRoute;
