import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsJsonPath = path.join(__dirname, 'models.json');
const ordersJsonPath = path.join(__dirname, 'orders.json');
const paymentsJsonPath = path.join(__dirname, 'payments.json');
const customersJsonPath = path.join(__dirname, 'customers.json');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsJsonPath = path.join(__dirname, 'models.json');
const ordersJsonPath = path.join(__dirname, 'orders.json');
const paymentsJsonPath = path.join(__dirname, 'payments.json');
const customersJsonPath = path.join(__dirname, 'customers.json');

export async function saveModels() {
  try {
    fs.writeFileSync(modelsJsonPath, JSON.stringify(models, null, 2), 'utf8');
    console.log('[Store] Saved models successfully to models.json local backup');
  } catch (err) {
    console.error('[Store] Failed to save models to JSON:', err);
  }

  if (!process.env.DATABASE_URL) return;
  try {
    console.log('[Postgres Sync] Saving models to Neon cloud...');
    await pool.query('BEGIN');
    await pool.query('DELETE FROM pg_models');
    for (const m of models) {
      await pool.query(`
        INSERT INTO pg_models (id, code, name, size, material, price, total_stock, sold_stock, remaining_stock, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [m.id, m.code, m.name, m.size, m.material, m.price, m.totalStock, m.soldStock, m.remainingStock, m.active]);
    }
    await pool.query('COMMIT');
    console.log('[Postgres Sync] Successfully saved all models to Neon.');
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('[Postgres Sync] Failed to save models to Neon:', err);
  }
}

export async function saveOrders() {
  try {
    fs.writeFileSync(ordersJsonPath, JSON.stringify(orders, null, 2), 'utf8');
    console.log('[Store] Saved orders successfully to orders.json local backup');
  } catch (err) {
    console.error('[Store] Failed to save orders to JSON:', err);
  }

  if (!process.env.DATABASE_URL) return;
  try {
    console.log('[Postgres Sync] Saving orders to Neon cloud...');
    await pool.query('BEGIN');
    await pool.query('DELETE FROM pg_orders');
    for (const o of orders) {
      await pool.query(`
        INSERT INTO pg_orders (id, order_number, customer_id, customer_name, mobile, address, city, order_date, delivery_date, status, total_amount, advance, balance, items)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [o.id, o.orderNumber, o.customerId, o.customerName, o.mobile, o.address, o.city, o.orderDate, o.deliveryDate, o.status, o.totalAmount, o.advance, o.balance, JSON.stringify(o.items)]);
    }
    await pool.query('COMMIT');
    console.log('[Postgres Sync] Successfully saved all orders to Neon.');
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('[Postgres Sync] Failed to save orders to Neon:', err);
  }
}

export async function savePayments() {
  try {
    fs.writeFileSync(paymentsJsonPath, JSON.stringify(payments, null, 2), 'utf8');
    console.log('[Store] Saved payments successfully to payments.json local backup');
  } catch (err) {
    console.error('[Store] Failed to save payments to JSON:', err);
  }

  if (!process.env.DATABASE_URL) return;
  try {
    console.log('[Postgres Sync] Saving payments to Neon cloud...');
    await pool.query('BEGIN');
    await pool.query('DELETE FROM pg_payments');
    for (const p of payments) {
      await pool.query(`
        INSERT INTO pg_payments (id, order_id, amount, mode, payment_date, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [p.id, p.orderId, p.amount, p.mode, p.paymentDate, p.notes]);
    }
    await pool.query('COMMIT');
    console.log('[Postgres Sync] Successfully saved all payments to Neon.');
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('[Postgres Sync] Failed to save payments to Neon:', err);
  }
}

export async function saveCustomers() {
  try {
    fs.writeFileSync(customersJsonPath, JSON.stringify(customers, null, 2), 'utf8');
    console.log('[Store] Saved customers successfully to customers.json local backup');
  } catch (err) {
    console.error('[Store] Failed to save customers to JSON:', err);
  }

  if (!process.env.DATABASE_URL) return;
  try {
    console.log('[Postgres Sync] Saving customers to Neon cloud...');
    await pool.query('BEGIN');
    await pool.query('DELETE FROM pg_customers');
    for (const c of customers) {
      await pool.query(`
        INSERT INTO pg_customers (id, name, mobile, address, city, notes)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [c.id, c.name, c.mobile, c.address, c.city, c.notes]);
    }
    await pool.query('COMMIT');
    console.log('[Postgres Sync] Successfully saved all customers to Neon.');
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('[Postgres Sync] Failed to save customers to Neon:', err);
  }
}

