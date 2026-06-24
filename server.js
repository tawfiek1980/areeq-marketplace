import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './server/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'tareeq-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Helper: strip sensitive fields
function sanitizeUser(user) {
  const { password, ...rest } = user;
  return rest;
}

// Helper: camelCase rows if needed
function formatRows(rows) {
  if (db.isSQLite()) {
    return rows.map(row => db.camelCaseRow(row));
  }
  return rows;
}

function formatRow(row) {
  if (db.isSQLite()) {
    return db.camelCaseRow(row);
  }
  return row;
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'يجب تسجيل الدخول' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'التوكن غير صالح' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.type !== 'admin') {
    return res.status(403).json({ success: false, message: 'غير مصرح به' });
  }
  next();
}

// ===== Database Operations =====

// Users
async function findUserByEmail(email) {
  if (db.isMemory()) {
    return db.getMemoryDB().users.find(u => u.email === email) || null;
  }
  const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  return formatRow(row);
}

async function findUserById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().users.find(u => u.id === id) || null;
  }
  const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
  return formatRow(row);
}

async function createUser(userData) {
  const now = db.now();
  const id = 'u-' + db.generateId();
  if (db.isMemory()) {
    const newUser = { id, ...userData, createdAt: now };
    db.getMemoryDB().users.push(newUser);
    return newUser;
  }
  await db.run(
    `INSERT INTO users (id, name, email, phone, password, type, governorate, avatar, verified, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, userData.name, userData.email, userData.phone, userData.password, userData.type, userData.governorate, userData.avatar || null, userData.verified || false, now]
  );
  return findUserById(id);
}

async function getAllUsers() {
  if (db.isMemory()) {
    return db.getMemoryDB().users;
  }
  const rows = await db.all('SELECT * FROM users ORDER BY created_at DESC');
  return formatRows(rows);
}

async function updateUser(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().users.findIndex(u => u.id === id);
    if (index > -1) {
      db.getMemoryDB().users[index] = { ...db.getMemoryDB().users[index], ...data };
      return db.getMemoryDB().users[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'createdAt') continue;
    fields.push(`${key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)} = ?`);
    values.push(value);
  }
  values.push(id);
  await db.run(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findUserById(id);
}

// Listings
function listingToRow(listing) {
  return {
    ...listing,
    images: JSON.stringify(listing.images || []),
    verified: listing.verified ? 1 : 0,
    featured: listing.featured ? 1 : 0,
  };
}

function rowToListing(row) {
  if (!row) return null;
  return {
    ...formatRow(row),
    images: row.images ? JSON.parse(row.images) : [],
    verified: !!row.verified,
    featured: !!row.featured,
  };
}

async function createListing(listingData) {
  const now = db.now();
  const id = 'l-' + db.generateId();
  if (db.isMemory()) {
    const newListing = { id, ...listingData, createdAt: now };
    db.getMemoryDB().listings.unshift(newListing);
    return newListing;
  }
  const row = listingToRow({ ...listingData, id, created_at: now });
  await db.run(
    `INSERT INTO listings (id, title, description, price, category, subcategory, location, governorate, images, user_id, user_name, user_phone, user_type, verified, status, featured, year, brand, model, condition, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [row.id, row.title, row.description, row.price, row.category, row.subcategory || null, row.location, row.governorate, row.images, row.userId, row.userName, row.userPhone, row.userType, row.verified, row.status, row.featured, row.year || null, row.brand || null, row.model || null, row.condition || null, row.created_at]
  );
  return getListingById(id);
}

