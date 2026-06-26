import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import type { User } from "../types";

// إنشاء مستخدم إذا لم يكن موجوداً
export const createUserIfNotExists = async (
  user: Partial<User> & { id: string; email: string }
): Promise<User> => {
  const ref = doc(db, "users", user.id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const defaultUser: User = {
      id: user.id,
      name: user.name || "مستخدم جديد",
      email: user.email,
      phone: user.phone || "",
      type: user.type || "individual",
      governorate: user.governorate || "القاهرة",
      verified: user.verified || false,
      createdAt: user.createdAt || new Date().toISOString(),
      avatar: user.avatar || "",
    };

    await setDoc(ref, {
      ...defaultUser,
      updatedAt: serverTimestamp(),
    });

    return defaultUser;
  }

  return snap.data() as User;
};

// جلب مستخدم
export const getUserFromDB = async (
  id: string
): Promise<User | null> => {
  const ref = doc(db, "users", id);

  const snap = await getDoc(ref);

  if (!snap.exists()) {
    return null;
  }

  return snap.data() as User;
};

// تحديث بيانات المستخدم
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<void> => {
  const ref = doc(db, "users", id);

  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

// هل المستخدم موجود؟
export const userExists = async (
  id: string
): Promise<boolean> => {
  const ref = doc(db, "users", id);

  const snap = await getDoc(ref);

  return snap.exists();
};

// إكمال الملف الشخصي
export const completeProfile = async (
  id: string,
  profile: {
    name: string;
    phone: string;
    governorate: string;
    type: User["type"];
  }
): Promise<void> => {
  await updateUser(id, {
    name: profile.name,
    phone: profile.phone,
    governorate: profile.governorate,
    type: profile.type,
  });
};