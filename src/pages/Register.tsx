import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, User, MapPin, ArrowLeft, Building2 } from 'lucide-react';
import { authApi } from '../lib/api';
import { auth } from '../lib/auth';
import { governorates } from '../lib/data';
import type { User as UserType } from '../types';

const userTypes = [
  { id: 'individual', name: 'فرد' },
  { id: 'company', name: 'شركة نقل' },
  { id: 'dealer', name: 'تاجر شاحنات / معدات' },
  { id: 'workshop', name: 'ورشة صيانة' },
  { id: 'finance', name: 'شركة تمويل' },
];

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    type: 'individual',
    governorate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.register({
        ...formData,
        type: formData.type as UserType['type'],
      });
      
      // تفكيك الـ user والـ token بشكل آمن من الـ response الخاص بـ Axios
      const { user } = response.data.data;
      
      // تعيين البيانات بأمان تام للنوع المعتمد
      auth.setUser(user as UserType); 
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4 py-8" dir="rtl">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/tareeq-logo.png" alt="طريق" className="h-16 w-16 object-contain" />
          </Link>
          <h1 className="text-2xl font-extrabold text-navy mb-2">إنشاء حساب جديد</h1>
          <p className="text-text-light text-sm">انضم إلى أكبر سوق لنقل الثقيل في مصر</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-text mb-1.5">الاسم بالكامل *</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-12 pr-12 pl-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  placeholder="الاسم الثلاثي"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">البريد الإلكتروني *</label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 pr-12 pl-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none text-left"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">رقم الموبايل *</label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full h-12 pr-12 pl-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none text-left"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">نوع الحساب *</label>
                <div className="relative">
                  <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-12 pr-12 pl-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none appearance-none"
                  >
                    {userTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">المحافظة *</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                  <select
                    required
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full h-12 pr-12 pl-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none appearance-none"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text mb-1.5">كلمة المرور *</label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 pr-12 pl-12 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none text-left"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-orange hover:bg-orange-dark disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-light text-sm">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-orange font-bold hover:underline">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}