async function getListings(filters = {}) {
  if (db.isMemory()) {
    let listings = [...db.getMemoryDB().listings];
    if (filters.category) listings = listings.filter(l => l.category === filters.category);
    if (filters.subcategory) listings = listings.filter(l => l.subcategory === filters.subcategory);
    if (filters.governorate) listings = listings.filter(l => l.governorate === filters.governorate);
    if (filters.status) listings = listings.filter(l => l.status === filters.status);
    if (filters.featured) listings = listings.filter(l => l.featured);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      listings = listings.filter(l => l.title.toLowerCase().includes(s) || l.description.toLowerCase().includes(s));
    }
    if (filters.minPrice) listings = listings.filter(l => l.price >= Number(filters.minPrice));
    if (filters.maxPrice) listings = listings.filter(l => l.price <= Number(filters.maxPrice));
    return listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  let sql = 'SELECT * FROM listings WHERE 1=1';
  const params = [];
  if (filters.category) { sql += ' AND category = ?'; params.push(filters.category); }
  if (filters.subcategory) { sql += ' AND subcategory = ?'; params.push(filters.subcategory); }
  if (filters.governorate) { sql += ' AND governorate = ?'; params.push(filters.governorate); }
  if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }
  if (filters.featured) { sql += ' AND featured = 1'; }
  if (filters.search) { sql += ' AND (LOWER(title) LIKE ? OR LOWER(description) LIKE ? OR LOWER(location) LIKE ?)'; params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`); }
  if (filters.minPrice) { sql += ' AND price >= ?'; params.push(Number(filters.minPrice)); }
  if (filters.maxPrice) { sql += ' AND price <= ?'; params.push(Number(filters.maxPrice)); }
  sql += ' ORDER BY created_at DESC';
  const rows = await db.all(sql, params);
  return rows.map(rowToListing);
}

async function getListingById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().listings.find(l => l.id === id) || null;
  }
  const row = await db.get('SELECT * FROM listings WHERE id = ?', [id]);
  return rowToListing(row);
}

async function updateListing(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().listings.findIndex(l => l.id === id);
    if (index > -1) {
      db.getMemoryDB().listings[index] = { ...db.getMemoryDB().listings[index], ...data };
      return db.getMemoryDB().listings[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    let dbKey = key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`);
    let dbValue = value;
    if (key === 'images') dbValue = JSON.stringify(value || []);
    if (key === 'verified' || key === 'featured') dbValue = value ? 1 : 0;
    fields.push(`${dbKey} = ?`);
    values.push(dbValue);
  }
  values.push(id);
  await db.run(`UPDATE listings SET ${fields.join(', ')} WHERE id = ?`, values);
  return getListingById(id);
}

async function deleteListing(id) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().listings.findIndex(l => l.id === id);
    if (index > -1) db.getMemoryDB().listings.splice(index, 1);
    return;
  }
  await db.run('DELETE FROM listings WHERE id = ?', [id]);
}

// Loads
async function createLoad(loadData) {
  const now = db.now();
  const id = 'ld-' + db.generateId();
  if (db.isMemory()) {
    const newLoad = { id, ...loadData, createdAt: now };
    db.getMemoryDB().loads.unshift(newLoad);
    return newLoad;
  }
  await db.run(
    `INSERT INTO loads (id, origin, destination, cargo_type, weight, price, distance, load_date, user_id, user_name, user_phone, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, loadData.origin, loadData.destination, loadData.cargoType, loadData.weight, loadData.price || 0, loadData.distance || null, loadData.date || null, loadData.userId, loadData.userName, loadData.userPhone, loadData.status || 'available', now]
  );
  return getLoadById(id);
}

async function getLoads(filters = {}) {
  if (db.isMemory()) {
    let loads = [...db.getMemoryDB().loads];
    if (filters.origin) loads = loads.filter(l => l.origin === filters.origin);
    if (filters.destination) loads = loads.filter(l => l.destination === filters.destination);
    if (filters.status) loads = loads.filter(l => l.status === filters.status);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      loads = loads.filter(l => l.cargoType.toLowerCase().includes(s) || l.origin.toLowerCase().includes(s) || l.destination.toLowerCase().includes(s));
    }
    return loads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  let sql = 'SELECT * FROM loads WHERE 1=1';
  const params = [];
  if (filters.origin) { sql += ' AND origin = ?'; params.push(filters.origin); }
  if (filters.destination) { sql += ' AND destination = ?'; params.push(filters.destination); }
  if (filters.status) { sql += ' AND status = ?'; params.push(filters.status); }
  if (filters.search) { sql += ' AND (LOWER(cargo_type) LIKE ? OR LOWER(origin) LIKE ? OR LOWER(destination) LIKE ?)'; params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`); }
  sql += ' ORDER BY created_at DESC';
  const rows = await db.all(sql, params);
  return formatRows(rows).map(row => ({ ...row, cargoType: row.cargoType || row.cargo_type }));
}

