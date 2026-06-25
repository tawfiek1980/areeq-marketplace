import type { User } from '../types';

/**

* تحويل Firebase User → User
  */
  export const adaptFirebaseUser = (firebaseUser: any): User => {
  return {
  id: firebaseUser.uid,
  name: firebaseUser.displayName || 'مستخدم جديد',
  email: firebaseUser.email || '',
  phone: firebaseUser.phoneNumber || '',

  // أي مستخدم جديد يكون فرد عادي
  type: 'individual',

  governorate: '',
  verified: true,
  createdAt: new Date().toISOString(),
  };
  };
