import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";
import { auth } from "../lib/auth";
import { adaptFirebaseUser } from "../lib/userAdapter";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(firebaseAuth, provider);

  const user = adaptFirebaseUser(result.user);

  // 🔥 unified system
  auth.setAuth(result.user.uid, user);

  return user;
};