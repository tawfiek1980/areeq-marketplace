import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import { auth as firebaseAuth } from "../firebase";

const provider = new FacebookAuthProvider();

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(firebaseAuth, provider);

    console.log("FACEBOOK SUCCESS", result);

    return result.user;

  } catch (error) {
    console.error("FACEBOOK FULL ERROR", error);

    alert(
      error.code + "\n\n" + error.message
    );

    throw error;
  }
};