import pg from 'pg';
import initSqlJs from 'sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

class Database {
  constructor() {
    this.db = null;
    this.pool = null;
    this.type = 'memory';
    this.memoryDB = null;
    this.sql = null;
    this.dbPath = process.env.SQLITE_PATH || path.join(process.cwd(), 'data', 'tareeq.db');
    this.autoPersist = true;
  }

  async init() {
    if (process.env.DATABASE_URL) {
      try {
        this.pool = new Pool({
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        });
        await this.pool.query('SELECT NOW()');
        this.type = 'postgresql';
        console.log('✅ Connected to PostgreSQL');
        await this.runSchemaPostgreSQL();
        return;
      } catch (err) {
        console.error('❌ Failed to connect to PostgreSQL:', err.message);
        this.pool = null;
      }
    }

    try {
      fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
      this.sql = await initSqlJs({
        locateFile: (file) => {
          // Try node_modules first, fallback to bundled path
          const candidates = [
            path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file),
            path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', file),
            path.join(__dirname, 'node_modules', 'sql.js', 'dist', file),
          ];
          for (const candidate of candidates) {
            if (fs.existsSync(candidate)) return candidate;
          }
          return file;
        },
      });
      
      let buffer = null;
      if (fs.existsSync(this.dbPath)) {
        buffer = fs.readFileSync(this.dbPath);
      }
      
      this.db = new this.sql.Database(buffer);
      this.type = 'sqlite';
      console.log('✅ Connected to SQLite at', this.dbPath);
      this.runSchemaSQLite();
      this.persist();
    } catch (err) {
      console.error('❌ Failed to connect to SQLite:', err.message);
      console.log('⚠️ Falling back to in-memory storage');
      this.initMemoryDB();
    }
  }

  persist() {
    if (this.type === 'sqlite' && this.db) {
      try {
        const data = this.db.export();
        fs.writeFileSync(this.dbPath, Buffer.from(data));
      } catch (err) {
        console.error('Failed to persist SQLite:', err.message);
      }
    }
  }

  async runSchemaPostgreSQL() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      try {
        await this.pool.query(statement + ';');
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Schema error:', err.message);
        }
      }
    }
  }

  runSchemaSQLite() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    for (const statement of statements) {
      try {
        this.db.exec(statement + ';');
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.error('Schema error:', err.message);
        }
      }
    }
  }

  initMemoryDB() {
    this.memoryDB = {
      users: [],
      listings: [],
      loads: [],
      jobs: [],
      financeRequests: [],
      messages: [],
      categories: [],
      governorates: [],
      socialLinks: [],
      contactNumbers: [],
      siteSettings: {},
    };
  }

  // PostgreSQL helpers
  async allPostgresql(sql, params) {
    const result = await this.pool.query(sql, params);
    return result.rows;
  }

  async getPostgresql(sql, params) {
    const result = await this.pool.query(sql, params);
    return result.rows[0] || null;
  }

  async runPostgresql(sql, params) {
    return await this.pool.query(sql, params);
  }

  // SQLite helpers
  prepareSqlite(sql, params = []) {
    const stmt = this.db.prepare(sql);
    if (params.length > 0) {
      stmt.bind(params);
    }
    return stmt;
  }

  allSqlite(sql, params = []) {
    const stmt = this.prepareSqlite(sql, params);
    const result = [];
    while (stmt.step()) {
      result.push(stmt.getAsObject());
    }
    stmt.free();
    return result;
  }

  getSqlite(sql, params = []) {
    const stmt = this.prepareSqlite(sql, params);
    if (!stmt.step()) {
      stmt.free();
      return null;
    }
    const result = stmt.getAsObject();
    stmt.free();
    return result;
  }

  runSqlite(sql, params = []) {
    this.db.run(sql, params);
    if (this.autoPersist) {
      this.persist();
    }
  }

  // Generic methods
  async all(sql, params = []) {
    if (this.type === 'postgresql') return this.allPostgresql(sql, params);
    if (this.type === 'sqlite') return this.allSqlite(sql, params);
    return [];
  }

  async get(sql, params = []) {
    if (this.type === 'postgresql') return this.getPostgresql(sql, params);
    if (this.type === 'sqlite') return this.getSqlite(sql, params);
    return null;
  }

  async run(sql, params = []) {
    if (this.type === 'postgresql') return this.runPostgresql(sql, params);
    if (this.type === 'sqlite') return this.runSqlite(sql, params);
    return null;
  }

  isPostgresql() {
    return this.type === 'postgresql';
  }

  isSQLite() {
    return this.type === 'sqlite';
  }

  isMemory() {
    return this.type === 'memory';
  }

  getMemoryDB() {
    return this.memoryDB;
  }

  camelCaseRow(row) {
    if (!row) return null;
    const booleanFields = ['verified', 'featured', 'is_active', 'read'];
    const result = {};
    for (const [key, value] of Object.entries(row)) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      if (booleanFields.includes(key)) {
        result[camelKey] = value === 1 || value === true;
      } else {
        result[camelKey] = value;
      }
    }
    return result;
  }

  camelCaseRows(rows) {
    return rows.map(row => this.camelCaseRow(row));
  }

  now() {
    return new Date().toISOString();
  }

  generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
}

export default new Database();
