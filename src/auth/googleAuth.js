import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { adaptFirebaseUser } from "../lib/userAdapter";
import { auth } from "../lib/auth";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(firebaseAuth, provider);

  const user = adaptFirebaseUser(result.user);

  // ⚠️ مهم: نحفظ user + token fake أو uid
  auth.setUser(user);

  return user;
};