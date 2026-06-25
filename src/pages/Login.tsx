import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithGoogle } from "../auth/googleAuth";
import { signInWithFacebook } from "../auth/facebookAuth";

import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      setLoadingGoogle(true);
      setError("");

      const user = await signInWithGoogle();

      login(user);

      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      setError("فشل تسجيل الدخول بواسطة جوجل");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleFacebook = async () => {
    try {
      setLoadingFacebook(true);
      setError("");

      const user = await signInWithFacebook();

      login(user);

      navigate("/", { replace: true });

    } catch (err) {
      console.error(err);
      setError("فشل تسجيل الدخول بواسطة فيسبوك");
    } finally {
      setLoadingFacebook(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-gray-100 px-4"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          تسجيل الدخول
        </h1>

        <p className="text-center text-gray-500 mb-8">
          مرحباً بك فى تطبيق طريق
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-5 text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogle}
          disabled={loadingGoogle || loadingFacebook}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl transition mb-4 disabled:opacity-50"
        >
          {loadingGoogle
            ? "جارى تسجيل الدخول..."
            : "تسجيل الدخول بواسطة جوجل"}
        </button>

        <button
          onClick={handleFacebook}
          disabled={loadingGoogle || loadingFacebook}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition disabled:opacity-50"
        >
          {loadingFacebook
            ? "جارى تسجيل الدخول..."
            : "تسجيل الدخول بواسطة فيسبوك"}
        </button>

      </div>
    </div>
  );
}