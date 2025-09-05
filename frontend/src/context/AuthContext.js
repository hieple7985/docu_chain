import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set axios default header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            // Token expired
            logout();
          } else {
            // Get user data
            const res = await axios.get(API_ENDPOINTS.PROFILE.replace('/users/profile', '/auth/me'));
            setCurrentUser(res.data.data);
          }
        } catch (error) {
          console.error('Auth error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post(API_ENDPOINTS.REGISTER, userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setCurrentUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, userData);
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setCurrentUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const res = await axios.put('/api/auth/me', userData);
      
      if (res.data.success) {
        setCurrentUser(res.data.data);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed'
      };
    }
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
