import { Navigate } from "react-router-dom";
import { auth } from "../lib/auth";

export default function ProtectedRoute({
  children,
  adminOnly,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !auth.isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}