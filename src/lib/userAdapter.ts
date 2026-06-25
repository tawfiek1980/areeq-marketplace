import type { User } from '../types';

/**
 * تحويل أي Firebase user → شكل النظام بتاعك
 */
export const adaptFirebaseUser = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'مستخدم جديد',
    email: firebaseUser.email || '',
    phone: firebaseUser.phoneNumber || '',
    
    // ✅ تم التعديل هنا
    type: 'admin',

    governorate: '',
    verified: true,
    createdAt: new Date().toISOString(),
  };
};