async function getLoadById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().loads.find(l => l.id === id) || null;
  }
  const row = await db.get('SELECT * FROM loads WHERE id = ?', [id]);
  return formatRow(row);
}

async function updateLoad(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().loads.findIndex(l => l.id === id);
    if (index > -1) {
      db.getMemoryDB().loads[index] = { ...db.getMemoryDB().loads[index], ...data };
      return db.getMemoryDB().loads[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    fields.push(`${key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)} = ?`);
    values.push(value);
  }
  values.push(id);
  await db.run(`UPDATE loads SET ${fields.join(', ')} WHERE id = ?`, values);
  return getLoadById(id);
}

async function deleteLoad(id) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().loads.findIndex(l => l.id === id);
    if (index > -1) db.getMemoryDB().loads.splice(index, 1);
    return;
  }
  await db.run('DELETE FROM loads WHERE id = ?', [id]);
}

// Jobs
async function createJob(jobData) {
  const now = db.now();
  const id = 'j-' + db.generateId();
  if (db.isMemory()) {
    const newJob = { id, ...jobData, createdAt: now };
    db.getMemoryDB().jobs.unshift(newJob);
    return newJob;
  }
  await db.run(
    `INSERT INTO jobs (id, title, company, type, location, governorate, salary, description, requirements, experience, user_id, user_name, user_phone, status, featured, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, jobData.title, jobData.company, jobData.type, jobData.location, jobData.governorate, jobData.salary || null, jobData.description || null, JSON.stringify(jobData.requirements || []), jobData.experience, jobData.userId, jobData.userName || null, jobData.userPhone || null, jobData.status || 'active', jobData.featured ? 1 : 0, now]
  );
  return getJobById(id);
}

async function getJobs(filters = {}) {
  if (db.isMemory()) {
    let jobs = [...db.getMemoryDB().jobs];
    if (filters.type) jobs = jobs.filter(j => j.type === filters.type);
    if (filters.governorate) jobs = jobs.filter(j => j.governorate === filters.governorate);
    if (filters.featured) jobs = jobs.filter(j => j.featured);
    if (filters.search) {
      const s = filters.search.toLowerCase();
      jobs = jobs.filter(j => j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s));
    }
    return jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  let sql = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];
  if (filters.type) { sql += ' AND type = ?'; params.push(filters.type); }
  if (filters.governorate) { sql += ' AND governorate = ?'; params.push(filters.governorate); }
  if (filters.featured) { sql += ' AND featured = 1'; }
  if (filters.search) { sql += ' AND (LOWER(title) LIKE ? OR LOWER(company) LIKE ? OR LOWER(location) LIKE ?)'; params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`); }
  sql += ' ORDER BY created_at DESC';
  const rows = await db.all(sql, params);
  return formatRows(rows).map(row => ({ ...row, requirements: JSON.parse(row.requirements || '[]') }));
}

async function getJobById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().jobs.find(j => j.id === id) || null;
  }
  const row = await db.get('SELECT * FROM jobs WHERE id = ?', [id]);
  if (!row) return null;
  const formatted = formatRow(row);
  return { ...formatted, requirements: JSON.parse(formatted.requirements || '[]') };
}

async function updateJob(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().jobs.findIndex(j => j.id === id);
    if (index > -1) {
      db.getMemoryDB().jobs[index] = { ...db.getMemoryDB().jobs[index], ...data };
      return db.getMemoryDB().jobs[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    let dbValue = value;
    if (key === 'requirements') dbValue = JSON.stringify(value || []);
    if (key === 'featured') dbValue = value ? 1 : 0;
    fields.push(`${key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)} = ?`);
    values.push(dbValue);
  }
  values.push(id);
  await db.run(`UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`, values);
  return getJobById(id);
}

async function deleteJob(id) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().jobs.findIndex(j => j.id === id);
    if (index > -1) db.getMemoryDB().jobs.splice(index, 1);
    return;
  }
  await db.run('DELETE FROM jobs WHERE id = ?', [id]);
}

