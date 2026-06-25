import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';

import { authApi } from '../lib/api';
import { auth, demoAdmin } from '../lib/auth';

// 🔵 Social Auth
import { signInWithGoogle } from '../auth/googleAuth';
import { signInWithFacebook } from '../auth/facebookAuth';

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // =========================
  // 🔐 EMAIL / PASSWORD LOGIN (API)
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // حساب الأدمن المؤقت
      if (
        formData.email === 'tawfiek1980@gmail.com' &&
        formData.password === '123456'
      ) {
        auth.setAuth('admin-token', demoAdmin);
        navigate('/admin');
        return;
      }

      // مؤقتاً لو أي شخص حاول يدخل
      setError('بيانات الدخول غير صحيحة');
    } catch (err: any) {
      setError(err.response?.data?.message || 'بيانات الدخول غير صالحة');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔵 GOOGLE LOGIN
  // =========================
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      window.location.href = '/';
    } catch (error: any) {
      console.error("GOOGLE FULL ERROR", error);
      alert(error.code + "\n\n" + error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 📘 FACEBOOK LOGIN
  // =========================
  const handleFacebookLogin = async () => {
    try {
      setLoading(true);
      await signInWithFacebook();
      window.location.href = '/';
    } catch (error) {
      console.error('Facebook login error:', error);
      alert('فشل تسجيل الدخول بفيسبوك');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/tareeq-logo.png" alt="طريق" className="h-16 w-16 object-contain" />
          </Link>

          <h1 className="text-2xl font-extrabold text-navy mb-2">
            تسجيل الدخول
          </h1>

          <p className="text-text-light text-sm">
            أهلاً بك في طريق
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
              {error}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-text mb-1.5">
                البريد الإلكتروني
              </label>

              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full h-12 pr-12 pl-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-text mb-1.5">
                كلمة المرور
              </label>

              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full h-12 pr-12 pl-12 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-1.5 text-text-light">
                <input type="checkbox" />
                <span>تذكرني</span>
              </label>

              <Link to="#" className="text-orange font-bold">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              {loading ? 'جاري الدخول...' : 'دخول'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          {/* ========================= */}
          {/* SOCIAL LOGIN */}
          {/* ========================= */}
          <div className="mt-6 space-y-3">

            {/* Google */}
            <button
              type="button"
              onClick={() => {
                console.log("GOOGLE BUTTON CLICKED");
                handleGoogleLogin();
              }}
              className="w-full h-12 bg-white border border-gray-200 hover:bg-gray-50 text-black font-bold rounded-xl flex items-center justify-center gap-2"
            >
              🔵 تسجيل الدخول بجوجل
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2"
            >
              📘 تسجيل الدخول بفيسبوك
            </button>

          </div>

          {/* Register */}
          <div className="mt-6 text-center">
            <p className="text-text-light text-sm">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-orange font-bold">
                أنشئ حساب جديد
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}