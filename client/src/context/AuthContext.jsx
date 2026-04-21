import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeContext, setActiveContextState] = useState(() => {
    try {
      const stored = sessionStorage.getItem('activeContext');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setActiveContext = (context) => {
    if (context) {
      sessionStorage.setItem('activeContext', JSON.stringify(context));
    } else {
      sessionStorage.removeItem('activeContext');
    }
    setActiveContextState(context);
  };

  // Check if user is logged in on mount
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Session verification failed:', err);
        localStorage.removeItem('token');
        setActiveContext(null); // Clear context if session fails
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Login with email/password
  const login = async (email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth transition delay
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register with email/password
  const register = async (name, email, password) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth transition delay
    setError(null);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Google Login
  const googleLogin = async (credential) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Smooth transition delay
    setError(null);
    try {
      const res = await api.post('/auth/google', { credential });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Google Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 600)); // Smooth exit delay
    localStorage.removeItem('token');
    setActiveContext(null); // Ensure session context is removed
    setUser(null);
    setLoading(false);
  };

  // Update Profile (Name, Email, Preferences)
  const updateProfile = async (data) => {
    try {
      const res = await api.put('/users/profile', data);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return { success: false, message: err.response?.data?.message || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      activeContext,
      setActiveContext,
      login,
      register,
      googleLogin,
      logout,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
