import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../auth/googleAuth";
import { signInWithFacebook } from "../auth/facebookAuth";
import { auth } from "../lib/auth";
import { createUserIfNotExists, getUserFromDB } from "../lib/userService";
import type { User as AppUser } from "../types"; 

export default function Login() {
  const navigate = useNavigate();

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingFacebook, setLoadingFacebook] = useState(false);
  const [error, setError] = useState("");

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      if (provider === "google") setLoadingGoogle(true);
      else setLoadingFacebook(true);
      
      setError("");

      // 1. تسجيل الدخول عبر المزود
      const firebaseUser = provider === "google" ? await signInWithGoogle() : await signInWithFacebook();

      if (!firebaseUser || !firebaseUser.email) {
        throw new Error("لم نتمكن من الحصول على بيانات الحساب");
      }

      // 2. التحقق من وجوده في Firestore أو إنشاؤه ببيانات افتراضية آمنة للـ Types
      let dbUser = await getUserFromDB(firebaseUser.id);
      
      if (!dbUser) {
        dbUser = await createUserIfNotExists({
          id: firebaseUser.id,
          name: firebaseUser.name || "مستخدم",
          email: firebaseUser.email,
          phone: firebaseUser.phone || "",
          type: "individual",
          governorate: "",
          verified: false,
          createdAt: new Date().toISOString()
        });
      }

      // 3. تعيين المستخدم الآمن المطابق للـ Interface في الـ State والملاحة
      auth.setUser(dbUser);
      navigate("/");

    } catch (err: any) {
      console.error(err);
      setError(`فشل تسجيل الدخول بـ ${provider === "google" ? "جوجل" : "فيسبوك"}`);
    } finally {
      setLoadingGoogle(false);
      setLoadingFacebook(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4" dir="rtl">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* GOOGLE */}
        <button
          onClick={() => handleSocialLogin("google")}
          disabled={loadingGoogle || loadingFacebook}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white py-3 rounded-xl mb-3 transition-colors asset-btn"
        >
          {loadingGoogle ? "جاري الدخول..." : "تسجيل الدخول بجوجل"}
        </button>

        {/* FACEBOOK */}
        <button
          onClick={() => handleSocialLogin("facebook")}
          disabled={loadingGoogle || loadingFacebook}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 rounded-xl transition-colors asset-btn"
        >
          {loadingFacebook ? "جاري الدخول..." : "تسجيل الدخول بفيسبوك"}
        </button>
      </div>
    </div>
  );
}