import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { auth } from "../lib/auth";
import { adaptFirebaseUser } from "../lib/userAdapter";

const provider = new FacebookAuthProvider();

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, provider);

    const user = adaptFirebaseUser(result.user);

    auth.setAuth(result.user.uid, user);

    return user;

  } catch (error: any) {
    console.error("FACEBOOK FULL ERROR", error);

    alert(error.code + "\n\n" + error.message);

    throw error;
  }
};