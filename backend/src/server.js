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
  
  // File watcher for real-time Excel hot-reloading
  try {
    // __serverDir is defined at the top of the file
    const excelFilePath = path.resolve(__serverDir, '../../database/Shri_Ganesh_Art_Stock_and_Price.xlsx');
    const pythonScriptPath = path.resolve(__serverDir, '../../scripts/extract_models.py');

    console.log(`[Watcher] Starting file watcher for Excel database at: ${excelFilePath}`);

    let watchTimeout = null;
    if (fs.existsSync(excelFilePath)) {
      fs.watch(excelFilePath, (eventType) => {
        // Debounce to prevent multiple triggers for a single save
        if (watchTimeout) clearTimeout(watchTimeout);
        watchTimeout = setTimeout(() => {
          console.log('[Watcher] Excel spreadsheet change detected. Running sync script...');
          exec(`python "${pythonScriptPath}"`, (error, stdout, stderr) => {
            if (error) {
              console.error(`[Watcher] Sync script error: ${error.message}`);
              return;
            }
            if (stderr) {
              console.warn(`[Watcher] Sync script stderr: ${stderr}`);
            }
            console.log(`[Watcher] Sync script output: ${stdout.trim()}`);
            
            // Reload models into the running server memory
            loadModels();
          });
        }, 500);
      });
    } else {
      console.warn(`[Watcher] Excel file not found at ${excelFilePath}. Live hot-reloading is disabled.`);
    }
  } catch (watchErr) {
    console.error('[Watcher] Failed to set up file watcher:', watchErr.message);
  }
});
