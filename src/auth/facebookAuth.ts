import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";
import { syncUserToFirestore } from "../lib/userSync";

export const signInWithFacebook = async () => {
  const provider = new FacebookAuthProvider();

  const result = await signInWithPopup(auth, provider);

  const firebaseUser = result.user;

  const user = await syncUserToFirestore({
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
  });

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    name: firebaseUser.displayName,
    role: user?.role || "user",
  };
};