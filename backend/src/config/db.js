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
    console.warn('[DB] No DATABASE_URL provided. Database-based login and persistence will be disabled.');
    return;
  }
  try {
    // 1. admins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. pg_models table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pg_models (
        id INT PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(255) NOT NULL,
        size VARCHAR(50) NOT NULL,
        material VARCHAR(50) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        total_stock INT NOT NULL,
        sold_stock INT NOT NULL,
        remaining_stock INT NOT NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);

    // 3. pg_customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pg_customers (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        notes TEXT
      );
    `);

    // 4. pg_orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pg_orders (
        id BIGINT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL,
        customer_id BIGINT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        address TEXT,
        city VARCHAR(100),
        order_date VARCHAR(50) NOT NULL,
        delivery_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        advance DECIMAL(10, 2) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL,
        items JSONB NOT NULL
      );
    `);

    // 5. pg_payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pg_payments (
        id BIGINT PRIMARY KEY,
        order_id BIGINT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        mode VARCHAR(50) NOT NULL,
        payment_date VARCHAR(50) NOT NULL,
        notes TEXT
      );
    `);

    // 6. pg_invoices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pg_invoices (
        id VARCHAR(50) PRIMARY KEY,
        invoice_number VARCHAR(50) NOT NULL,
        order_id BIGINT NOT NULL,
        customer_id BIGINT,
        invoice_date VARCHAR(50) NOT NULL,
        items JSONB NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        advance_paid DECIMAL(10, 2) NOT NULL,
        balance_due DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP NOT NULL
      );
    `);

    console.log('[DB] All Neon PostgreSQL database tables verified/created successfully.');
  } catch (err) {
    console.error('[DB] Failed to initialize database tables:', err.message);
  }
};

export default pool;
