// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { attachToken } from '../services/api';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('CheckAuth - Token from localStorage:', token ? 'Found' : 'Not found');

      if (!token) {
        console.log('CheckAuth - No token, user not authenticated');
        setLoading(false);
        setUser(null);
        attachToken(null);
        return null;
      }

      // attach the token for the upcoming request
      attachToken(token);

      console.log('CheckAuth - Fetching user data...');
      const { data } = await api.get('/api/auth/current');
      console.log('CheckAuth - User data received:', data);

      setUser(data);
      return data;
    } catch (error) {
      console.error('CheckAuth - Failed:', error.response?.status, error.response?.data);
      localStorage.removeItem('token');
      attachToken(null);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('=== LOGIN START ===');
      console.log('1. Attempting login for:', email);

      const response = await api.post('/api/auth/login', { email, password });
      console.log('2. Response status:', response.status);
      console.log('3. Response data:', response.data);

      const { data } = response;

      if (!data.token || !data.user) {
        console.error('ERROR: Invalid response format', data);
        toast.error('Invalid server response');
        return { success: false, error: 'Invalid server response' };
      }

      // Save token and attach it
      localStorage.setItem('token', data.token);
      attachToken(data.token);
      console.log('Token saved and attached to axios');

      // Update user state
      setUser(data.user);
      console.log('User state updated');

      toast.success('Login successful!');
      console.log('=== LOGIN END - SUCCESS ===');
      return { success: true, user: data.user };
    } catch (error) {
      console.error('=== LOGIN ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      const { data } = response;

      if (!data.token || !data.user) {
        toast.error('Invalid server response');
        return { success: false, error: 'Invalid server response' };
      }

      localStorage.setItem('token', data.token);
      attachToken(data.token);
      setUser(data.user);
      toast.success('Registration successful! Please check your email.');
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout - API error (ignoring):', error);
    } finally {
      localStorage.removeItem('token');
      attachToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  };

  const loginWithGoogle = () => {
    console.log('LoginWithGoogle - Redirecting to:', `${API_BASE_URL}/api/auth/google`);
    // Save current URL to redirect back later
    const returnUrl = window.location.pathname;
    if (returnUrl && returnUrl !== '/login' && returnUrl !== '/register') {
      sessionStorage.setItem('returnUrl', returnUrl);
    }
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const updateUser = (userData) => {
    console.log('UpdateUser - Updating user data:', userData);
    setUser(userData);
  };

  const verifyEmail = async (token) => {
    try {
      const { data } = await api.get(`/api/auth/verify-email/${token}`);
      toast.success(data.message || 'Email verified successfully!');
      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Verification failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      toast.success(data.message || 'Password reset link sent to your email');
      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send reset link';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
      toast.success(data.message || 'Password reset successful!');
      return { success: true, message: data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Password reset failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { data } = await api.put('/api/auth/profile', updates);
      setUser(data);
      toast.success('Profile updated successfully');
      return { success: true, user: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginWithGoogle,
    checkAuth,
    updateUser,
    updateProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
