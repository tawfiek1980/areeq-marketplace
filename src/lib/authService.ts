import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

import { auth, db } from "./firebase";

// =========================
// تسجيل مستخدم جديد
// =========================
export const registerWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCred.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    role: "user", // default role
    createdAt: new Date(),
  });

  return user;
};

// =========================
// تسجيل دخول Email
// =========================
export const loginWithEmail = async (email: string, password: string) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  return userCred.user;
};

// =========================
// Google Login
// =========================
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // لو أول مرة يدخل → ننشئه في Firestore
  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email,
      role: "user",
      createdAt: new Date(),
    });
  }

  return user;
};

// =========================
// Logout
// =========================
export const logoutUser = async () => {
  await signOut(auth);
};