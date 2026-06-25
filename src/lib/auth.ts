import type { User } from "../types";

const USER_KEY = "tareeq_user";

export const auth = {
  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(USER_KEY);
  },

  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.type === "admin";
  },
};