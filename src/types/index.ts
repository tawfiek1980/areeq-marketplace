// =====================
// USER
// =====================
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;

  type?: "user" | "admin" | "individual" | "dealer" | "company" | "workshop" | "finance";

  role?: string;
  governorate?: string;
  avatar?: string;
  whatsapp?: string;
  city?: string;
  currentLocation?: string;

  drivingType?: string;
  experienceYears?: number;

  businessName?: string;
  specialization?: string;

  verified?: boolean;
  createdAt?: string;
}

// =====================
// LISTING
// =====================
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  verified?: boolean;
  location?: string;
  governorate?: string;

  userName: string;
  userPhone: string;
  userType?: string;

  status?: string;
  category?: string;
  year?: string | number;
  condition?: string;
  brand?: string;
  model?: string;

  createdAt: string | Date;
}

// =====================
// LOAD
// =====================
export interface Load {
  id: string;
  title: string;
  origin: string;
  destination: string;
  cargoType?: string;
  weight?: string;
  date?: string;
  price: number;

  userName?: string;
  userPhone: string;
}

// =====================
// JOB
// =====================
export interface Job {
  id: string;
  title: string;
  description?: string;
  company?: string;          // تمت الإضافة لحل خطأ JobCard و Admin
  requirements?: string[];   // تمت الإضافة لحل خطأ PostListing

  userId: string;
  userName?: string;
  userPhone?: string;

  type: string;
  location?: string;
  experience?: string;
  salary?: string;

  createdAt?: string;
}

// =====================
// FINANCE
// =====================
export interface FinanceRequest {
  id: string;
  userId?: string;

  name?: string;             // تمت الإضافة لحل خطأ Finance و Admin
  phone?: string;            // تمت الإضافة لحل خطأ Finance و Admin
  governorate?: string;      // تمت الإضافة
  vehicleType?: string;      // تمت الإضافة لحل خطأ Finance و Admin
  vehiclePrice?: number;     // تمت الإضافة لحل خطأ Finance و Admin

  amount?: number;
  duration?: number;

  downPayment?: number;
  monthlyIncome?: number;

  status?: "pending" | "approved" | "rejected";

  createdAt?: string;
}

// =====================
// CATEGORY
// =====================
export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  icon: string;
  color?: string;
  count: number;
}

// =====================
// OTHERS
// =====================
export interface EmergencyService {
  id: string;
  name: string;
  icon: string;
  description?: string;
  responseTime?: string;
  phone: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  platform?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
  displayOrder: number;
}

export interface ContactNumber {
  id: string;
  phone: string;
  title?: string;
  department?: string;
  description?: string;
  isActive?: boolean;
  displayOrder: number;
}

export interface MarketStat {
  label: string;
  value: string;
  title?: string;
  trend?: "up" | "down" | "stable";
  change?: string;
}

export interface SiteSettings {
  siteName: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface Governorate {
  id: string;
  name: string;
  nameEn?: string;
  listingsCount?: number;    // تمت الإضافة لحل خطأ ملف data.ts
  loadsCount?: number;       // تمت الإضافة لحل خطأ ملف data.ts
}