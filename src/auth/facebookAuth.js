import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { adaptFirebaseUser } from "../lib/userAdapter";
import { auth } from "../lib/auth";

const provider = new FacebookAuthProvider();

export const signInWithFacebook = async () => {
  const result = await signInWithPopup(firebaseAuth, provider);

  const user = adaptFirebaseUser(result.user);

  auth.setUser(user);

  return user;
};