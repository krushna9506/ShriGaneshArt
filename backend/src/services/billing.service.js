import { generateInvoiceNumber } from '../utils/invoiceNumber.js';
import { customers, invoices, models, orders, payments, saveInvoices } from '../data/store.js';

const findOrder = (orderId) => orders.find((order) => String(order.id) === String(orderId));
const findCustomer = (customerId) => customers.find((customer) => String(customer.id) === String(customerId));

const generateInvoice = (orderId) => {
  const order = findOrder(orderId);
  if (!order) throw new Error('Order not found');

  const existing = invoices.find(inv => String(inv.order_id) === String(orderId));
  if (existing) {
    return getInvoiceById(existing.id);
  }

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

  const orderPayments = payments.filter(p => String(p.orderId) === String(order.id));
  const totalPaid = orderPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const invoice = {
    id: String(Date.now()),
    invoice_number: invoiceNumber,
    order_id: order.id,
    customer_id: customer?.id,
    invoice_date: new Date().toLocaleDateString('sv'),
    items,
    subtotal,
    total_amount: totalAmount,
    advance_paid: totalPaid,
    balance_due: Math.max(0, totalAmount - totalPaid),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    order,
    customer,
    models,
    payments: orderPayments
  };

  invoices.push(invoice);
  saveInvoices(); // Persist generated invoice dynamically to Neon cloud
  return invoice;
};

const getInvoiceById = (invoiceId) => {
  const invoice = invoices.find((invoice) => String(invoice.id) === String(invoiceId));
  if (!invoice) return null;

  const order = orders.find(o => String(o.id) === String(invoice.order_id));
  const customer = customers.find(c => String(c.id) === String(invoice.customer_id || order?.customerId));
  const orderPayments = payments.filter(p => String(p.orderId) === String(invoice.order_id));
  
  const totalPaid = orderPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const balanceDue = Math.max(0, Number(invoice.total_amount || 0) - totalPaid);

  return {
    ...invoice,
    order,
    customer,
    payments: orderPayments,
    advance_paid: totalPaid,
    balance_due: balanceDue
  };
};

const getAllInvoices = (filters = {}) => {
  const page = Number(filters.page || 1);
  const limit = 10;
  const search = (filters.search || '').toLowerCase();
  const dateFrom = filters.dateFrom;
  const dateTo = filters.dateTo;

  const populatedInvoices = invoices.map(invoice => {
    const order = orders.find(o => String(o.id) === String(invoice.order_id));
    const customer = customers.find(c => String(c.id) === String(invoice.customer_id || order?.customerId));
    const orderPayments = payments.filter(p => String(p.orderId) === String(invoice.order_id));
    const totalPaid = orderPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    return {
      ...invoice,
      order,
      customer,
      advance_paid: totalPaid,
      balance_due: Math.max(0, Number(invoice.total_amount || 0) - totalPaid)
    };
  });

  const data = populatedInvoices.filter((invoice) => {
    const matchesSearch = !search || [invoice.invoice_number, invoice.customer?.name, invoice.order?.orderNumber].join(' ').toLowerCase().includes(search);
    const matchesDateFrom = !dateFrom || invoice.invoice_date >= dateFrom;
    const matchesDateTo = !dateTo || invoice.invoice_date <= dateTo;
    return matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalPages = Math.max(1, Math.ceil(data.length / limit));
  const slice = data.slice((page - 1) * limit, page * limit);

  return { data: slice, page, totalPages, total: data.length };
};

export { generateInvoice, getInvoiceById, getAllInvoices, invoices };
