// Libs
import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
// Hooks
import { useAuth } from '../hooks/auth/useAuth';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <Navigate to="/conversas" replace /> : children;
};


