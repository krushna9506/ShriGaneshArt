// Updated for free deployment: Vercel + Render + Neon
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import billingRoutes from './routes/billing.routes.js';
import { authMiddleware } from './middleware/authMiddleware.js';
import { createOrder, customers, models, orders, payments, recordPayment, updateDeliveryStatus, deleteOrder, updateOrder, saveModels } from './data/store.js';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)
  : null;

// CORS setup
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://shri-ganesh-art.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Render health checks)
    if (!origin) return callback(null, true);
    
    // Allow any localhost origin (any port)
    if (/^https?:\/\/localhost(:\d+)?$/.test(origin) || /^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow any local network IP address (e.g. 192.168.x.x, 172.16.x.x to 172.31.x.x, 10.x.x.x)
    if (/^https?:\/\/(192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    
    // Allow any vercel.app subdomain, onrender.com subdomain, or pre-configured origins
    if (
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.onrender.com') ||
      allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(morgan('dev'));
app.use(express.json());

// UptimeRobot ping endpoint
app.get('/ping', (req, res) => res.status(200).send('pong'));
app.get('/api/ping', (req, res) => res.status(200).send('pong'));

// Render Health check — available at both /health and /api/health
const healthHandler = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'ok',
      db: 'connected',
      timestamp: new Date().toISOString(),
      service: 'Ganesh Arts API'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      db: 'disconnected',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
};
// Register health check at both root and /api prefix
app.get('/health', healthHandler);
app.get('/api/health', healthHandler);


function auth(req, res, next) {
  return authMiddleware(req, res, next);
}

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Mobile number and password are required' });
  }

  const cleanMobile = String(username).trim();

  try {
    // Look up the credentials directly in Neon PostgreSQL admins table
    const result = await pool.query('SELECT * FROM admins WHERE mobile = $1', [cleanMobile]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid mobile number or password' });
    }

    const token = jwt.sign({ sub: cleanMobile }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token, mobile: cleanMobile });
  } catch (err) {
    console.error('[Auth] Database manual login error:', err.message);
    return res.status(500).json({ 
      error: 'Database connection failed. Please check Neon DATABASE_URL environment configuration.' 
    });
  }
});

app.post('/api/auth/verify-password', auth, async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  try {
    const userMobile = req.user?.sub;
    console.log('[Verify] Verifying password for admin mobile number:', userMobile);
    
    if (!userMobile) {
      return res.status(400).json({ error: 'User mobile details missing from session context' });
    }

    const result = await pool.query('SELECT * FROM admins WHERE mobile = $1', [userMobile]);
    if (result.rows.length === 0) {
      console.warn('[Verify] No database admin user found for mobile:', userMobile);
      return res.status(404).json({ error: 'Admin user not found in secure tables' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    console.log('[Verify] Hashed password comparison result:', isMatch ? 'MATCHED' : 'MISMATCHED');

    if (!isMatch) {
      return res.status(403).json({ error: 'Incorrect password. Access denied.' });
    }
    
    return res.json({ ok: true });
  } catch (err) {
    console.error('[Verify] Password verification failed with internal error:', err);
    return res.status(500).json({ error: 'Internal server error during password verification' });
  }
});

app.get('/api/dashboard', auth, (req, res) => {
  const pendingPayments = orders.reduce((sum, order) => sum + Number(order.balance || 0), 0);
  const availableStock = models.reduce((sum, model) => sum + Number(model.remainingStock || 0), 0);
  const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  res.json({
    cards: [
      { label: 'Total Orders', value: orders.length },
      { label: 'Pending Payments', value: `₹${pendingPayments.toLocaleString('en-IN')}` },
      { label: 'Total Revenue', value: `₹${revenue.toLocaleString('en-IN')}` },
      { label: 'Available Stock', value: `${availableStock} units` }
    ],
    sales: [
      { month: 'Jan', value: 40 },
      { month: 'Feb', value: 55 },
      { month: 'Mar', value: 70 },
      { month: 'Apr', value: 60 }
    ],
    alerts: ['Low stock on GA-001', '2 orders pending delivery']
  });
});

app.get('/api/models', auth, (req, res) => res.json(models));
app.post('/api/models', auth, (req, res) => {
  const item = { id: Date.now(), ...req.body, price: req.body.price ?? '' };
  models.push(item);
  saveModels();
  res.status(201).json(item);
});
app.put('/api/models/:id', auth, (req, res) => {
  const index = models.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Model not found' });
  models[index] = { ...models[index], ...req.body, price: req.body.price ?? '' };
  saveModels();
  res.json(models[index]);
});
app.delete('/api/models/:id', auth, (req, res) => {
  const index = models.findIndex((item) => item.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Model not found' });
  const [removed] = models.splice(index, 1);
  saveModels();
  res.json({ deleted: true, model: removed });
});

app.get('/api/customers', auth, (req, res) => res.json(customers));
app.post('/api/customers', auth, (req, res) => {
  const item = { id: Date.now(), ...req.body };
  customers.push(item);
  res.status(201).json(item);
});

app.get('/api/orders', auth, (req, res) => res.json(orders));
app.post('/api/orders', auth, (req, res) => {
  try {
    const order = createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to create order' });
  }
});
app.put('/api/orders/:id', auth, (req, res) => {
  try {
    const order = updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to update order' });
  }
});
app.delete('/api/orders/:id', auth, (req, res) => {
  try {
    const result = deleteOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to delete order' });
  }
});

app.get('/api/payments', auth, (req, res) => {
  const populated = payments.map((p) => {
    const order = orders.find((o) => String(o.id) === String(p.orderId));
    const customer = customers.find((c) => String(c.id) === String(order?.customerId || p.customerId));
    return {
      ...p,
      customerName: order?.customerName || p.customerName || customer?.name || 'Walk-in Customer',
      orderNumber: order?.orderNumber || p.orderNumber || `Order #${p.orderId}`,
      orderStatus: order ? order.status : (p.orderStatus || 'Cancelled')
    };
  });
  res.json(populated);
});
app.post('/api/payments', auth, (req, res) => {
  try {
    const result = recordPayment(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to record payment' });
  }
});

app.get('/api/deliveries', auth, (req, res) => res.json(orders.filter((order) => order.status !== 'Cancelled')));
app.patch('/api/deliveries/:id', auth, (req, res) => {
  try {
    const order = updateDeliveryStatus(req.params.id, req.body.status || 'Delivered');
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message || 'Unable to update delivery status' });
  }
});

app.use('/api/billing', authMiddleware, billingRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