// Finance Requests
async function createFinanceRequest(data) {
  const now = db.now();
  const id = 'f-' + db.generateId();
  if (db.isMemory()) {
    const newReq = { id, ...data, status: 'new', createdAt: now };
    db.getMemoryDB().financeRequests.unshift(newReq);
    return newReq;
  }
  await db.run(
    `INSERT INTO finance_requests (id, name, phone, governorate, vehicle_type, vehicle_price, down_payment, monthly_income, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.name, data.phone, data.governorate, data.vehicleType, data.vehiclePrice, data.downPayment || 0, data.monthlyIncome || 0, 'new', now]
  );
  return getFinanceRequestById(id);
}

async function getFinanceRequests() {
  if (db.isMemory()) {
    return [...db.getMemoryDB().financeRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  const rows = await db.all('SELECT * FROM finance_requests ORDER BY created_at DESC');
  return formatRows(rows);
}

async function getFinanceRequestById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().financeRequests.find(f => f.id === id) || null;
  }
  const row = await db.get('SELECT * FROM finance_requests WHERE id = ?', [id]);
  return formatRow(row);
}

async function updateFinanceRequest(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().financeRequests.findIndex(f => f.id === id);
    if (index > -1) {
      db.getMemoryDB().financeRequests[index] = { ...db.getMemoryDB().financeRequests[index], ...data };
      return db.getMemoryDB().financeRequests[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    fields.push(`${key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)} = ?`);
    values.push(value);
  }
  values.push(id);
  await db.run(`UPDATE finance_requests SET ${fields.join(', ')} WHERE id = ?`, values);
  return getFinanceRequestById(id);
}

// Social Links
async function getSocialLinks(activeOnly = true) {
  if (db.isMemory()) {
    let links = db.getMemoryDB().socialLinks;
    if (activeOnly) links = links.filter(l => l.isActive);
    return links.sort((a, b) => a.displayOrder - b.displayOrder);
  }
  let sql = 'SELECT * FROM social_links';
  const params = [];
  if (activeOnly) { sql += ' WHERE is_active = 1'; }
  sql += ' ORDER BY display_order ASC';
  const rows = await db.all(sql, params);
  return formatRows(rows);
}

async function getSocialLinkById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().socialLinks.find(l => l.id === id) || null;
  }
  const row = await db.get('SELECT * FROM social_links WHERE id = ?', [id]);
  return formatRow(row);
}

async function createSocialLink(data) {
  const now = db.now();
  const id = 'sl-' + db.generateId();
  if (db.isMemory()) {
    const newLink = { id, ...data, isActive: data.isActive !== false, createdAt: now };
    db.getMemoryDB().socialLinks.push(newLink);
    return newLink;
  }
  await db.run(
    `INSERT INTO social_links (id, platform, name, url, icon, color, is_active, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.platform, data.name, data.url, data.icon || null, data.color || null, data.isActive !== false ? 1 : 0, data.displayOrder || 0, now]
  );
  return getSocialLinkById(id);
}

async function updateSocialLink(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().socialLinks.findIndex(l => l.id === id);
    if (index > -1) {
      db.getMemoryDB().socialLinks[index] = { ...db.getMemoryDB().socialLinks[index], ...data };
      return db.getMemoryDB().socialLinks[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    let dbValue = value;
    if (key === 'isActive') dbValue = value ? 1 : 0;
    fields.push(`${key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)} = ?`);
    values.push(dbValue);
  }
  values.push(id);
  await db.run(`UPDATE social_links SET ${fields.join(', ')} WHERE id = ?`, values);
  return getSocialLinkById(id);
}

async function deleteSocialLink(id) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().socialLinks.findIndex(l => l.id === id);
    if (index > -1) db.getMemoryDB().socialLinks.splice(index, 1);
    return;
  }
  await db.run('DELETE FROM social_links WHERE id = ?', [id]);
}

