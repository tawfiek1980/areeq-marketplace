import { auth } from "./firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

let recaptchaVerifier: RecaptchaVerifier;

export const setupRecaptcha = () => {
  recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
    }
  );
};

export const sendOTP = async (phone: string) => {
  if (!recaptchaVerifier) setupRecaptcha();

  const confirmation = await signInWithPhoneNumber(
    auth,
    phone,
    recaptchaVerifier
  );

  return confirmation;
};