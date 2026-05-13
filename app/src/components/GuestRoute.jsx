"use client";

import React from 'react';
import { Navigate } from '@/utils/react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardPath } from '../utils/auth';
import PageLoader from './ui/PageLoader';

const GuestRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const authenticated = isAuthenticated();

  if (loading) {
    return (
      <PageLoader label="Chargement..." />
    );
  }

  if (authenticated) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }

  return children;
};

export default GuestRoute;

