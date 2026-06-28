import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerWithEmail } from "../auth/emailAuth";
import { Truck } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError("");

      if (!name || !email || !password) {
        setError("من فضلك املأ جميع البيانات");
        return;
      }

      await registerWithEmail(email, password, name);

      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError("فشل إنشاء الحساب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-bg px-4 py-12">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md p-8 border border-border">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange flex items-center justify-center">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="text-navy font-black text-2xl">طريق</div>
            <div className="text-orange text-xs">TAREEQ</div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">إنشاء حساب جديد</h1>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-xl mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <input
          className="w-full mb-3 p-3 rounded-xl border"
          placeholder="الاسم"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full mb-3 p-3 rounded-xl border"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full mb-4 p-3 rounded-xl border"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-orange text-white py-3 rounded-xl font-bold"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>

        <p className="text-center text-sm mt-4">
          لديك حساب؟{" "}
          <Link to="/login" className="text-orange font-bold">
            تسجيل دخول
          </Link>
        </p>

        {/* 🔥 MISSING FEATURES NOTICE */}
        <div className="mt-6 text-center text-xs text-gray-500">
          قريبًا: تسجيل برقم الهاتف + OTP
        </div>
      </div>
    </div>
  );
}