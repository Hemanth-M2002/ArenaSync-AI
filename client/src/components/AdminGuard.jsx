import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SplashScreen from './SplashScreen';

/**
 * High-Order Component to protect Admin routes.
 * Specifically checks for the 'admin' role in the isolated StaffCards collection context.
 */
const AdminGuard = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SplashScreen isVisible={true} />;
  }

  const isAdmin = user?.role === 'admin';

  if (!isAuthenticated || !isAdmin) {
    // Redirect to admin login if not authorized
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminGuard;
