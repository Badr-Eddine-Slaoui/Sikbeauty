"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, api, setAuthFunctions } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessTokenRef = useRef(null); // Store access token in memory, not state
  const isInitialized = useRef(false);

  useEffect(() => {
    // Initialize auth functions for API interceptors
    setAuthFunctions(getAccessToken, setAccessToken, refreshAccessToken);
    
    // Try to restore session on app load
    const initializeAuth = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        // Check if user data exists in localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          // Try to refresh the access token using the refresh token cookie
          const response = await api.post('/api/v1/auth/refresh');
          const { accessToken } = response.data;
          
          // Restore user and token
          setUser(JSON.parse(storedUser));
          accessTokenRef.current = accessToken;
        }
      } catch (error) {
        // Refresh token expired or invalid - clear stored data
        localStorage.removeItem('user');
        setUser(null);
        accessTokenRef.current = null;
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, accessToken) => {
    setUser(userData);
    accessTokenRef.current = accessToken;
    // Persist user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const getAccessToken = () => {
    return accessTokenRef.current;
  };

  const setAccessToken = (token) => {
    accessTokenRef.current = token;
  };

  const logout = async () => {
    setUser(null);
    accessTokenRef.current = null;
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Call backend to clear the refresh token cookie
    try {
      await api.post('/api/v1/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const register = async (payload) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    // After successful registration, set the user data and access token
    if (response.data.user && response.data.accessToken) {
      setUser(response.data.user);
      accessTokenRef.current = response.data.accessToken;
      // Persist user data to localStorage
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/api/v1/auth/refresh');
      const { accessToken } = response.data;
      accessTokenRef.current = accessToken;
      return accessToken;
    } catch (error) {
      // Refresh token expired or invalid - logout user
      setUser(null);
      accessTokenRef.current = null;
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (requiredRole) => {
    if (!user || !user.role) return false;
    // Case-insensitive comparison
    return user.role.toLowerCase() === requiredRole.toLowerCase();
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.role) return false;
    // Case-insensitive comparison
    return roles.some(role => user.role.toLowerCase() === role.toLowerCase());
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    getAccessToken,
    setAccessToken,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
