// index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  type:
    | "individual"
    | "company"
    | "dealer"
    | "workshop"
    | "finance"
    | "admin";
  avatar?: string;
  governorate: string;
  city?: string;
  currentLocation?: string;
  drivingType?: string;
  experienceYears?: number;
  businessName?: string;
  specialization?: string;
  verified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  location: string;
  governorate: string;
  images: string[];
  userId: string;
  userName: string;
  userPhone: string;
  userType: string;
  verified: boolean;
  status: "active" | "pending" | "rejected" | "sold";
  featured: boolean;
  year?: number;
  brand?: string;
  model?: string;
  condition?: "new" | "used";
  createdAt: string;
}

export interface Load {
  id: string;
  origin: string;
  destination: string;
  cargoType: string;
  weight: string;
  price: number;
  distance?: string;
  date: string;
  userId: string;
  userName: string;
  userPhone: string;
  status: "available" | "in_transit" | "delivered";
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  type:
    | "driver"
    | "mechanic"
    | "technician"
    | "logistics"
    | "warehouse"
    | "sales";
  location: string;
  governorate: string;
  salary?: string;
  description?: string;
  requirements: string[];
  experience: string;
  userId: string;
  userName?: string;
  userPhone?: string;
  status: "active" | "filled" | "closed";
  featured: boolean;
  createdAt: string;
}

export interface FinanceRequest {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  vehicleType: string;
  vehiclePrice: number;
  downPayment: number;
  monthlyIncome?: number;
  status: "new" | "reviewing" | "approved" | "rejected";
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  count: number;
  color: string;
}

export interface Governorate {
  id: string;
  name: string;
  nameEn: string;
  listingsCount: number;
  loadsCount: number;
}

export interface MarketStat {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "stable";
}

export interface EmergencyService {
  id: string;
  name: string;
  icon: string;
  description: string;
  responseTime: string;
  phone: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  listingId?: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  name: string;
  url: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface ContactNumber {
  id: string;
  title: string;
  phone: string;
  department?: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}