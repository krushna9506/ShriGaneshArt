// Updated for free deployment: Vercel + Render + Neon
import app from './app.js';
import { loadModels } from './data/store.js';
import { initDatabase } from './config/db.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __serverDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__serverDir, '../../.env') });
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Ganesh Arts server running on port ${PORT}`);
  
  // Initialize PostgreSQL database tables
  await initDatabase();
});
