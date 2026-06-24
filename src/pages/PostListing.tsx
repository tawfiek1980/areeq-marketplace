import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Truck, Package, HardHat, Wrench, Upload, ArrowLeft, CheckCircle } from 'lucide-react';
import { listingsApi, loadsApi, jobsApi } from '../lib/api';
import { auth } from '../lib/auth';
import { governorates, vehicleCategories, equipmentCategories, cargoTypes, jobTypes } from '../lib/data';
import type { Job } from '../types';

const listingTypes = [
  { id: 'vehicle', name: 'شاحنة أو معدات', icon: Truck },
  { id: 'load', name: 'حمولة', icon: Package },
  { id: 'job', name: 'وظيفة', icon: HardHat },
  { id: 'spare-part', name: 'قطعة غيار', icon: Wrench },
];

export default function PostListing() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listingType, setListingType] = useState(searchParams.get('type') || 'vehicle');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Vehicle form
  const [vehicleForm, setVehicleForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'trucks',
    subcategory: '',
    governorate: '',
    location: '',
    year: '',
    brand: '',
    model: '',
    condition: 'used',
    images: [] as string[],
  });

  // Load form
  const [loadForm, setLoadForm] = useState({
    origin: '',
    destination: '',
    cargoType: '',
    weight: '',
    price: '',
    date: '',
  });

  // Job form
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    type: 'driver',
    location: '',
    governorate: '',
    salary: '',
    description: '',
    requirements: '',
    experience: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVehicleForm((prev) => ({
          ...prev,
          images: [...prev.images, reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      if (listingType === 'vehicle' || listingType === 'spare-part') {
        await listingsApi.create({
          ...vehicleForm,
          price: Number(vehicleForm.price),
          year: Number(vehicleForm.year) || undefined,
          location: vehicleForm.location || vehicleForm.governorate,
          governorate: vehicleForm.governorate,
          userName: user.name,
          userPhone: user.phone,
          userType: user.type,
          category: listingType === 'spare-part' ? 'spare-parts' : vehicleForm.category,
          condition: vehicleForm.condition as 'new' | 'used',
        });
      } else if (listingType === 'load') {
        await loadsApi.create({
          ...loadForm,
          price: Number(loadForm.price),
          userName: user.name,
          userPhone: user.phone,
        });
      } else if (listingType === 'job') {
        await jobsApi.create({
          ...jobForm,
          type: jobForm.type as Job['type'],
          requirements: jobForm.requirements.split('\n').filter(Boolean),
          userName: user.name,
          userPhone: user.phone,
        });
      }
      setSubmitted(true);
    } catch (error) {
      console.error('Error posting listing:', error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-navy mb-2">تم إرسال الإعلان بنجاح</h2>
          <p className="text-text-light text-sm mb-6">سيتم مراجعة الإعلان من قبل الفريق قبل النشر</p>
          <div className="flex gap-3">
            <button
              onClick={() => setSubmitted(false)}
              className="flex-1 bg-bg hover:bg-gray-100 text-text font-bold py-2.5 rounded-xl transition-colors"
            >
              إضافة أخرى
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex-1 bg-orange hover:bg-orange-dark text-white font-bold py-2.5 rounded-xl transition-colors"
            >
              مشاهدة إعلاناتي
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-6 sm:py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">إضافة إعلان جديد</h1>
          <p className="text-gray-300 text-sm sm:text-base">اختر نوع الإعلان واملأ التفاصيل</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {listingTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setListingType(type.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                listingType === type.id
                  ? 'border-orange bg-orange/5 text-orange'
                  : 'border-border bg-white text-text hover:border-orange/30'
              }`}
            >
              <type.icon className="w-6 h-6" />
              <span className="text-xs font-bold">{type.name}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          {(listingType === 'vehicle' || listingType === 'spare-part') && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-1.5">عنوان الإعلان *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.title}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, title: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="مثال: شاحنة مرسيدس أكتروس 2020"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">السعر (جنيه) *</label>
                  <input
                    type="number"
                    required
                    value={vehicleForm.price}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, price: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="1000000"
                  />
                </div>
                {listingType === 'vehicle' && (
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">القسم</label>
                    <select
                      value={vehicleForm.category}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, category: e.target.value, subcategory: '' })}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    >
                      <option value="trucks">شاحنات</option>
                      <option value="equipment">معدات ثقيلة</option>
                    </select>
                  </div>
                )}
                {listingType === 'vehicle' && (
                  <div>
                    <label className="block text-sm font-bold text-text mb-1.5">النوع</label>
                    <select
                      value={vehicleForm.subcategory}
                      onChange={(e) => setVehicleForm({ ...vehicleForm, subcategory: e.target.value })}
                      className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    >
                      <option value="">اختر النوع</option>
                      {(vehicleForm.category === 'trucks' ? vehicleCategories : equipmentCategories).map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">المحافظة *</label>
                  <select
                    required
                    value={vehicleForm.governorate}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, governorate: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">الموقع التفصيلي</label>
                  <input
                    type="text"
                    value={vehicleForm.location}
                    onChange={(e) => setVehicleForm({ ...vehicleForm, location: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="مثال: القاهرة"
                  />
                </div>
                {listingType === 'vehicle' && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-text mb-1.5">سنة الصنع</label>
                      <input
                        type="number"
                        value={vehicleForm.year}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, year: e.target.value })}
                        className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                        placeholder="2020"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text mb-1.5">الحالة</label>
                      <select
                        value={vehicleForm.condition}
                        onChange={(e) => setVehicleForm({ ...vehicleForm, condition: e.target.value as 'new' | 'used' })}
                        className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                      >
                        <option value="used">مستعمل</option>
                        <option value="new">جديد</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">الوصف *</label>
                <textarea
                  required
                  value={vehicleForm.description}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, description: e.target.value })}
                  rows={4}
                  className="w-full p-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none resize-none"
                  placeholder="اكتب وصفاً تفصيلياً للمركبة..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">الصور</label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-orange/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="images"
                  />
                  <label htmlFor="images" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-text-light" />
                    <span className="text-sm text-text-light">اضغط لإضافة الصور</span>
                    <span className="text-xs text-text-light">PDF, PNG, JPG حتى 5 ميجا</span>
                  </label>
                </div>
                {vehicleForm.images.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {vehicleForm.images.map((img, i) => (
                      <img key={i} src={img} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {listingType === 'load' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">من *</label>
                  <select
                    required
                    value={loadForm.origin}
                    onChange={(e) => setLoadForm({ ...loadForm, origin: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">إلى *</label>
                  <select
                    required
                    value={loadForm.destination}
                    onChange={(e) => setLoadForm({ ...loadForm, destination: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.name}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">نوع الحمول *</label>
                  <select
                    required
                    value={loadForm.cargoType}
                    onChange={(e) => setLoadForm({ ...loadForm, cargoType: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  >
                    <option value="">اختر نوع الحمول</option>
                    {cargoTypes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">الوزن *</label>
                  <input
                    type="text"
                    required
                    value={loadForm.weight}
                    onChange={(e) => setLoadForm({ ...loadForm, weight: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="مثال: 30 طن"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">السعر (جنيه)</label>
                  <input
                    type="number"
                    value={loadForm.price}
                    onChange={(e) => setLoadForm({ ...loadForm, price: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">تاريخ النقل</label>
                  <input
                    type="date"
                    value={loadForm.date}
                    onChange={(e) => setLoadForm({ ...loadForm, date: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {listingType === 'job' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-1.5">عنوان الوظيفة *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="مثال: سائق شاحنة نقل ثقيل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">الشركة *</label>
                  <input
                    type="text"
                    required
                    value={jobForm.company}
                    onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="اسم الشركة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">نوع الوظيفة *</label>
                  <select
                    required
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  >
                    {jobTypes.map((j) => (
                      <option key={j.id} value={j.id}>{j.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">المحافظة *</label>
                  <select
                    required
                    value={jobForm.governorate}
                    onChange={(e) => setJobForm({ ...jobForm, governorate: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  >
                    <option value="">اختر المحافظة</option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">الموقع</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="مثال: القاهرة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">المرتب</label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                    placeholder="مثال: 8000 - 12000 جنيه"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">المتطلبات</label>
                <textarea
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  rows={3}
                  className="w-full p-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none resize-none"
                  placeholder="اكتب كل متطلب في سطر منفصل"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text mb-1.5">الخبرة *</label>
                <input
                  type="text"
                  required
                  value={jobForm.experience}
                  onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                  className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  placeholder="مثال: 3+ سنوات"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-orange hover:bg-orange-dark disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? 'جاري النشر...' : 'نشر الإعلان'}
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
