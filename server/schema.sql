-- TAREEQ Database Schema
-- Supports PostgreSQL and SQLite

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'individual',
  governorate TEXT NOT NULL,
  avatar TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  location TEXT NOT NULL,
  governorate TEXT NOT NULL,
  images TEXT DEFAULT '[]',
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  user_type TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'pending',
  featured BOOLEAN DEFAULT FALSE,
  year INTEGER,
  brand TEXT,
  model TEXT,
  condition TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS loads (
  id TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  cargo_type TEXT NOT NULL,
  weight TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0,
  distance TEXT,
  load_date TEXT,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'available',
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  governorate TEXT NOT NULL,
  salary TEXT,
  description TEXT,
  requirements TEXT DEFAULT '[]',
  experience TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT,
  user_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS finance_requests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  vehicle_price REAL NOT NULL,
  down_payment REAL DEFAULT 0,
  monthly_income REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  sender_id TEXT NOT NULL,
  receiver_id TEXT NOT NULL,
  listing_id TEXT,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (listing_id) REFERENCES listings(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  icon TEXT,
  item_count INTEGER DEFAULT 0,
  color TEXT,
  type TEXT NOT NULL DEFAULT 'vehicle'
);

CREATE TABLE IF NOT EXISTS governorates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT,
  listings_count INTEGER DEFAULT 0,
  loads_count INTEGER DEFAULT 0
);

-- New tables for social media and contact management
CREATE TABLE IF NOT EXISTS social_links (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_numbers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  phone TEXT NOT NULL,
  department TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs(type);
CREATE INDEX IF NOT EXISTS idx_finance_status ON finance_requests(status);
CREATE INDEX IF NOT EXISTS idx_social_active ON social_links(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_active ON contact_numbers(is_active);
