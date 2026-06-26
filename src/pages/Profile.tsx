// Profile.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut, Plus, Heart, Truck, Package, HardHat, Settings, Edit, Shield, Briefcase, Award } from 'lucide-react';
import { auth } from '../lib/auth';
import { getInitials } from '../lib/utils';
import type { User as UserType } from '../types';

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [activeTab, setActiveTab] = useState('listings');
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = auth.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFavorites(JSON.parse(localStorage.getItem('tareeq_favorites') || '[]'));
  }, [navigate]);

  const handleLogout = () => {
    auth.logout();
    navigate('/');
  };

  if (!user) return null;

  const userTypeLabels: Record<string, string> = {
    individual: 'سائق',
    company: 'شركة نقل',
    dealer: 'معرض سيارات',
    workshop: 'مركز صيانة',
    finance: 'شركة تمويل',
    admin: 'مدير النظام',
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'individual': return 'bg-blue-500';
      case 'company': return 'bg-purple-500';
      case 'dealer': return 'bg-emerald-500';
      case 'workshop': return 'bg-amber-500';
      case 'finance': return 'bg-indigo-500';
      case 'admin': return 'bg-red-500';
      default: return 'bg-orange';
    }
  };

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">الملف الشخصي</h1>
            <div className="flex gap-3">
              <Link
                to="/complete-profile"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors backdrop-blur"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">تعديل البيانات</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-100 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors backdrop-blur border border-red-500/30"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">خروج</span>
              </button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-2xl">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-orange flex items-center justify-center text-white text-3xl font-bold border-4 border-white/20 shadow-inner">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className={`absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 ${getBadgeColor(user.type)} text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg whitespace-nowrap border-2 border-navy`}>
                {userTypeLabels[user.type] || user.type}
              </div>
            </div>
            
            <div className="text-center sm:text-right flex-1 mt-4 sm:mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{user.name}</h2>
                {user.verified && (
                  <span className="inline-flex items-center justify-center bg-blue-500/20 text-blue-300 p-1.5 rounded-full" title="حساب موثق">
                    <Shield className="w-5 h-5" />
                  </span>
                )}
              </div>

              {user.businessName && (
                <p className="text-lg text-orange font-semibold mb-3 flex items-center justify-center sm:justify-start gap-2">
                  <Briefcase className="w-5 h-5" />
                  {user.businessName}
                </p>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mt-4 text-sm text-gray-200 bg-black/20 p-4 rounded-2xl">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="font-mono">{user.phone}</span>
                </div>
                {user.whatsapp && (
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-4 h-4 text-green-400 flex items-center justify-center font-bold">W</span>
                    <span className="font-mono">{user.whatsapp}</span>
                  </div>
                )}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user.governorate}{user.city ? ` - ${user.city}` : ''}</span>
                </div>
                
                {user.type === 'individual' && user.drivingType && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-blue-200">
                    <Award className="w-4 h-4" />
                    <span>{user.drivingType} ({user.experienceYears} سنوات خبرة)</span>
                  </div>
                )}
                
                {user.type === 'workshop' && user.specialization && (
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-amber-200">
                    <Settings className="w-4 h-4" />
                    <span>تخصص: {user.specialization}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Link
            to="/post-listing"
            className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-orange/10 rounded-2xl flex items-center justify-center">
              <Plus className="w-6 h-6 text-orange" />
            </div>
            <span className="text-sm font-bold text-text">إضافة إعلان</span>
          </Link>
          <Link
            to="/favorites"
            className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-sm font-bold text-text">المفضلات ({favorites.length})</span>
          </Link>
          <Link
            to="/vehicles"
            className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-navy/10 rounded-2xl flex items-center justify-center">
              <Truck className="w-6 h-6 text-navy" />
            </div>
            <span className="text-sm font-bold text-text">إعلاناتي</span>
          </Link>
          <Link 
            to="/complete-profile"
            className="flex flex-col items-center gap-3 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-text-light" />
            </div>
            <span className="text-sm font-bold text-text">الإعدادات</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-100 overflow-x-auto hide-scrollbar bg-gray-50/50">
            {[
              { id: 'listings', label: 'إعلاناتي', icon: Truck },
              { id: 'loads', label: 'حمولاتي', icon: Package },
              { id: 'jobs', label: 'وظائفي', icon: HardHat },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all flex-shrink-0 relative ${
                  activeTab === tab.id ? 'text-orange bg-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-orange' : 'text-gray-400'}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          
          <div className="p-8">
            {activeTab === 'listings' && (
              <div className="text-center py-12 max-w-sm mx-auto">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لم تقم بإضافة إعلانات بعد</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">ابدأ بإضافة أول إعلانك الآن للوصول إلى آلاف المهتمين في منصة طريق</p>
                <Link
                  to="/post-listing"
                  className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange/20 w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  إضافة إعلان جديد
                </Link>
              </div>
            )}
            {activeTab === 'loads' && (
              <div className="text-center py-12 max-w-sm mx-auto">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لم تقم بإضافة حمولات</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">أضف حمولتك ليتم التواصل مع أقرب الشاحنات المتاحة لنقلها بأسرع وقت</p>
                <Link
                  to="/post-listing?type=load"
                  className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange/20 w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  إضافة حمولة
                </Link>
              </div>
            )}
            {activeTab === 'jobs' && (
              <div className="text-center py-12 max-w-sm mx-auto">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <HardHat className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">لم تقم بإضافة وظائف</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">أضف وظائفك الشاغرة وابحث عن أفضل الكفاءات في مجال النقل والمعدات</p>
                <Link
                  to="/post-listing?type=job"
                  className="inline-flex items-center justify-center gap-2 bg-orange hover:bg-orange-dark text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange/20 w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  إضافة وظيفة
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}