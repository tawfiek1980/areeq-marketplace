import type { User } from "../types";

export const adaptFirebaseUser = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "مستخدم جديد",
    email: firebaseUser.email || "",
    phone: firebaseUser.phoneNumber || "",

    // 🔒 تعيين نوع الحساب مؤقتاً كـ individual لجميع المسجلين عبر السوشيال ميديا
    type: "individual",

    governorate: "",
    verified: true,
    createdAt: new Date().toISOString(),
  };
};