// Contact Numbers
async function getContactNumbers(activeOnly = true) {
  if (db.isMemory()) {
    let numbers = db.getMemoryDB().contactNumbers;
    if (activeOnly) numbers = numbers.filter(n => n.isActive);
    return numbers.sort((a, b) => a.displayOrder - b.displayOrder);
  }
  let sql = 'SELECT * FROM contact_numbers';
  const params = [];
  if (activeOnly) { sql += ' WHERE is_active = 1'; }
  sql += ' ORDER BY display_order ASC';
  const rows = await db.all(sql, params);
  return formatRows(rows);
}

async function getContactNumberById(id) {
  if (db.isMemory()) {
    return db.getMemoryDB().contactNumbers.find(n => n.id === id) || null;
  }
  const row = await db.get('SELECT * FROM contact_numbers WHERE id = ?', [id]);
  return formatRow(row);
}

async function createContactNumber(data) {
  const now = db.now();
  const id = 'cn-' + db.generateId();
  if (db.isMemory()) {
    const newNumber = { id, ...data, isActive: data.isActive !== false, createdAt: now };
    db.getMemoryDB().contactNumbers.push(newNumber);
    return newNumber;
  }
  await db.run(
    `INSERT INTO contact_numbers (id, title, phone, department, description, is_active, display_order, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, data.title, data.phone, data.department || null, data.description || null, data.isActive !== false ? 1 : 0, data.displayOrder || 0, now]
  );
  return getContactNumberById(id);
}

async function updateContactNumber(id, data) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().contactNumbers.findIndex(n => n.id === id);
    if (index > -1) {
      db.getMemoryDB().contactNumbers[index] = { ...db.getMemoryDB().contactNumbers[index], ...data };
      return db.getMemoryDB().contactNumbers[index];
    }
    return null;
  }
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id' || key === 'createdAt') continue;
    let dbValue = value;
    if (key === 'isActive') dbValue = value ? 1 : 0;
    fields.push(`${key.replace(/[A-Z]/g, l => `_${l.toLowerCase()}`)} = ?`);
    values.push(dbValue);
  }
  values.push(id);
  await db.run(`UPDATE contact_numbers SET ${fields.join(', ')} WHERE id = ?`, values);
  return getContactNumberById(id);
}

async function deleteContactNumber(id) {
  if (db.isMemory()) {
    const index = db.getMemoryDB().contactNumbers.findIndex(n => n.id === id);
    if (index > -1) db.getMemoryDB().contactNumbers.splice(index, 1);
    return;
  }
  await db.run('DELETE FROM contact_numbers WHERE id = ?', [id]);
}

// Site Settings
async function getSiteSettings() {
  if (db.isMemory()) {
    return db.getMemoryDB().siteSettings;
  }
  const rows = await db.all('SELECT * FROM site_settings');
  const settings = {};
  rows.forEach(row => { settings[row.key] = row.value; });
  return settings;
}

async function setSiteSetting(key, value) {
  const now = db.now();
  if (db.isMemory()) {
    db.getMemoryDB().siteSettings[key] = value;
    return { key, value };
  }
  await db.run(
    `INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    [key, value, now]
  );
  return { key, value };
}

