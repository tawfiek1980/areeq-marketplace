import { useState } from "react";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState(1);
  const [confirmation, setConfirmation] = useState<any>(null);

  const auth = getAuth();

  const sendOTP = async () => {
    (window as any).recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );

    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      (window as any).recaptchaVerifier
    );

    setConfirmation(confirmationResult);
    setStep(2);
  };

  const verifyOTP = async () => {
    await confirmation.confirm(code);
  };

  return (
    <div className="mt-6">
      <div id="recaptcha-container"></div>

      {step === 1 && (
        <>
          <input
            className="w-full p-3 border rounded-xl mb-3"
            placeholder="رقم الموبايل +20"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            className="w-full bg-black text-white py-2 rounded-xl"
            onClick={sendOTP}
          >
            إرسال كود
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="w-full p-3 border rounded-xl mb-3"
            placeholder="كود التحقق"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            className="w-full bg-green-600 text-white py-2 rounded-xl"
            onClick={verifyOTP}
          >
            تأكيد
          </button>
        </>
      )}
    </div>
  );
}