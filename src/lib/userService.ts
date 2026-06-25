import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { AppUser } from "../types";

export const createUserIfNotExists = async (user: AppUser) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, user);
  }

  return user;
};

export const getUserById = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  return snap.exists() ? (snap.data() as AppUser) : null;
};