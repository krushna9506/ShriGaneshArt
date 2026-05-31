import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const modelsJsonPath = path.join(__dirname, 'models.json');

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

loadModels();


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
  updateOrder
};
