// userService.ts
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import type { User } from "../types";

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
      whatsapp: user.whatsapp || user.phone || "",
      type: user.type || "individual",
      governorate: user.governorate || "القاهرة",
      city: user.city || "",
      currentLocation: user.currentLocation || "",
      avatar: user.avatar || "",
      drivingType: user.drivingType || "",
      experienceYears: user.experienceYears || 0,
      businessName: user.businessName || "",
      specialization: user.specialization || "",
      verified: user.verified || false,
      createdAt: user.createdAt || new Date().toISOString(),
    };

    await setDoc(ref, {
      ...defaultUser,
      updatedAt: serverTimestamp(),
    });

    return defaultUser;
  }

  return snap.data() as User;
};

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

export const userExists = async (
  id: string
): Promise<boolean> => {
  const ref = doc(db, "users", id);
  const snap = await getDoc(ref);
  return snap.exists();
};

export const completeProfile = async (
  id: string,
  profile: Partial<User>
): Promise<void> => {
  await updateUser(id, profile);
};