import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";

const auth = getAuth();

export const sendOTP = async (phone: string) => {
  const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  const confirmation = await signInWithPhoneNumber(
    auth,
    phone,
    recaptcha
  );

  return confirmation;
};