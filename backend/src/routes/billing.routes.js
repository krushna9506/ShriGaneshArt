import express from 'express';
import { generateInvoiceHandler, listInvoices, getInvoiceHandler } from '../controllers/billing.controller.js';

const router = express.Router();

router.post('/generate/:orderId', generateInvoiceHandler);
router.get('/', listInvoices);
router.get('/:id', getInvoiceHandler);

export default router;
