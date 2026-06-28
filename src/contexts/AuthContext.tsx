import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/auth";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const u = auth.getUser();
      setUser(u);
    } catch (e) {
      console.log("Auth error:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (user: User) => {
    auth.setUser(user);
    setUser(user);
  };

  const logout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);