// Seed data
async function seedData() {
  const now = db.now();
  
  // Disable auto-persist during seeding for performance
  db.autoPersist = false;
  
  try {
    // Seed admin if not exists
  const adminExists = await findUserByEmail('admin@tareeq.com');
  if (!adminExists) {
    await createUser({
      name: 'مدير المنصة',
      email: 'admin@tareeq.com',
      phone: '01000000000',
      password: bcrypt.hashSync('admin123', 10),
      type: 'admin',
      governorate: 'القاهرة',
      verified: true,
    });
  }

  // Seed social links if none
  const existingLinks = await getSocialLinks(false);
  if (existingLinks.length === 0) {
    const socialPlatforms = [
      { platform: 'facebook', name: 'Facebook', url: 'https://facebook.com/tareeq.eg', icon: 'Facebook', color: '#1877F2' },
      { platform: 'twitter', name: 'Twitter', url: 'https://twitter.com/tareeq_eg', icon: 'Twitter', color: '#1DA1F2' },
      { platform: 'instagram', name: 'Instagram', url: 'https://instagram.com/tareeq.eg', icon: 'Instagram', color: '#E4405F' },
      { platform: 'linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/tareeq-eg', icon: 'Linkedin', color: '#0A66C2' },
      { platform: 'youtube', name: 'YouTube', url: 'https://youtube.com/@tareeq_eg', icon: 'Youtube', color: '#FF0000' },
      { platform: 'tiktok', name: 'TikTok', url: 'https://tiktok.com/@tareeq.eg', icon: 'Music2', color: '#000000' },
    ];
    for (let i = 0; i < socialPlatforms.length; i++) {
      await createSocialLink({ ...socialPlatforms[i], displayOrder: i });
    }
  }

  // Seed contact numbers if none
  const existingContacts = await getContactNumbers(false);
  if (existingContacts.length === 0) {
    const contacts = [
      { title: 'خط الاستفسار والدعم', phone: '01001234567', department: 'support', description: 'متواجد 24/7' },
      { title: 'قسم المبيعات', phone: '01001234568', department: 'sales', description: 'للمعلنين والشركات' },
      { title: 'قسم التمويل', phone: '01001234569', department: 'finance', description: 'طلبات التمويل' },
      { title: 'الادارة', phone: '01001234570', department: 'management', description: 'للشكاوى والمقترحات' },
    ];
    for (let i = 0; i < contacts.length; i++) {
      await createContactNumber({ ...contacts[i], displayOrder: i });
    }
  }

  // Seed sample listings if none
  const existingListings = await getListings({});
  if (existingListings.length === 0) {
    const admin = await findUserByEmail('admin@tareeq.com');
    const sampleListings = [
      {
        title: 'شاحنة مرسيدس أكتروس 2020',
        description: 'شاحنة في حالة ممتازة، محرك مان 480 حصان',
        price: 1850000,
        category: 'trucks',
        subcategory: 'tractor-heads',
        location: 'القاهرة',
        governorate: 'cairo',
        images: ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80'],
        userId: admin.id,
        userName: 'المركز التجاري للشاحنات',
        userPhone: '01000000000',
        userType: 'company',
        verified: true,
        status: 'active',
        featured: true,
        year: 2020,
        brand: 'مرسيدس',
        model: 'أكتروس',
        condition: 'used',
      },
      {
        title: 'حفار كوماتسو 220 موديل 2019',
        description: 'حفار كوماتسو ياباني في حالة جيدة',
        price: 3200000,
        category: 'equipment',
        subcategory: 'excavators',
        location: 'الإسكندرية',
        governorate: 'alexandria',
        images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80'],
        userId: admin.id,
        userName: 'شركة النهضة للمعدات',
        userPhone: '01000000000',
        userType: 'company',
        verified: true,
        status: 'active',
        featured: true,
        year: 2019,
        brand: 'كوماتسو',
        model: 'PC220',
        condition: 'used',
      },
    ];
    for (const listing of sampleListings) {
      await createListing(listing);
    }
  }

  // Seed sample loads if none
  const existingLoads = await getLoads({});
  if (existingLoads.length === 0) {
    const admin = await findUserByEmail('admin@tareeq.com');
    const sampleLoads = [
      { origin: 'القاهرة', destination: 'الإسكندرية', cargoType: 'حديد', weight: '30 طن', price: 4500, date: '2024-12-28', userId: admin.id, userName: 'شركة الحديد', userPhone: '01000000000' },
      { origin: 'بورسعيد', destination: 'القاهرة', cargoType: 'أسمنت', weight: '45 طن', price: 6200, date: '2024-12-27', userId: admin.id, userName: 'مصنع الأسمنت', userPhone: '01000000000' },
    ];
    for (const load of sampleLoads) {
      await createLoad(load);
    }
  }

  // Seed sample jobs if none
  const existingJobs = await getJobs({});
  if (existingJobs.length === 0) {
    const admin = await findUserByEmail('admin@tareeq.com');
    const sampleJobs = [
      { title: 'سائق شاحنة نقل ثقيل', company: 'شركة النقل السريع', type: 'driver', location: 'القاهرة', governorate: 'cairo', salary: '8000 - 12000 جنيه', description: 'مطلوب سائقين شاحنات', requirements: ['رخصة قيادة', 'خبرة 3 سنوات'], experience: '3+ سنوات', userId: admin.id, userName: 'شركة النقل', userPhone: '01000000000' },
      { title: 'ميكانيكي شاحنات ثقيلة', company: 'ورشة المهندس', type: 'mechanic', location: 'الإسكندرية', governorate: 'alexandria', salary: '10000 - 15000 جنيه', description: 'مطلوب ميكانيكي', requirements: ['خبرة في الصيانة'], experience: '4+ سنوات', userId: admin.id, userName: 'ورشة المهندس', userPhone: '01000000000' },
    ];
    for (const job of sampleJobs) {
      await createJob(job);
    }
  }
  } finally {
    db.persist();
    db.autoPersist = true;
  }
}

