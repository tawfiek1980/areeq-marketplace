import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";

import { auth } from "../lib/auth";
import { createUserIfNotExists } from "../services/userService";

import type { User } from "../types";

const provider = new FacebookAuthProvider();

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, provider);

    const firebaseUser = result.user;

    const user: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "مستخدم جديد",
      email: firebaseUser.email || "",
      phone: firebaseUser.phoneNumber || "",
      avatar: firebaseUser.photoURL || "",
      governorate: "",
      verified: firebaseUser.emailVerified,
      type: "individual",
      createdAt: new Date().toISOString(),
    };

    const dbUser = await createUserIfNotExists(user);

    auth.setUser(dbUser);

    return dbUser;

  } catch (error) {
    console.error("Facebook Login Error:", error);
    throw error;
  }
};