import type { User } from "../types";

const USER_KEY = "tareeq_user";

export const auth = {
  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser(): User | null {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return !!this.getUser();
  },

  isAdmin() {
    const user = this.getUser();
    return user?.role === "admin" || user?.type === "admin";
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  },
};