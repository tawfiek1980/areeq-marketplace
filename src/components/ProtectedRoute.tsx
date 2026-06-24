import { Navigate } from 'react-router-dom';
import { auth } from '../lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !auth.isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
