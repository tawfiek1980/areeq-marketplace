import { Navigate } from "react-router-dom";
import { auth } from "../lib/auth";
import { useAuth } from "../contexts/AuthContext";
import type { User } from "../types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // 🚀 FIX: prevent white screen crash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  // 🚀 FIX: safe redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const safeUser = user as User;

  const role = safeUser.role || safeUser.type;

  // 🔥 Admin guard
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 🔥 Profile completion check
  const isProfileComplete =
    !!safeUser.name?.trim() &&
    !!safeUser.email?.trim() &&
    !!safeUser.phone?.trim() &&
    !!safeUser.governorate?.trim();

  if (!isProfileComplete && window.location.pathname !== "/complete-profile") {
    return <Navigate to="/complete-profile" replace />;
  }

  return <>{children}</>;
}