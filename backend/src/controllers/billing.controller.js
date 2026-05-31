import { generateInvoice, getAllInvoices, getInvoiceById } from '../services/billing.service.js';

const generateInvoiceHandler = async (req, res) => {
  try {
    const invoice = generateInvoice(req.params.orderId);
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to generate invoice' });
  }
};

const listInvoices = (req, res) => {
  try {
    const result = getAllInvoices(req.query);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to load invoices' });
  }
};

const getInvoiceHandler = (req, res) => {
  try {
    const invoice = getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Failed to load invoice' });
  }
};

export { generateInvoiceHandler, listInvoices, getInvoiceHandler };
