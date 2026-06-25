import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseAuth } from "../firebase";
import { auth } from "../lib/auth";
import { adaptFirebaseUser } from "../lib/userAdapter";

const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, provider);

    const user = adaptFirebaseUser(result.user);

    auth.setAuth(result.user.uid, user);

    return user;

  } catch (error) {
    console.error("GOOGLE FULL ERROR", error);

    alert(
      error.code + "\n\n" + error.message
    );

    throw error;
  }
};