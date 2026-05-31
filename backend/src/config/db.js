// Updated for free deployment: Vercel + Render + Neon
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // required for Neon free tier
  },
  max: 5,                      // keep connections low for free tier
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err);
});

export const query = (text, params) => pool.query(text, params);

export const initDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('[DB] No DATABASE_URL provided. Database-based login will be disabled until it is configured.');
    return;
  }
  try {
    // Create admins table for secure database-based credentials
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('[DB] Database tables verified/created successfully.');
  } catch (err) {
    console.error('[DB] Failed to initialize database tables:', err.message);
  }
};

export default pool;
