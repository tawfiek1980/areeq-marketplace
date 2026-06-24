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
  name: 'مدير المنصة',
  email: 'admin@tareeq.com',
  phone: '01000000000',
  type: 'admin',
  governorate: 'القاهرة',
  verified: true,
  createdAt: new Date().toISOString(),
} as User;

export const demoUser = {
  id: 'user-1',
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  phone: '01001234567',
  type: 'company',
  governorate: 'القاهرة',
  verified: true,
  createdAt: new Date().toISOString(),
} as User;
