import type { Category, Governorate, EmergencyService, MarketStat } from '../types';

export const mainCategories: Category[] = [
  { id: 'trucks', name: 'شاحنات', nameEn: 'Trucks', icon: 'Truck', count: 1240, color: '#F4700A' },
  { id: 'equipment', name: 'معدات ثقيلة', nameEn: 'Heavy Equipment', icon: 'Construction', count: 856, color: '#0D1B2A' },
  { id: 'loads', name: 'حمولات', nameEn: 'Loads', icon: 'Package', count: 342, color: '#10B981' },
  { id: 'jobs', name: 'وظائف', nameEn: 'Jobs', icon: 'HardHat', count: 128, color: '#3B82F6' },
  { id: 'finance', name: 'تمويل', nameEn: 'Finance', icon: 'Landmark', count: 45, color: '#8B5CF6' },
  { id: 'emergency', name: 'طوارئ', nameEn: 'Emergency', icon: 'Siren', count: 89, color: '#EF4444' },
];

export const vehicleCategories = [
  { id: 'trucks', name: 'شاحنات', icon: 'Truck' },
  { id: 'tractor-heads', name: 'رؤوس جرارات', icon: 'GitPullRequest' },
  { id: 'trailers', name: 'نصف مقطورات', icon: 'Container' },
  { id: 'tankers', name: 'تانكرات', icon: 'Droplet' },
  { id: 'refrigerated', name: 'برادات', icon: 'Snowflake' },
  { id: 'dump-trucks', name: 'قلابات', icon: 'Mountain' },
  { id: 'flatbeds', name: 'سطيحات', icon: 'LayoutGrid' },
];

export const equipmentCategories = [
  { id: 'excavators', name: 'حفارات', icon: 'Pickaxe' },
  { id: 'loaders', name: 'لوادر', icon: 'Shovel' },
  { id: 'cranes', name: 'كرينات', icon: 'ArrowUpFromLine' },
  { id: 'bulldozers', name: 'بلدوزرات', icon: 'TractionControl' },
  { id: 'forklifts', name: 'رافعات شوكية', icon: 'ArrowUpDown' },
];

export const jobTypes = [
  { id: 'driver', name: 'سائقين', icon: 'SteeringWheel' },
  { id: 'mechanic', name: 'ميكانيكي', icon: 'Wrench' },
  { id: 'technician', name: 'فني', icon: 'Cpu' },
  { id: 'logistics', name: 'لوجستيات', icon: 'Route' },
  { id: 'warehouse', name: 'مستودعات', icon: 'Warehouse' },
  { id: 'sales', name: 'مبيعات', icon: 'Handshake' },
];

export const governorates: Governorate[] = [
  { id: 'cairo', name: 'القاهرة', nameEn: 'Cairo', listingsCount: 1450, loadsCount: 320 },
  { id: 'alexandria', name: 'الإسكندرية', nameEn: 'Alexandria', listingsCount: 890, loadsCount: 210 },
  { id: 'giza', name: 'الجيزة', nameEn: 'Giza', listingsCount: 760, loadsCount: 180 },
  { id: 'qalyubia', name: 'القليوبية', nameEn: 'Qalyubia', listingsCount: 540, loadsCount: 120 },
  { id: 'sharkia', name: 'الشرقية', nameEn: 'Sharkia', listingsCount: 480, loadsCount: 95 },
  { id: 'dakahlia', name: 'الدقهلية', nameEn: 'Dakahlia', listingsCount: 420, loadsCount: 88 },
  { id: 'beheira', name: 'البحيرة', nameEn: 'Beheira', listingsCount: 380, loadsCount: 76 },
  { id: 'minya', name: 'المنيا', nameEn: 'Minya', listingsCount: 320, loadsCount: 64 },
  { id: 'sohag', name: 'سوهاج', nameEn: 'Sohag', listingsCount: 280, loadsCount: 52 },
  { id: 'asyut', name: 'أسيوط', nameEn: 'Asyut', listingsCount: 250, loadsCount: 48 },
  { id: 'gharbia', name: 'الغربية', nameEn: 'Gharbia', listingsCount: 310, loadsCount: 58 },
  { id: 'kafr-el-sheikh', name: 'كفر الشيخ', nameEn: 'Kafr El-Sheikh', listingsCount: 190, loadsCount: 36 },
  { id: 'fayoum', name: 'الفيوم', nameEn: 'Fayoum', listingsCount: 170, loadsCount: 30 },
  { id: 'beni-suef', name: 'بني سويف', nameEn: 'Beni Suef', listingsCount: 160, loadsCount: 28 },
  { id: 'qena', name: 'قنا', nameEn: 'Qena', listingsCount: 150, loadsCount: 26 },
  { id: 'luxor', name: 'الأقصر', nameEn: 'Luxor', listingsCount: 120, loadsCount: 20 },
  { id: 'aswan', name: 'أسوان', nameEn: 'Aswan', listingsCount: 110, loadsCount: 18 },
  { id: 'port-said', name: 'بورسعيد', nameEn: 'Port Said', listingsCount: 200, loadsCount: 70 },
  { id: 'suez', name: 'السويس', nameEn: 'Suez', listingsCount: 220, loadsCount: 85 },
  { id: 'ismailia', name: 'الإسماعيلية', nameEn: 'Ismailia', listingsCount: 180, loadsCount: 55 },
  { id: 'damietta', name: 'دمياط', nameEn: 'Damietta', listingsCount: 160, loadsCount: 45 },
  { id: 'matruh', name: 'مرسى مطروح', nameEn: 'Matruh', listingsCount: 90, loadsCount: 22 },
  { id: 'north-sinai', name: 'شمال سيناء', nameEn: 'North Sinai', listingsCount: 70, loadsCount: 15 },
  { id: 'south-sinai', name: 'جنوب سيناء', nameEn: 'South Sinai', listingsCount: 60, loadsCount: 12 },
  { id: 'red-sea', name: 'البحر الأحمر', nameEn: 'Red Sea', listingsCount: 85, loadsCount: 25 },
  { id: 'new-valley', name: 'الوادي الجديد', nameEn: 'New Valley', listingsCount: 50, loadsCount: 10 },
];

