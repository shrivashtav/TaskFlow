import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('taskflow_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Verify session on initial app load if token exists
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('taskflow_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          // Token invalid or expired
          console.warn('Session verification failed, logging out:', err.message);
          logout();
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, [token]);

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success && res.data?.token) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('taskflow_token', newToken);
      localStorage.setItem('taskflow_user', JSON.stringify(newUser));
      return res;
    }
    throw new Error(res.message || 'Login failed');
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
