import { useState } from 'react';
import { CheckCircle, Landmark, Truck, Construction, Calculator, ChevronLeft } from 'lucide-react';
import { financeApi } from '../lib/api';
import { governorates } from '../lib/data';

const vehicleTypes = [
  'شاحنة نقل ثقيل',
  'رأس جرارة',
  'نصف مقطورة',
  'تانكر',
  'شاحنة برادة',
  'قلابة',
  'حفار',
  'لودر',
  'كرينة',
  'بلدوزر',
  'رافعة شوكية',
  'معدات أخرى',
];

export default function Finance() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    vehicleType: '',
    vehiclePrice: '',
    downPayment: '',
    monthlyIncome: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await financeApi.create({
        name: formData.name,
        phone: formData.phone,
        governorate: formData.governorate,
        vehicleType: formData.vehicleType,
        vehiclePrice: Number(formData.vehiclePrice),
        downPayment: Number(formData.downPayment) || 0,
        monthlyIncome: Number(formData.monthlyIncome) || 0,
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting finance request:', error);
    } finally {
      setLoading(false);
    }
  };

  const estimatedInstallment = () => {
    const price = Number(formData.vehiclePrice) || 0;
    const down = Number(formData.downPayment) || 0;
    const financeAmount = price - down;
    if (financeAmount <= 0) return 0;
    const months = 60;
    const rate = 0.015;
    return Math.round((financeAmount * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy mb-2">تم إرسال الطلب بنجاح</h2>
          <p className="text-text-light text-sm mb-6">سيتم التواصل معك من قبل فريق التمويل في أقرب وقت</p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
          >
            طلب جديد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">تمويل نقل الثقيل</h1>
          <p className="text-gray-300 text-sm sm:text-base">أملحصول على شاحنتك أو معدتك بأقساط مرونة تبدأ من 10%</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Landmark className="w-6 h-6 text-orange" />
                <h2 className="text-xl font-extrabold text-navy">طلب تمويل جديد</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">الاسم بالكامل *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                      placeholder="الاسم الثلاثي"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">رقم الموبايل *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">المحافظة *</label>
                    <select
                      name="governorate"
                      required
                      value={formData.governorate}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    >
                      <option value="">اختر المحافظة</option>
                      {governorates.map((g) => (
                        <option key={g.id} value={g.name}>{g.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">نوع المركبة *</label>
                    <select
                      name="vehicleType"
                      required
                      value={formData.vehicleType}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    >
                      <option value="">اختر نوع المركبة</option>
                      {vehicleTypes.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">سعر المركبة (جنيه) *</label>
                    <input
                      type="number"
                      name="vehiclePrice"
                      required
                      value={formData.vehiclePrice}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                      placeholder="1000000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">الدفعة الأولى (جنيه)</label>
                    <input
                      type="number"
                      name="downPayment"
                      value={formData.downPayment}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">الدخل الشهري (جنيه)</label>
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                      placeholder="15000"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-orange hover:bg-orange-dark disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? 'جاري إرسال...' : 'إرسال طلب التمويل'}
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Calculator & Info */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-5 text-white">
              <Calculator className="w-8 h-8 text-orange mb-3" />
              <h3 className="text-lg font-bold mb-2">حاسبة القسط</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">سعر المركبة</span>
                  <span className="font-bold">{(Number(formData.vehiclePrice) || 0).toLocaleString('ar-EG')} ج</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">الدفعة الأولى</span>
                  <span className="font-bold">{(Number(formData.downPayment) || 0).toLocaleString('ar-EG')} ج</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">القسط الشهري المتوقع</span>
                    <span className="text-xl font-extrabold text-orange">{estimatedInstallment().toLocaleString('ar-EG')} ج</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">احتساب تقريبي لمدة 5 سنوات</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-navy mb-4">لماذا طريق؟</h3>
              <ul className="space-y-3">
                {[
                  'تمويل حتى 4 ملايين جنيه',
                  'مدة سداد تبدأ من 5 سنوات',
                  'دفعة أولى تبدأ من 10%',
                  'موافقة مالية تأمينية',
                  'إجراءات سريعة بدون أوراق كثيرة',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text">
                    <CheckCircle className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange/10 rounded-2xl p-5 border border-orange/20">
              <div className="flex items-center gap-2 mb-2">
                <Truck className="w-5 h-5 text-orange" />
                <Construction className="w-5 h-5 text-orange" />
              </div>
              <h3 className="text-base font-bold text-navy mb-1">نموذج مركبات متعددة</h3>
              <p className="text-xs text-text-light">نغطي للشاحنات، المعدات الثقيلة، والقطع الغيار</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
