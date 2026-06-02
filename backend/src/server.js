import app from './app.js';
import { loadModels, syncFromPostgres } from './data/store.js';
import { initDatabase } from './config/db.js';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
const __serverDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__serverDir, '../../.env') });
const PORT = process.env.PORT || 3000; // keep original port for deployed setups

// Helper: attempt to find and kill process using the given port (Windows & Unix)
const killProcessOnPort = (port) => new Promise((resolve) => {
  const platform = process.platform;
  if (platform === 'win32') {
    // netstat to find PID
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      if (err || !stdout) return resolve(false);
      // pick the last numeric token as PID
      const lines = stdout.trim().split(/\r?\n/).filter(Boolean);
      const pids = lines.map((ln) => {
        const m = ln.trim().match(/\s+(\d+)$/);
        return m ? m[1] : null;
      }).filter(Boolean);
      if (pids.length === 0) return resolve(false);
      // kill all found PIDs
      const kills = pids.map((pid) => new Promise((res) => {
        exec(`taskkill /PID ${pid} /F`, (ke, ks) => res(!ke));
      }));
      Promise.all(kills).then((results) => resolve(results.some(Boolean)));
    });
  } else {
    // Unix-like: use lsof to get PIDs
    exec(`lsof -t -i :${port}`, (err, stdout) => {
      if (err || !stdout) return resolve(false);
      const pids = stdout.trim().split(/\r?\n/).filter(Boolean);
      if (pids.length === 0) return resolve(false);
      const kills = pids.map((pid) => new Promise((res) => {
        exec(`kill -9 ${pid}`, (ke) => res(!ke));
      }));
      Promise.all(kills).then((results) => resolve(results.some(Boolean)));
    });
  }
});

let attemptedKill = false;

const startServer = async () => {
  try {
    const server = app.listen(PORT, '0.0.0.0', async () => {
      console.log(`Ganesh Arts server running on port ${PORT}`);

      // Initialize PostgreSQL database tables
      await initDatabase();

      // Hydrate all database arrays from Neon Postgres cloud
      await syncFromPostgres();
    });

    server.on('error', async (err) => {
      if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
        if (attemptedKill) {
          console.error('Already attempted to free the port — aborting to avoid unsafe kills.');
          process.exit(1);
        }

        console.log(`Attempting to terminate process using port ${PORT} so this server can start.`);
        attemptedKill = true;
        const killed = await killProcessOnPort(PORT);
        if (!killed) {
          console.error(`Failed to detect or terminate process on port ${PORT}. Please free the port manually and retry.`);
          process.exit(1);
        }

        // Small delay to let OS release the port
        setTimeout(() => {
          startServer();
        }, 800);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
};

startServer();
