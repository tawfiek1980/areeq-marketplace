import type { User } from "../types";

export const adaptFirebaseUser = (firebaseUser: any): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "مستخدم جديد",
    email: firebaseUser.email || "",
    phone: firebaseUser.phoneNumber || "",
    type: "individual", // 👈 أي حد يدخل يبدأ فرد
    governorate: "",
    verified: true,
    createdAt: new Date().toISOString(),
  };
};