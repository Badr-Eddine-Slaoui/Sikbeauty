"use client";

import React from 'react';
import { Navigate, useLocation } from '@/utils/react-router-dom';
import NotFound from '../views/NotFound';
import { useAuth } from '../contexts/AuthContext';
import PageLoader from './ui/PageLoader';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  requiredRoles = null, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, hasRole, hasAnyRole, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <PageLoader label="Chargement..." />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check single role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <NotFound />;
  }

  // Check multiple roles requirement
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <NotFound />;
  }

  return children;
};

export default ProtectedRoute;

