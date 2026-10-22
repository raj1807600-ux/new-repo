import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, studentAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('oriental_token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('oriental_token');
      if (savedToken) {
        try {
          const res = await authAPI.getMe();
          setUser(res.data.user);
          setStudent(res.data.student);
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { access_token, user: userData, student: studentData } = res.data;
    localStorage.setItem('oriental_token', access_token);
    setToken(access_token);
    setUser(userData);
    setStudent(studentData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { access_token, user: userData, student: studentData } = res.data;
    localStorage.setItem('oriental_token', access_token);
    setToken(access_token);
    setUser(userData);
    setStudent(studentData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('oriental_token');
    setToken(null);
    setUser(null);
    setStudent(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await studentAPI.getProfile();
      setStudent(res.data.student);
      return res.data;
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin' || user?.role === 'tpo';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        student,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isStudent,
        login,
        register,
        logout,
        refreshProfile,
        setStudent
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
