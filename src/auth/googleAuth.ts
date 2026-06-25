import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { createUserIfNotExists } from "../lib/userService";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    console.log("🔵 Starting Google Login...");

    const result = await signInWithPopup(firebaseAuth, provider);

    console.log("🟢 Google Login Success");

    const firebaseUser = result.user;

    if (!firebaseUser) {
      throw new Error("No Firebase user returned");
    }

    const user = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || "User",
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