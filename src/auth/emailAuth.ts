import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const auth = getAuth();

/* =========================
   🔥 REGISTER (EMAIL)
========================= */
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = result.user;

  // Update Firebase Auth profile
  await updateProfile(user, {
    displayName: name,
  });

  // Save user in Firestore
  await setDoc(doc(db, "users", user.uid), {
    id: user.uid,
    email: user.email,
    name,
    role: "user",
    type: "user",
    phone: "",
    governorate: "",
    createdAt: new Date().toISOString(),
  });

  return user;
};

/* =========================
   🔥 LOGIN (EMAIL)
========================= */
export const loginWithEmail = async (
  email: string,
  password: string
) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};