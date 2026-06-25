import type { User } from "../types";

const ADMIN_EMAILS = [
  "tawfiek.fayez@gmail.com"
];

export const adaptFirebaseUser = (firebaseUser: any): User => {
  const email = firebaseUser.email || "";

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "مستخدم جديد",
    email,
    phone: firebaseUser.phoneNumber || "",

    // 🚨 أهم تعديل هنا
    type: ADMIN_EMAILS.includes(email) ? "admin" : "individual",

    governorate: "",
    verified: true,
    createdAt: new Date().toISOString(),
  };
};