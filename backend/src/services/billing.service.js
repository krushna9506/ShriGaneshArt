import { generateInvoiceNumber } from '../utils/invoiceNumber.js';
import { customers, invoices, models, orders } from '../data/store.js';

const findOrder = (orderId) => orders.find((order) => String(order.id) === String(orderId));
const findCustomer = (customerId) => customers.find((customer) => String(customer.id) === String(customerId));

const generateInvoice = (orderId) => {
  const order = findOrder(orderId);
  if (!order) throw new Error('Order not found');

  const customer = findCustomer(order.customerId);
  const items = (order.items || []).map((item) => ({
    model_name: item.name || 'Model',
    size: item.size || '',
    quantity: item.quantity,
    rate: item.price,
    amount: item.subtotal
  }));

  const subtotal = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalAmount = subtotal;
  const invoiceNumber = generateInvoiceNumber(invoices);
  const invoice = {
    id: String(Date.now()),
    invoice_number: invoiceNumber,
    order_id: order.id,
    customer_id: customer?.id,
    invoice_date: new Date().toLocaleDateString('sv'),
    items,
    subtotal,
    total_amount: totalAmount,
    advance_paid: order.advance || 0,
    balance_due: Math.max(0, totalAmount - (order.advance || 0)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    order,
    customer,
    models
  };

  invoices.push(invoice);
  return invoice;
};

const getInvoiceById = (invoiceId) => invoices.find((invoice) => String(invoice.id) === String(invoiceId));

const getAllInvoices = (filters = {}) => {
  const page = Number(filters.page || 1);
  const limit = 10;
  const search = (filters.search || '').toLowerCase();
  const dateFrom = filters.dateFrom;
  const dateTo = filters.dateTo;

  const data = invoices.filter((invoice) => {
    const matchesSearch = !search || [invoice.invoice_number, invoice.customer?.name, invoice.order?.order_number].join(' ').toLowerCase().includes(search);
    const matchesDateFrom = !dateFrom || invoice.invoice_date >= dateFrom;
    const matchesDateTo = !dateTo || invoice.invoice_date <= dateTo;
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.max(1, Math.ceil(data.length / limit));
  const slice = data.slice((page - 1) * limit, page * limit);

  return { data: slice, page, totalPages, total: data.length };
};

export { generateInvoice, getInvoiceById, getAllInvoices, invoices };
