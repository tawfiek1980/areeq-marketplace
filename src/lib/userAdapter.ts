import type { User } from "../types";

export const adaptFirebaseUser = (firebaseUser: any): User => {
  const adminEmails = [
    "tawfiek.fayez@gmail.com",
    "tawfiek1980@gmail.com"
  ];

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || "مستخدم جديد",
    email: firebaseUser.email || "",
    phone: firebaseUser.phoneNumber || "",

    type: adminEmails.includes(firebaseUser.email)
      ? "admin"
      : "individual",

    governorate: "",
    verified: true,
    createdAt: new Date().toISOString(),
  };
};