import express from 'express';
import { 
  generateInvoiceHandler, 
  regenerateInvoiceHandler, 
  deleteInvoiceHandler, 
  listInvoices, 
  getInvoiceHandler 
} from '../controllers/billing.controller.js';

const router = express.Router();

router.post('/generate/:orderId', generateInvoiceHandler);
router.post('/regenerate/:orderId', regenerateInvoiceHandler);
router.get('/', listInvoices);
router.get('/:id', getInvoiceHandler);
router.delete('/:id', deleteInvoiceHandler);

export default router;
