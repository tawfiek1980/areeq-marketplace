import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { User } from "../types";

// دالة لإنشاء مستخدم جديد في Firestore إذا لم يكن موجوداً (للتسجيل الاجتماعي)
export const createUserIfNotExists = async (user: Partial<User> & { id: string; email: string }) => {
  const ref = doc(db, "users", user.id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const defaultUser: User = {
      id: user.id,
      name: user.name || "مستخدم جديد",
      email: user.email,
      phone: user.phone || "",
      type: user.type || "individual",
      governorate: user.governorate || "القاهرة", // قيمة افتراضية حتى يحددها من ملفه الشخصي
      verified: user.verified || false,
      createdAt: user.createdAt || new Date().toISOString(),
      avatar: user.avatar || "",
    };
    await setDoc(ref, defaultUser);
    return defaultUser;
  }

  return snap.data() as User;
};

// جلب بيانات المستخدم كاملة من قاعدة البيانات
export const getUserFromDB = async (id: string): Promise<User | null> => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);

  return snap.exists() ? (snap.data() as User) : null;
};