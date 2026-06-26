import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { createUserIfNotExists } from "../lib/userService";
import type { User } from "../types";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    console.log("🔵 Starting Google Login...");

    const result = await signInWithPopup(firebaseAuth, provider);

    console.log("🟢 Google Login Success");

    const firebaseUser = result.user;

    if (!firebaseUser) {
      throw new Error("No Firebase user returned");
    }

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

    console.log("🟢 User stored in Firestore");

    return dbUser;

  } catch (error: any) {
    console.error("🔴 FULL GOOGLE ERROR:", error);
    console.error("🔴 ERROR CODE:", error?.code);
    console.error("🔴 ERROR MESSAGE:", error?.message);

    throw error;
  }
};