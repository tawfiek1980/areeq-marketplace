import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import type { User } from "../types";

/**
 * إنشاء مستخدم إذا لم يكن موجود
 */
export const createUserIfNotExists = async (
  user: User
): Promise<User> => {
  const userRef = doc(db, "users", user.id);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(userRef, {
      ...user,
      createdAt: user.createdAt || new Date().toISOString(),
    });

    return user;
  }

  return snapshot.data() as User;
};

/**
 * جلب مستخدم
 */
export const getUser = async (
  uid: string
): Promise<User | null> => {
  const userRef = doc(db, "users", uid);

  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return snapshot.data() as User;
};

/**
 * تحديث مستخدم
 */
export const updateUser = async (
  uid: string,
  data: Partial<User>
) => {
  const userRef = doc(db, "users", uid);

  await updateDoc(userRef, data);
};