export const emergencyServices: EmergencyService[] = [
  { id: 'mechanic', name: 'ميكانيكي متنقل', icon: 'Wrench', description: 'إصلاح أعطال المحرك والهيكل في الموقع', responseTime: '30 دقيقة', phone: '01001234567' },
  { id: 'electrician', name: 'كهربائي متنقل', icon: 'Zap', description: 'صيانة كهربائية شاملة للشاحنات والمعدات', responseTime: '25 دقيقة', phone: '01001234568' },
  { id: 'recovery', name: 'ونش إنقاذ', icon: 'Truck', description: 'سحب ونقل الشاحنات المعطلة والمعدات', responseTime: '20 دقيقة', phone: '01001234569' },
  { id: 'tire', name: 'خدمة إطارات', icon: 'CircleDot', description: 'تغيير وإصلاح الإطارات على الطريق', responseTime: '15 دقيقة', phone: '01001234570' },
];

export const marketStats: MarketStat[] = [
  { label: 'متوسط سعر الشاحنات', value: '1,250,000 جنيه', change: '+5.2%', trend: 'up' },
  { label: 'متوسط سعر المعدات', value: '2,800,000 جنيه', change: '+3.1%', trend: 'up' },
  { label: 'الحمولات النشطة', value: '342 حمولة', change: '+12%', trend: 'up' },
  { label: 'أكثر المركبات طلباً', value: 'مرسيدس أكتروس', trend: 'stable' },
];

export const vehicleBrands = [
  'مرسيدس', 'فولفو', 'مان', 'سكانيا', 'إيفكو', 'داف', 'رينو', 'فورد', 'شيفروليه', 'تويوتا',
  'هينو', 'ميتسوبيشي', 'هيونداي', 'نيسان', 'شاكمان', 'فاو', 'جاك', 'دونغفنغ', 'كاماز', 'ماز'
];

export const popularRoutes = [
  { origin: 'القاهرة', destination: 'الإسكندرية' },
  { origin: 'الإسكندرية', destination: 'السادس من أكتوبر' },
  { origin: 'بورسعيد', destination: 'القاهرة' },
  { origin: 'السويس', destination: 'الإسماعيلية' },
  { origin: 'الجيزة', destination: 'المنيا' },
];

export const cargoTypes = [
  'حديد', 'أسمنت', 'رمل', 'زلط', 'خضروات', 'فاكهة', 'أثاث', 'أجهزة كهربائية', 'بضائع عامة',
  'مواد بناء', 'أخشاب', 'بلاستيك', 'منتجات غذائية', 'مواد كيميائية', 'وقود'
];

export const sampleTags = ['مميز', 'تم التحقق', 'سعر قابل للتفاوض', 'جديد', 'بحالة ممتازة', 'ضمان متاح'];
