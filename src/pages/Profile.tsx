import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, MapPin, Phone, Mail, LogOut, Plus, Heart, Truck, Package, HardHat, Settings } from 'lucide-react';
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
    individual: 'فرد',
    company: 'شركة',
    dealer: 'تاجر',
    workshop: 'ورشة',
    finance: 'شركة تمويل',
    admin: 'مدير',
  };

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">الملف الشخصي</h1>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange flex items-center justify-center text-white text-2xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(user.name)
              )}
            </div>
            <div className="text-center sm:text-right flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-orange font-semibold">{userTypeLabels[user.type] || user.type}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-300">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {user.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.governorate}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Link
            to="/post-listing"
            className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-orange/10 rounded-xl flex items-center justify-center">
              <Plus className="w-5 h-5 text-orange" />
            </div>
            <span className="text-xs font-bold text-text">إضافة إعلان</span>
          </Link>
          <Link
            to="/favorites"
            className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-xs font-bold text-text">المفضلات ({favorites.length})</span>
          </Link>
          <Link
            to="/vehicles"
            className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-navy/10 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-navy" />
            </div>
            <span className="text-xs font-bold text-text">إعلاناتي</span>
          </Link>
          <button className="flex flex-col items-center gap-2 bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-text-light" />
            </div>
            <span className="text-xs font-bold text-text">الإعدادات</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex border-b border-border overflow-x-auto hide-scrollbar">
            {[
              { id: 'listings', label: 'إعلاناتي', icon: Truck },
              { id: 'loads', label: 'حمولاتي', icon: Package },
              { id: 'jobs', label: 'وظائفي', icon: HardHat },
              { id: 'settings', label: 'الإعدادات', icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors flex-shrink-0 ${
                  activeTab === tab.id ? 'text-orange border-b-2 border-orange bg-orange/5' : 'text-text-light hover:text-text'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="p-6">
            {activeTab === 'listings' && (
              <div className="text-center py-8">
                <Truck className="w-16 h-16 text-text-light mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text mb-2">لم تقم بإضافة إعلانات بعد</h3>
                <p className="text-text-light text-sm mb-4">ابدأ بإضافة أول إعلانك الآن</p>
                <Link
                  to="/post-listing"
                  className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إضافة إعلان
                </Link>
              </div>
            )}
            {activeTab === 'loads' && (
              <div className="text-center py-8">
                <Package className="w-16 h-16 text-text-light mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text mb-2">لم تقم بإضافة حمولات</h3>
                <p className="text-text-light text-sm mb-4">أضف حمولتك ليتم التواصل مع أقرب الشاحنات</p>
                <Link
                  to="/post-listing?type=load"
                  className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إضافة حمولة
                </Link>
              </div>
            )}
            {activeTab === 'jobs' && (
              <div className="text-center py-8">
                <HardHat className="w-16 h-16 text-text-light mx-auto mb-4" />
                <h3 className="text-lg font-bold text-text mb-2">لم تقم بإضافة وظائف</h3>
                <p className="text-text-light text-sm mb-4">أضف وظائفك وابحث عن أفضل الكفاءات</p>
                <Link
                  to="/post-listing?type=job"
                  className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  إضافة وظيفة
                </Link>
              </div>
            )}
            {activeTab === 'settings' && (
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">الاسم</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">البريد الإلكتروني</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1.5">رقم الهاتف</label>
                  <input
                    type="tel"
                    defaultValue={user.phone}
                    className="w-full h-11 px-4 bg-bg rounded-xl border border-border focus:border-orange focus:outline-none"
                  />
                </div>
                <button className="w-full h-11 bg-orange hover:bg-orange-dark text-white font-bold rounded-xl transition-colors">
                  حفظ التعديلات
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
