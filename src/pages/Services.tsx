import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Truck, FileText, Shield, Calendar, Gauge, Search, ArrowLeft } from 'lucide-react';

const services = [
  {
    id: 'maintenance',
    name: 'صيانة الشاحنات',
    icon: Wrench,
    description: 'خدمات صيانة شاملة للشاحنات الثقيلة في مصر',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
    features: ['صيانة دورية', 'إصلاح المحركات', 'فحص شامل'],
  },
  {
    id: 'spare-parts',
    name: 'القطع الغيار',
    icon: Gauge,
    description: 'قطع غيار أصلية للشاحنات والمعدات الثقيلة',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
    features: ['قطع أصلية', 'تركيب سريع', 'ضمان'],
  },
  {
    id: 'inspection',
    name: 'فحص قبل الشراء',
    icon: Search,
    description: 'فحص ميكانيكي شامل قبل شراء أي شاحنة أو معدة',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
    features: ['فحص ميكانيكي', 'تقرير مفصل', 'تقييم السعر'],
  },
  {
    id: 'insurance',
    name: 'تأمين الشاحنات',
    icon: Shield,
    description: 'تأمين شامل ضد الحوادث والأعطال للشاحنات الثقيلة',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
    features: ['تأمين ضد الحوادث', 'تأمين البضائع', 'تسويق مجاني'],
  },
  {
    id: 'logistics',
    name: 'حلول لوجستية',
    icon: Truck,
    description: 'حلول لوجستية متكاملة لشركات النقل',
    image: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600&q=80',
    features: ['تخطيط المسارات', 'إدارة المخزن', 'تتبع الشحنات'],
  },
  {
    id: 'documents',
    name: 'تخلصيات سيارات',
    icon: FileText,
    description: 'تقديم جميع الخدمات الحكومية للشاحنات والمعدات',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    features: ['تجديد رخصة', 'نقل الملكية', 'تسجيل شاحنة'],
  },
];

export default function Services() {
  return (
    <div className="min-h-screen bg-bg pb-20 sm:pb-8">
      <div className="bg-navy py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">خدمات النقل الثقيل</h1>
          <p className="text-gray-300 text-sm sm:text-base">كل ما تحتاجه لشاحناتك ومعداتك من خدمات في مكان واحد</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all card-hover"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
                <div className="absolute bottom-3 right-3 left-3 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-lg">{service.name}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-text-light text-sm mb-3 line-clamp-2">{service.description}</p>
                <ul className="space-y-1.5 mb-4">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-text">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="#"
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-bg hover:bg-orange hover:text-white text-text font-bold rounded-xl transition-colors group-hover:bg-orange group-hover:text-white"
                >
                  <span>طلب الخدمة</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 bg-gradient-to-r from-orange to-orange-dark rounded-2xl p-6 sm:p-8 text-white text-center">
          <Calendar className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">هل تريد أن تضيف خدمتك إلى طريق؟</h2>
          <p className="text-white/90 text-sm mb-4 max-w-lg mx-auto">انضم إلينا كشريك موثق ووصل عملائك إلى آلاف العملاء في مجال النقل الثقيل</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 bg-white text-orange px-6 py-2.5 rounded-xl font-bold hover:bg-bg transition-colors"
          >
            سجّل كمقدّم خدمات
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
