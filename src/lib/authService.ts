import {
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Google Login
export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

// Facebook Login
export const loginWithFacebook = async () => {
  return await signInWithPopup(auth, facebookProvider);
};

// Phone Login (OTP)
export const sendOTP = async (phone: string, recaptcha: any) => {
  const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
  return confirmation;
};

// Recaptcha setup
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
  });
};