// ===== Routes =====

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, type, governorate } = req.body;
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'الرجاء ملء جميع الحقول المطلوبة' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'البريد الإلكتروني مسجل مسبقاً' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name,
      email,
      phone,
      password: hashedPassword,
      type: type || 'individual',
      governorate: governorate || 'القاهرة',
      verified: false,
    });

    const token = jwt.sign({ id: newUser.id, email: newUser.email, type: newUser.type }, JWT_SECRET);
    res.json({ success: true, data: { user: sanitizeUser(newUser), token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'بيانات الدخول غير صالحة' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'بيانات الدخول غير صالحة' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, type: user.type }, JWT_SECRET);
    res.json({ success: true, data: { user: sanitizeUser(user), token } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'المستخدم غير موجود' });
    }
    res.json({ success: true, data: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Listings routes
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await getListings(req.query);
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/listings/featured', async (req, res) => {
  try {
    const listings = await getListings({ featured: true, status: 'active' });
    res.json({ success: true, data: listings.slice(0, 8) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/listings/:id', async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
    }
    res.json({ success: true, data: listing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/listings', authenticateToken, async (req, res) => {
  try {
    const newListing = await createListing({
      ...req.body,
      userId: req.user.id,
      status: 'pending',
      featured: false,
    });
    res.status(201).json({ success: true, data: newListing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
    }
    if (listing.userId !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    const updated = await updateListing(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/listings/:id', authenticateToken, async (req, res) => {
  try {
    const listing = await getListingById(req.params.id);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'الإعلان غير موجود' });
    }
    if (listing.userId !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    await deleteListing(req.params.id);
    res.json({ success: true, message: 'تم حذف الإعلان' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/listings/user/:userId', async (req, res) => {
  try {
    const listings = await getListings({ userId: req.params.userId });
    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Loads routes
app.get('/api/loads', async (req, res) => {
  try {
    const loads = await getLoads(req.query);
    res.json({ success: true, data: loads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/loads/:id', async (req, res) => {
  try {
    const load = await getLoadById(req.params.id);
    if (!load) {
      return res.status(404).json({ success: false, message: 'الحمولة غير موجودة' });
    }
    res.json({ success: true, data: load });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/loads', authenticateToken, async (req, res) => {
  try {
    const newLoad = await createLoad({
      ...req.body,
      userId: req.user.id,
      status: 'available',
    });
    res.status(201).json({ success: true, data: newLoad });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/loads/:id', authenticateToken, async (req, res) => {
  try {
    const load = await getLoadById(req.params.id);
    if (!load) {
      return res.status(404).json({ success: false, message: 'الحمولة غير موجودة' });
    }
    if (load.userId !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    const updated = await updateLoad(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/loads/:id', authenticateToken, async (req, res) => {
  try {
    const load = await getLoadById(req.params.id);
    if (!load) {
      return res.status(404).json({ success: false, message: 'الحمولة غير موجودة' });
    }
    if (load.userId !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    await deleteLoad(req.params.id);
    res.json({ success: true, message: 'تم حذف الحمولة' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Jobs routes
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await getJobs(req.query);
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'الوظيفة غير موجودة' });
    }
    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const newJob = await createJob({
      ...req.body,
      userId: req.user.id,
      status: 'active',
      featured: false,
    });
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'الوظيفة غير موجودة' });
    }
    if (job.userId !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    const updated = await updateJob(req.params.id, req.body);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const job = await getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'الوظيفة غير موجودة' });
    }
    if (job.userId !== req.user.id && req.user.type !== 'admin') {
      return res.status(403).json({ success: false, message: 'غير مصرح' });
    }
    await deleteJob(req.params.id);
    res.json({ success: true, message: 'تم حذف الوظيفة' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Finance routes
app.get('/api/finance', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const finance = await getFinanceRequests();
    res.json({ success: true, data: finance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/finance', async (req, res) => {
  try {
    const { name, phone, governorate, vehicleType, vehiclePrice, downPayment } = req.body;
    if (!name || !phone || !governorate || !vehicleType || !vehiclePrice) {
      return res.status(400).json({ success: false, message: 'الرجاء ملء جميع الحقول المطلوبة' });
    }
    const newRequest = await createFinanceRequest({
      ...req.body,
      status: 'new',
    });
    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/finance/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await updateFinanceRequest(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'طلب التمويل غير موجود' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users, listings, loads, jobs, financeReqs] = await Promise.all([
      getAllUsers(),
      getListings({}),
      getLoads({}),
      getJobs({}),
      getFinanceRequests(),
    ]);
    res.json({
      success: true,
      data: {
        users: users.length,
        listings: listings.length,
        pendingListings: listings.filter(l => l.status === 'pending').length,
        loads: loads.length,
        jobs: jobs.length,
        financeRequests: financeReqs.length,
        newFinanceRequests: financeReqs.filter(f => f.status === 'new').length,
        messages: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users.map(sanitizeUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await updateUser(req.params.id, req.body);
    res.json({ success: true, data: sanitizeUser(updated) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/listings/:id/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await updateListing(req.params.id, { status: 'active' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin/listings/:id/reject', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await updateListing(req.params.id, { status: 'rejected' });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Social Links API
app.get('/api/social-links', async (req, res) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const links = await getSocialLinks(activeOnly);
    res.json({ success: true, data: links });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/social-links', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const link = await createSocialLink(req.body);
    res.status(201).json({ success: true, data: link });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/social-links/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await updateSocialLink(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'رابط التواصل غير موجود' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/social-links/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await deleteSocialLink(req.params.id);
    res.json({ success: true, message: 'تم حذف رابط التواصل' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Contact Numbers API
app.get('/api/contact-numbers', async (req, res) => {
  try {
    const activeOnly = req.query.active !== 'false';
    const numbers = await getContactNumbers(activeOnly);
    res.json({ success: true, data: numbers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/contact-numbers', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const number = await createContactNumber(req.body);
    res.status(201).json({ success: true, data: number });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/contact-numbers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const updated = await updateContactNumber(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'رقم التواصل غير موجود' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/contact-numbers/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await deleteContactNumber(req.params.id);
    res.json({ success: true, message: 'تم حذف رقم التواصل' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Site Settings API
app.get('/api/site-settings', async (req, res) => {
  try {
    const settings = await getSiteSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/site-settings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await setSiteSetting(key, value);
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  res.json({ success: true, message: 'TAREEQ API is running', db: db.type });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    }
  });
}

// Initialize database and start server
async function startServer() {
  await db.init();
  await seedData();
  
  if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`TAREEQ Server running on port ${PORT}`);
    });
  }
}

startServer().catch(console.error);

export default app;