export async function saveInvoices() {
  if (!process.env.DATABASE_URL) return;
  try {
    console.log('[Postgres Sync] Saving invoices to Neon cloud...');
    await pool.query('BEGIN');
    await pool.query('DELETE FROM pg_invoices');
    for (const inv of invoices) {
      await pool.query(`
        INSERT INTO pg_invoices (id, invoice_number, order_id, customer_id, invoice_date, items, subtotal, total_amount, advance_paid, balance_due, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [inv.id, inv.invoice_number, inv.order_id, inv.customer_id, inv.invoice_date, JSON.stringify(inv.items), inv.subtotal, inv.total_amount, inv.advance_paid, inv.balance_due, inv.created_at, inv.updated_at]);
    }
    await pool.query('COMMIT');
    console.log('[Postgres Sync] Successfully saved all invoices to Neon.');
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('[Postgres Sync] Failed to save invoices to Neon:', err);
  }
}

async function seedModelsToPostgres() {
  if (!process.env.DATABASE_URL) return;
  try {
    console.log('[Postgres Sync] Seeding initial models catalog to Neon database...');
    await pool.query('BEGIN');
    for (const m of initialModels) {
      await pool.query(`
        INSERT INTO pg_models (id, code, name, size, material, price, total_stock, sold_stock, remaining_stock, active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [m.id, m.code, m.name, m.size, m.material, m.price, m.totalStock, m.soldStock, m.remainingStock, m.active]);
    }
    await pool.query('COMMIT');
    console.log('[Postgres Sync] Seeding initial models completed successfully.');
  } catch (err) {
    try { await pool.query('ROLLBACK'); } catch {}
    console.error('[Postgres Sync] Seeding models failed:', err);
  }
}

export async function syncFromPostgres() {
  if (!process.env.DATABASE_URL) {
    console.warn('[Postgres Sync] No DATABASE_URL provided. Cloud sync skipped.');
    return;
  }
  try {
    console.log('[Postgres Sync] Hydrating in-memory database arrays from Neon Postgres cloud...');

    // 1. Models Catalog
    const modelsRes = await pool.query('SELECT * FROM pg_models ORDER BY id ASC');
    if (modelsRes.rows.length > 0) {
      models.length = 0;
      models.push(...modelsRes.rows.map(row => ({
        id: row.id,
        code: row.code,
        name: row.name,
        size: row.size,
        material: row.material,
        price: Number(row.price),
        totalStock: row.total_stock,
        soldStock: row.sold_stock,
        remainingStock: row.remaining_stock,
        active: row.active
      })));
      console.log(`[Postgres Sync] Loaded ${models.length} catalog models from Neon Postgres.`);
    } else {
      console.log('[Postgres Sync] Neon pg_models is empty. Seeding defaults...');
      await seedModelsToPostgres();
      // Reload models after seeding
      const modelsReload = await pool.query('SELECT * FROM pg_models ORDER BY id ASC');
      models.length = 0;
      models.push(...modelsReload.rows.map(row => ({
        id: row.id,
        code: row.code,
        name: row.name,
        size: row.size,
        material: row.material,
        price: Number(row.price),
        totalStock: row.total_stock,
        soldStock: row.sold_stock,
        remainingStock: row.remaining_stock,
        active: row.active
      })));
    }

    // 2. Customers
    const custRes = await pool.query('SELECT * FROM pg_customers');
    customers.length = 0;
    customers.push(...custRes.rows.map(row => ({
      id: Number(row.id),
      name: row.name,
      mobile: row.mobile,
      address: row.address,
      city: row.city,
      notes: row.notes
    })));
    console.log(`[Postgres Sync] Loaded ${customers.length} customers from Neon Postgres.`);

    // 3. Orders
    const ordersRes = await pool.query('SELECT * FROM pg_orders');
    orders.length = 0;
    orders.push(...ordersRes.rows.map(row => ({
      id: Number(row.id),
      orderNumber: row.order_number,
      customerId: Number(row.customer_id),
      customerName: row.customer_name,
      mobile: row.mobile,
      address: row.address,
      city: row.city,
      orderDate: row.order_date,
      deliveryDate: row.delivery_date,
      status: row.status,
      totalAmount: Number(row.total_amount),
      advance: Number(row.advance),
      balance: Number(row.balance),
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items
    })));
    console.log(`[Postgres Sync] Loaded ${orders.length} orders from Neon Postgres.`);

    // 4. Payments
    const paymentsRes = await pool.query('SELECT * FROM pg_payments');
    payments.length = 0;
    payments.push(...paymentsRes.rows.map(row => ({
      id: Number(row.id),
      orderId: Number(row.order_id),
      amount: Number(row.amount),
      mode: row.mode,
      paymentDate: row.payment_date,
      notes: row.notes
    })));
    console.log(`[Postgres Sync] Loaded ${payments.length} ledger payments from Neon Postgres.`);

    // 5. Invoices
    const invoicesRes = await pool.query('SELECT * FROM pg_invoices');
    invoices.length = 0;
    invoices.push(...invoicesRes.rows.map(row => ({
      id: row.id,
      invoice_number: row.invoice_number,
      order_id: Number(row.order_id),
      customer_id: row.customer_id ? Number(row.customer_id) : null,
      invoice_date: row.invoice_date,
      items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
      subtotal: Number(row.subtotal),
      total_amount: Number(row.total_amount),
      advance_paid: Number(row.advance_paid),
      balance_due: Number(row.balance_due),
      created_at: row.created_at,
      updated_at: row.updated_at
    })));
    console.log(`[Postgres Sync] Loaded ${invoices.length} billing invoices from Neon Postgres.`);

  } catch (err) {
    console.error('[Postgres Sync] Database synchronization failed:', err);
  }
}

export function loadStoreData() {
  loadModels();
  
  try {
    if (fs.existsSync(ordersJsonPath)) {
      const data = JSON.parse(fs.readFileSync(ordersJsonPath, 'utf8'));
      orders.length = 0;
      orders.push(...data);
      console.log(`[Store] Loaded ${orders.length} orders dynamically from orders.json`);
    }
  } catch (err) {
    console.error('[Store] Failed to load orders from JSON:', err);
  }

  try {
    if (fs.existsSync(paymentsJsonPath)) {
      const data = JSON.parse(fs.readFileSync(paymentsJsonPath, 'utf8'));
      payments.length = 0;
      payments.push(...data);
      console.log(`[Store] Loaded ${payments.length} payments dynamically from payments.json`);
    }
  } catch (err) {
    console.error('[Store] Failed to load payments from JSON:', err);
  }

  try {
    if (fs.existsSync(customersJsonPath)) {
      const data = JSON.parse(fs.readFileSync(customersJsonPath, 'utf8'));
      customers.length = 0;
      customers.push(...data);
      console.log(`[Store] Loaded ${customers.length} customers dynamically from customers.json`);
    }
  } catch (err) {
    console.error('[Store] Failed to load customers from JSON:', err);
  }
}

const models = [
  { id: 1, code: 'A65', name: 'Ganesh Model A65', size: '6 inch', material: 'Clay', price: 95, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 2, code: 'A66', name: 'Ganesh Model A66', size: '6 inch', material: 'Clay', price: 95, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 3, code: 'A64', name: 'Ganesh Model A64', size: '6 inch', material: 'Clay', price: 95, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 4, code: 'A61', name: 'Ganesh Model A61', size: '7 inch', material: 'Clay', price: 105, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 5, code: 'A62', name: 'Ganesh Model A62', size: '7 inch', material: 'Clay', price: 105, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 6, code: 'A63', name: 'Ganesh Model A63', size: '7 inch', material: 'Clay', price: 105, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 7, code: 'A59', name: 'Ganesh Model A59', size: '8 inch', material: 'Clay', price: 145, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 8, code: 'A60', name: 'Ganesh Model A60', size: '8 inch', material: 'Clay', price: 145, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 9, code: 'A28', name: 'Ganesh Model A28', size: '9 inch', material: 'Clay', price: 185, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 10, code: 'P27', name: 'Ganesh Model P27', size: '9 inch', material: 'Clay', price: 185, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 11, code: 'A29', name: 'Ganesh Model A29', size: '9 inch', material: 'Clay', price: 185, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 12, code: 'P26', name: 'Ganesh Model P26', size: '9 inch', material: 'Clay', price: 185, totalStock: 63, soldStock: 0, remainingStock: 63, active: true },
  { id: 13, code: 'A30', name: 'Ganesh Model A30', size: '10 inch', material: 'Clay', price: 230, totalStock: 58, soldStock: 0, remainingStock: 58, active: true },
  { id: 14, code: 'A27', name: 'Ganesh Model A27', size: '10 inch', material: 'Clay', price: 230, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 15, code: 'P30', name: 'Ganesh Model P30', size: '10 inch', material: 'Clay', price: 230, totalStock: 63, soldStock: 0, remainingStock: 63, active: true },
  { id: 16, code: 'A26', name: 'Ganesh Model A26', size: '11 inch', material: 'Clay', price: 260, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 17, code: 'A25', name: 'Ganesh Model A25', size: '11 inch', material: 'Clay', price: 260, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 18, code: 'P29', name: 'Ganesh Model P29', size: '11 inch', material: 'Clay', price: 260, totalStock: 63, soldStock: 0, remainingStock: 63, active: true },
  { id: 19, code: 'A31', name: 'Ganesh Model A31', size: '11 inch', material: 'Clay', price: 260, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 20, code: 'A58', name: 'Ganesh Model A58', size: '11 inch', material: 'Clay', price: 260, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 21, code: 'A32', name: 'Ganesh Model A32', size: '12 inch', material: 'Clay', price: 330, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 22, code: 'A33', name: 'Ganesh Model A33', size: '12 inch', material: 'Clay', price: 330, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 23, code: 'A57', name: 'Ganesh Model A57', size: '12 inch', material: 'Clay', price: 330, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 24, code: 'A36', name: 'Ganesh Model A36', size: '12 inch', material: 'Clay', price: 330, totalStock: 58, soldStock: 0, remainingStock: 58, active: true },
  { id: 25, code: 'A34', name: 'Ganesh Model A34', size: '12 inch', material: 'Clay', price: 330, totalStock: 56, soldStock: 0, remainingStock: 56, active: true },
  { id: 26, code: 'A37', name: 'Ganesh Model A37', size: '13 inch', material: 'Clay', price: 390, totalStock: 56, soldStock: 0, remainingStock: 56, active: true },
  { id: 27, code: 'A38', name: 'Ganesh Model A38', size: '13 inch', material: 'Clay', price: 390, totalStock: 58, soldStock: 0, remainingStock: 58, active: true },
  { id: 28, code: 'A10', name: 'Ganesh Model A10', size: '13 inch', material: 'Clay', price: 390, totalStock: 51, soldStock: 0, remainingStock: 51, active: true },
  { id: 29, code: 'A11', name: 'Ganesh Model A11', size: '13 inch', material: 'Clay', price: 435, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 30, code: 'A13', name: 'Ganesh Model A13', size: '13 inch', material: 'Clay', price: 435, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 31, code: 'A12', name: 'Ganesh Model A12', size: '13 inch', material: 'Clay', price: 435, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 32, code: 'A55', name: 'Ganesh Model A55', size: '13 inch', material: 'Clay', price: 435, totalStock: 61, soldStock: 0, remainingStock: 61, active: true },
  { id: 33, code: 'A56', name: 'Ganesh Model A56', size: '13 inch', material: 'Clay', price: 435, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 34, code: 'A41', name: 'Ganesh Model A41', size: '14 inch', material: 'Clay', price: 530, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 35, code: 'A53', name: 'Ganesh Model A53', size: '14 inch', material: 'Clay', price: 530, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 36, code: 'A40', name: 'Ganesh Model A40', size: '14 inch', material: 'Clay', price: 530, totalStock: 56, soldStock: 0, remainingStock: 56, active: true },
  { id: 37, code: 'A54', name: 'Ganesh Model A54', size: '14 inch', material: 'Clay', price: 530, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 38, code: 'A42', name: 'Ganesh Model A42', size: '14 inch', material: 'Clay', price: 530, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 39, code: 'A43', name: 'Ganesh Model A43', size: '15 inch', material: 'Clay', price: 610, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 40, code: 'A44', name: 'Ganesh Model A44', size: '15 inch', material: 'Clay', price: 610, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 41, code: 'A14', name: 'Ganesh Model A14', size: '15 inch', material: 'Clay', price: 610, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 42, code: 'A45', name: 'Ganesh Model A45', size: '16 inch', material: 'Clay', price: 760, totalStock: 39, soldStock: 0, remainingStock: 39, active: true },
  { id: 43, code: 'A52', name: 'Ganesh Model A52', size: '16 inch', material: 'Clay', price: 760, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 44, code: 'A51', name: 'Ganesh Model A51', size: '16 inch', material: 'Clay', price: 760, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 45, code: 'A47', name: 'Ganesh Model A47', size: '16 inch', material: 'Clay', price: 760, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 46, code: 'लालबाग', name: 'लालबाग', size: '17 inch', material: 'Clay', price: 820, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 47, code: 'A46', name: 'Ganesh Model A46', size: '17 inch', material: 'Clay', price: 820, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 48, code: '94', name: 'Ganesh Model 94', size: '17 inch', material: 'Clay', price: 820, totalStock: 34, soldStock: 0, remainingStock: 34, active: true },
  { id: 49, code: 'A48', name: 'Ganesh Model A48', size: '17 inch', material: 'Clay', price: 820, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 50, code: 'A50', name: 'Ganesh Model A50', size: '19 inch', material: 'MDF', price: 920, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 51, code: '14 B', name: 'Ganesh Model 14 B', size: '19 inch', material: 'MDF', price: 920, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 52, code: 'ओम', name: 'ओम', size: '19 inch', material: 'MDF', price: 960, totalStock: 34, soldStock: 0, remainingStock: 34, active: true },
  { id: 53, code: '8 B', name: 'Ganesh Model 8 B', size: '19 inch', material: 'MDF', price: 960, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 54, code: 'विठ्ठल', name: 'विठ्ठल', size: '20 inch', material: 'MDF', price: 1050, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 55, code: '12 B', name: 'Ganesh Model 12 B', size: '20 inch', material: 'MDF', price: 1150, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 56, code: '92', name: 'Ganesh Model 92', size: '20 inch', material: 'MDF', price: 1150, totalStock: 30, soldStock: 0, remainingStock: 30, active: true },
  { id: 57, code: 'नंदी', name: 'नंदी', size: '2 feet', material: 'MDF', price: 1600, totalStock: 10, soldStock: 0, remainingStock: 10, active: true },
  { id: 58, code: 'लालबाग', name: 'लालबाग', size: '2 feet', material: 'MDF', price: 1700, totalStock: 20, soldStock: 0, remainingStock: 20, active: true },
  { id: 59, code: '91 उंदीर', name: '91 उंदीर', size: '2 feet', material: 'MDF', price: 1600, totalStock: 20, soldStock: 0, remainingStock: 20, active: true },
  { id: 60, code: 'दगडु', name: 'दगडु', size: '2 feet', material: 'MDF', price: 1700, totalStock: 10, soldStock: 0, remainingStock: 10, active: true },
];

function loadModels() {
  try {
    if (fs.existsSync(modelsJsonPath)) {
      const data = JSON.parse(fs.readFileSync(modelsJsonPath, 'utf8'));
      models.length = 0;
      models.push(...data);
      console.log(`[Store] Loaded ${models.length} models dynamically from models.json`);
      return;
    }
  } catch (err) {
    console.error('[Store] Failed to load models from JSON:', err);
  }

  console.log('[Store] Loading default fallback models');
  models.length = 0;
  models.push(...initialModels);
}

const initialModels = [
  { id: 1, code: 'A65', name: 'Ganesh Model A65', size: '6 inch', material: 'Clay', price: 95, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 2, code: 'A66', name: 'Ganesh Model A66', size: '6 inch', material: 'Clay', price: 95, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 3, code: 'A64', name: 'Ganesh Model A64', size: '6 inch', material: 'Clay', price: 95, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 4, code: 'A61', name: 'Ganesh Model A61', size: '7 inch', material: 'Clay', price: 105, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 5, code: 'A62', name: 'Ganesh Model A62', size: '7 inch', material: 'Clay', price: 105, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 6, code: 'A63', name: 'Ganesh Model A63', size: '7 inch', material: 'Clay', price: 105, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 7, code: 'A59', name: 'Ganesh Model A59', size: '8 inch', material: 'Clay', price: 145, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 8, code: 'A60', name: 'Ganesh Model A60', size: '8 inch', material: 'Clay', price: 145, totalStock: 80, soldStock: 0, remainingStock: 80, active: true },
  { id: 9, code: 'A28', name: 'Ganesh Model A28', size: '9 inch', material: 'Clay', price: 185, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 10, code: 'P27', name: 'Ganesh Model P27', size: '9 inch', material: 'Clay', price: 185, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 11, code: 'A29', name: 'Ganesh Model A29', size: '9 inch', material: 'Clay', price: 185, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 12, code: 'P26', name: 'Ganesh Model P26', size: '9 inch', material: 'Clay', price: 185, totalStock: 63, soldStock: 0, remainingStock: 63, active: true },
  { id: 13, code: 'A30', name: 'Ganesh Model A30', size: '10 inch', material: 'Clay', price: 230, totalStock: 58, soldStock: 0, remainingStock: 58, active: true },
  { id: 14, code: 'A27', name: 'Ganesh Model A27', size: '10 inch', material: 'Clay', price: 230, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 15, code: 'P30', name: 'Ganesh Model P30', size: '10 inch', material: 'Clay', price: 230, totalStock: 63, soldStock: 0, remainingStock: 63, active: true },
  { id: 16, code: 'A26', name: 'Ganesh Model A26', size: '11 inch', material: 'Clay', price: 260, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 17, code: 'A25', name: 'Ganesh Model A25', size: '11 inch', material: 'Clay', price: 260, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 18, code: 'P29', name: 'Ganesh Model P29', size: '11 inch', material: 'Clay', price: 260, totalStock: 63, soldStock: 0, remainingStock: 63, active: true },
  { id: 19, code: 'A31', name: 'Ganesh Model A31', size: '11 inch', material: 'Clay', price: 260, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 20, code: 'A58', name: 'Ganesh Model A58', size: '11 inch', material: 'Clay', price: 260, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 21, code: 'A32', name: 'Ganesh Model A32', size: '12 inch', material: 'Clay', price: 330, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 22, code: 'A33', name: 'Ganesh Model A33', size: '12 inch', material: 'Clay', price: 330, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 23, code: 'A57', name: 'Ganesh Model A57', size: '12 inch', material: 'Clay', price: 330, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 24, code: 'A36', name: 'Ganesh Model A36', size: '12 inch', material: 'Clay', price: 330, totalStock: 58, soldStock: 0, remainingStock: 58, active: true },
  { id: 25, code: 'A34', name: 'Ganesh Model A34', size: '12 inch', material: 'Clay', price: 330, totalStock: 56, soldStock: 0, remainingStock: 56, active: true },
  { id: 26, code: 'A37', name: 'Ganesh Model A37', size: '13 inch', material: 'Clay', price: 390, totalStock: 56, soldStock: 0, remainingStock: 56, active: true },
  { id: 27, code: 'A38', name: 'Ganesh Model A38', size: '13 inch', material: 'Clay', price: 390, totalStock: 58, soldStock: 0, remainingStock: 58, active: true },
  { id: 28, code: 'A10', name: 'Ganesh Model A10', size: '13 inch', material: 'Clay', price: 390, totalStock: 51, soldStock: 0, remainingStock: 51, active: true },
  { id: 29, code: 'A11', name: 'Ganesh Model A11', size: '13 inch', material: 'Clay', price: 435, totalStock: 60, soldStock: 0, remainingStock: 60, active: true },
  { id: 30, code: 'A13', name: 'Ganesh Model A13', size: '13 inch', material: 'Clay', price: 435, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 31, code: 'A12', name: 'Ganesh Model A12', size: '13 inch', material: 'Clay', price: 435, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 32, code: 'A55', name: 'Ganesh Model A55', size: '13 inch', material: 'Clay', price: 435, totalStock: 61, soldStock: 0, remainingStock: 61, active: true },
  { id: 33, code: 'A56', name: 'Ganesh Model A56', size: '13 inch', material: 'Clay', price: 435, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 34, code: 'A41', name: 'Ganesh Model A41', size: '14 inch', material: 'Clay', price: 530, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 35, code: 'A53', name: 'Ganesh Model A53', size: '14 inch', material: 'Clay', price: 530, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 36, code: 'A40', name: 'Ganesh Model A40', size: '14 inch', material: 'Clay', price: 530, totalStock: 56, soldStock: 0, remainingStock: 56, active: true },
  { id: 37, code: 'A54', name: 'Ganesh Model A54', size: '14 inch', material: 'Clay', price: 530, totalStock: 62, soldStock: 0, remainingStock: 62, active: true },
  { id: 38, code: 'A42', name: 'Ganesh Model A42', size: '14 inch', material: 'Clay', price: 530, totalStock: 59, soldStock: 0, remainingStock: 59, active: true },
  { id: 39, code: 'A43', name: 'Ganesh Model A43', size: '15 inch', material: 'Clay', price: 610, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 40, code: 'A44', name: 'Ganesh Model A44', size: '15 inch', material: 'Clay', price: 610, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 41, code: 'A14', name: 'Ganesh Model A14', size: '15 inch', material: 'Clay', price: 610, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 42, code: 'A45', name: 'Ganesh Model A45', size: '16 inch', material: 'Clay', price: 760, totalStock: 39, soldStock: 0, remainingStock: 39, active: true },
  { id: 43, code: 'A52', name: 'Ganesh Model A52', size: '16 inch', material: 'Clay', price: 760, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 44, code: 'A51', name: 'Ganesh Model A51', size: '16 inch', material: 'Clay', price: 760, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 45, code: 'A47', name: 'Ganesh Model A47', size: '16 inch', material: 'Clay', price: 760, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 46, code: 'लालबाग', name: 'लालबाग', size: '17 inch', material: 'Clay', price: 820, totalStock: 50, soldStock: 0, remainingStock: 50, active: true },
  { id: 47, code: 'A46', name: 'Ganesh Model A46', size: '17 inch', material: 'Clay', price: 820, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 48, code: '94', name: 'Ganesh Model 94', size: '17 inch', material: 'Clay', price: 820, totalStock: 34, soldStock: 0, remainingStock: 34, active: true },
  { id: 49, code: 'A48', name: 'Ganesh Model A48', size: '17 inch', material: 'Clay', price: 820, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 50, code: 'A50', name: 'Ganesh Model A50', size: '19 inch', material: 'MDF', price: 920, totalStock: 35, soldStock: 0, remainingStock: 35, active: true },
  { id: 51, code: '14 B', name: 'Ganesh Model 14 B', size: '19 inch', material: 'MDF', price: 920, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 52, code: 'ओम', name: 'ओम', size: '19 inch', material: 'MDF', price: 960, totalStock: 34, soldStock: 0, remainingStock: 34, active: true },
  { id: 53, code: '8 B', name: 'Ganesh Model 8 B', size: '19 inch', material: 'MDF', price: 960, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 54, code: 'विठ्ठल', name: 'विठ्ठल', size: '20 inch', material: 'MDF', price: 1050, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 55, code: '12 B', name: 'Ganesh Model 12 B', size: '20 inch', material: 'MDF', price: 1150, totalStock: 40, soldStock: 0, remainingStock: 40, active: true },
  { id: 56, code: '92', name: 'Ganesh Model 92', size: '20 inch', material: 'MDF', price: 1150, totalStock: 30, soldStock: 0, remainingStock: 30, active: true },
  { id: 57, code: 'नंदी', name: 'नंदी', size: '2 feet', material: 'MDF', price: 1600, totalStock: 10, soldStock: 0, remainingStock: 10, active: true },
  { id: 58, code: 'लालबाग', name: 'लालबाग', size: '2 feet', material: 'MDF', price: 1700, totalStock: 20, soldStock: 0, remainingStock: 20, active: true },
  { id: 59, code: '91 उंदीर', name: '91 उंदीर', size: '2 feet', material: 'MDF', price: 1600, totalStock: 20, soldStock: 0, remainingStock: 20, active: true },
  { id: 60, code: 'दगडु', name: 'दगडु', size: '2 feet', material: 'MDF', price: 1700, totalStock: 10, soldStock: 0, remainingStock: 10, active: true },
];

loadStoreData();


const customers = [];
const orders = [];
const payments = [];
const invoices = [];

const formatDate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const findOrder = (orderId) => orders.find((item) => String(item.id) === String(orderId));
const findModel = (modelId) => models.find((item) => String(item.id) === String(modelId));
const findCustomer = (customerId) => customers.find((item) => String(item.id) === String(customerId));

const createCustomer = (payload) => {
  const existing = customers.find((item) => String(item.mobile) === String(payload.mobile));
  if (existing) return existing;
  const customer = { id: Date.now(), ...payload };
  customers.push(customer);
  return customer;
};

const deductOrderStock = (order) => {
  order.items.forEach((item) => {
    const model = findModel(item.modelId);
    if (model) {
      model.soldStock = Number(model.soldStock || 0) + item.quantity;
      model.remainingStock = Number(model.remainingStock || 0) - item.quantity;
    }
  });
};

const restoreOrderStock = (order) => {
  order.items.forEach((item) => {
    const model = findModel(item.modelId);
    if (model) {
      model.soldStock = Math.max(0, Number(model.soldStock || 0) - item.quantity);
      model.remainingStock = Number(model.remainingStock || 0) + item.quantity;
    }
  });
};

const createOrder = (payload) => {
  const customer = createCustomer({
    name: payload.customerName || 'Walk-in Customer',
    mobile: payload.mobile || '0000000000',
    address: payload.address || 'Pune',
    city: payload.city || 'Pune',
    notes: payload.notes || ''
  });

  const items = (payload.items || []).map((item) => {
    const model = findModel(item.modelId || item.id);
    if (!model) throw new Error('Model not found');
    const quantity = Number(item.quantity || 0);
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    const available = Number(model.remainingStock ?? model.totalStock ?? 0);
    if (quantity > available) throw new Error(`Only ${available} units available for ${model.name}`);

    const price = Number(model.price ?? item.price ?? 0);
    return {
      modelId: Number(model.id),
      code: model.code,
      name: model.name,
      size: model.size,
      quantity,
      price,
      subtotal: quantity * price
    };
  });

  if (!items.length) throw new Error('Order must contain at least one item');

  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  const advance = Number(payload.advance || 0);
  const order = {
    id: Date.now(),
    orderNumber: `ORD-${String(Date.now()).slice(-4)}`,
    customerId: customer.id,
    customerName: customer.name,
    mobile: customer.mobile,
    address: customer.address,
    city: customer.city,
    orderDate: payload.orderDate || formatDate(),
    deliveryDate: payload.deliveryDate || formatDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
    status: payload.status || 'Booked',
    totalAmount,
    advance,
    balance: Math.max(0, totalAmount - advance),
    items
  };

  if (advance > 0) {
    const isFullPayment = advance >= totalAmount;
    payments.push({
      id: Date.now() + 1,
      orderId: order.id,
      amount: advance,
      mode: payload.paymentMode || 'Cash',
      paymentDate: order.orderDate,
      notes: isFullPayment ? 'Full payment received at booking' : 'Advance received at booking'
    });
  }

  // Deduct stock if order is active (not Cancelled)
  if (order.status !== 'Cancelled') {
    deductOrderStock(order);
  }

  orders.push(order);
  
  // Persist store state to disk
  saveModels();
  saveOrders();
  savePayments();
  saveCustomers();
  
  return order;
};

const recordPayment = (payload) => {
  const order = findOrder(payload.orderId);
  if (!order) throw new Error('Order not found');

  const amount = Number(payload.amount || 0);
  if (amount <= 0) throw new Error('Amount must be greater than zero');

  order.advance = Number(order.advance || 0) + amount;
  order.balance = Math.max(0, Number(order.totalAmount || 0) - Number(order.advance || 0));

  const isFullSettlement = order.balance === 0;
  const payment = {
    id: Date.now(),
    orderId: order.id,
    amount,
    mode: payload.mode || 'Cash',
    paymentDate: payload.paymentDate || formatDate(),
    notes: payload.notes || (isFullSettlement ? 'Final balance settlement' : 'Installment payment')
  };

  payments.push(payment);
  
  // Persist store state to disk
  saveOrders();
  savePayments();
  
  return { order, payment };
};

const updateDeliveryStatus = (orderId, status) => {
  const order = findOrder(orderId);
  if (!order) throw new Error('Order not found');
  
  const prevStatus = order.status;
  order.status = status;

  // Sync stock dynamically if status is changed to/from Cancelled
  if (prevStatus !== 'Cancelled' && status === 'Cancelled') {
    restoreOrderStock(order);
  } else if (prevStatus === 'Cancelled' && status !== 'Cancelled') {
    deductOrderStock(order);
  }

  // Persist store state to disk
  saveModels();
  saveOrders();

  return order;
};

const deleteOrder = (orderId) => {
  const index = orders.findIndex((item) => String(item.id) === String(orderId));
  if (index === -1) throw new Error('Order not found');

  const order = orders[index];
  
  // Revert stock if the order was not already Cancelled
  if (order.status !== 'Cancelled') {
    restoreOrderStock(order);
  }

  orders.splice(index, 1);
  
  // Persist store state to disk
  saveModels();
  saveOrders();

  return { deleted: true };
};

const updateOrder = (orderId, payload) => {
  const order = findOrder(orderId);
  if (!order) throw new Error('Order not found');

  const prevStatus = order.status;
  const newStatus = payload.status || order.status;

  // 1. Revert stock of old items if the order was active (not Cancelled)
  if (prevStatus !== 'Cancelled') {
    restoreOrderStock(order);
  }

  // 2. Process new items
  const newItems = (payload.items || []).map((item) => {
    const model = findModel(item.modelId || item.id);
    if (!model) throw new Error('Model not found');
    const quantity = Number(item.quantity || 0);
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    
    const price = Number(model.price ?? item.price ?? 0);
    return {
      modelId: Number(model.id),
      code: model.code,
      name: model.name,
      size: model.size,
      quantity,
      price,
      subtotal: quantity * price
    };
  });

  if (!newItems.length) throw new Error('Order must contain at least one item');

  // Update fields
  order.customerName = payload.customerName || order.customerName;
  order.mobile = payload.mobile || order.mobile;
  order.address = payload.address || order.address;
  order.city = payload.city || order.city;
  order.deliveryDate = payload.deliveryDate || order.deliveryDate;
  order.status = newStatus;

  const totalAmount = newItems.reduce((sum, item) => sum + item.subtotal, 0);
  order.totalAmount = totalAmount;
  order.balance = Math.max(0, totalAmount - Number(order.advance || 0));
  order.items = newItems;

  // 3. Deduct stock for new items if the new status is active (not Cancelled)
  if (newStatus !== 'Cancelled') {
    deductOrderStock(order);
  }

  // Persist store state to disk
  saveModels();
  saveOrders();

  return order;
};

export {
  models,
  customers,
  orders,
  payments,
  invoices,
  createOrder,
  recordPayment,
  updateDeliveryStatus,
  findOrder,
  findModel,
  findCustomer,
  formatDate,
  loadModels,
  deleteOrder,
  updateOrder,
  loadStoreData
};
