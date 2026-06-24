import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle, Calendar, User, ArrowRight, Share2, Heart, AlertCircle } from 'lucide-react';
import { listingsApi } from '../lib/api';
import { formatPrice, getWhatsAppLink, getPhoneLink } from '../lib/utils';
import type { Listing } from '../types';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      try {
        const response = await listingsApi.getById(id);
        setListing(response.data.data);
      } catch (error) {
        console.error('Error fetching listing:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-text-light mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text mb-2">الإعلان غير موجود</h2>
          <button
            onClick={() => navigate('/vehicles')}
            className="mt-4 bg-orange hover:bg-orange-dark text-white px-6 py-2.5 rounded-xl font-bold"
          >
            عودة إلى السوق
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = imageError || !listing.images?.length
    ? `https://placehold.co/800x600/0D1B2A/F4700A?text=${encodeURIComponent(listing.title.slice(0, 30))}`
    : listing.images[currentImage];

  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
              <img
                src={imageUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {listing.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => { setCurrentImage(index); setImageError(false); }}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 ${
                      currentImage === index ? 'border-orange' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Details */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="bg-orange/10 text-orange text-xs font-bold px-3 py-1 rounded-lg">
                  {listing.category === 'trucks' ? 'شاحنات' : listing.category === 'equipment' ? 'معدات' : listing.category}
                </span>
                {listing.year && (
                  <span className="bg-bg text-text-light text-xs font-bold px-3 py-1 rounded-lg">موديل {listing.year}</span>
                )}
                {listing.condition === 'new' && (
                  <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-lg">جديد</span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-navy mb-3">{listing.title}</h1>
              <p className="text-2xl sm:text-3xl font-extrabold text-orange mb-4">{formatPrice(listing.price)}</p>
              <div className="flex items-center gap-2 text-text-light text-sm mb-6">
                <MapPin className="w-4 h-4" />
                {listing.location}
              </div>
              
              <h3 className="font-bold text-navy mb-2">الوصف</h3>
              <p className="text-text-light text-sm leading-relaxed">{listing.description}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                {listing.brand && (
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-text-light">الماركة</p>
                    <p className="font-bold text-sm text-text">{listing.brand}</p>
                  </div>
                )}
                {listing.model && (
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-text-light">الموديل</p>
                    <p className="font-bold text-sm text-text">{listing.model}</p>
                  </div>
                )}
                {listing.year && (
                  <div className="bg-bg rounded-xl p-3">
                    <p className="text-xs text-text-light">سنة الصنع</p>
                    <p className="font-bold text-sm text-text">{listing.year}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Seller Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-navy mb-4">معلومات البائع</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold">
                  {listing.userName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-text">{listing.userName}</p>
                  <p className="text-xs text-text-light">{listing.verified ? 'حساب مــحقق' : 'بائع'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <a
                  href={getWhatsAppLink(listing.userPhone, `السلام عليكم، أهتم بإعلانكم على طريق: ${listing.title}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  التواصل عبر الواتساب
                </a>
                <a
                  href={getPhoneLink(listing.userPhone)}
                  className="flex items-center justify-center gap-2 w-full h-11 bg-navy hover:bg-navy-light text-white font-bold rounded-xl transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  اتصل هاتفياً
                </a>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-bold text-yellow-800">نصائح السلامة</h3>
              </div>
              <ul className="space-y-2 text-xs text-yellow-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-yellow-600 mt-1.5" />
                  قابل البائع في مكان آمن
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-yellow-600 mt-1.5" />
                  تحقق من المركبة قبل الدفع
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-yellow-600 mt-1.5" />
                  لا ترسل أي دفعات مسبقة
                </li>
              </ul>
            </div>

            {/* Listing Info */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-navy mb-4">تفاصيل الإعلان</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-light flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    تاريخ النشر
                  </span>
                  <span className="font-bold text-text">{new Date(listing.createdAt).toLocaleDateString('ar-EG')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-light flex items-center gap-1.5">
                    <User className="w-4 h-4" />
                    نوع الحساب
                  </span>
                  <span className="font-bold text-text">{listing.userType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-light flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    الحالة
                  </span>
                  <span className="font-bold text-green-500">فعال</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
