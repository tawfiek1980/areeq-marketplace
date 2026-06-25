import type { User } from '../types';

const TOKEN_KEY = 'tareeq_token';
const USER_KEY = 'tareeq_user';

export const auth = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  getUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  setAuth: (token: string, user: User): void => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  logout: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
  isAdmin: (): boolean => {
    const user = auth.getUser();
    return user?.type === 'admin';
  },
};


export const demoAdmin = {
  id: 'admin-1',
  name: 'توفيق',
  email: 'tawfiek1980@gmail.com',
  phone: '01018870145',
  type: 'admin',
  governorate: 'بني سويف',
  verified: true,
  createdAt: new Date().toISOString(),
} as User;