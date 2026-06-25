import { Navigate } from "react-router-dom";
import { auth } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export default function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  // التحقق من تسجيل الدخول
  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = auth.getUser();

  if (!user) {
    auth.logout();
    return <Navigate to="/login" replace />;
  }

  // التحقق من صلاحيات المدير
  if (adminOnly && user.type !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}