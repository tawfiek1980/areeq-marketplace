import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { signInWithGoogle } from "../auth/googleAuth";
import { signInWithFacebook } from "../auth/facebookAuth";
import { useAuth } from "../contexts/AuthContext";
import { Truck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== EMAIL LOGIN =====
  const handleEmailLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await signInWithEmailAndPassword(auth, email, password);

      const user = {
        uid: res.user.uid,
        email: res.user.email || "",
        name: res.user.displayName || "",
        role: "user",
      };

      login(user as any);
      navigate("/", { replace: true });
    } catch (err: any) {
      console.log(err);
      setError("فشل تسجيل الدخول بالإيميل أو كلمة المرور غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  // ===== GOOGLE =====
  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");

      const res: any = await signInWithGoogle();

      const user = {
        uid: res.uid,
        email: res.email || "",
        // تم حل مشكلة الاسم هنا
        name: res.displayName || res.name || "",
        role: "user",
      };

      login(user as any);
      navigate("/", { replace: true });
    } catch (err) {
      setError("فشل تسجيل الدخول بجوجل");
    } finally {
      setLoading(false);
    }
  };

  // ===== FACEBOOK =====
  const handleFacebook = async () => {
    try {
      setLoading(true);
      setError("");

      const res: any = await signInWithFacebook();

      const user = {
        uid: res.uid,
        email: res.email || "",
        // تم حل مشكلة الاسم هنا
        name: res.displayName || res.name || "",
        role: "user",
      };

      login(user as any);
      navigate("/", { replace: true });
    } catch (err) {
      setError("فشل تسجيل الدخول بفيسبوك");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center">
            <Truck className="text-white" />
          </div>
          <div className="font-bold text-xl">طريق</div>
        </div>

        <h1 className="text-center text-xl font-bold mb-4">تسجيل الدخول</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-3 text-center">
            {error}
          </div>
        )}

        {/* EMAIL LOGIN */}
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-2"
        />

        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-3"
        />

        <button
          onClick={handleEmailLogin}
          disabled={loading}
          className="w-full bg-orange-500 text-white p-2 rounded mb-3"
        >
          {loading ? "جاري الدخول..." : "تسجيل دخول"}
        </button>

        {/* SOCIAL */}
        <button onClick={handleGoogle} className="w-full border p-2 rounded mb-2">
          تسجيل بجوجل
        </button>

        <button onClick={handleFacebook} className="w-full bg-blue-600 text-white p-2 rounded">
          تسجيل بفيسبوك
        </button>

        {/* REGISTER */}
        <div className="text-center mt-4 text-sm">
          ليس لديك حساب؟{" "}
          <Link to="/register" className="text-orange-500">
            إنشاء حساب
          </Link>
        </div>
      </div>
    </div>
  );
}