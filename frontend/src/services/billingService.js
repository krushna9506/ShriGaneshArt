import api from './api.js';

const generateInvoice = async (orderId) => {
  const { data } = await api.post(`/billing/generate/${orderId}`);
  return data.data;
};

const regenerateInvoice = async (orderId) => {
  const { data } = await api.post(`/billing/regenerate/${orderId}`);
  return data.data;
};

const deleteInvoice = async (invoiceId) => {
  const { data } = await api.delete(`/billing/${invoiceId}`);
  return data.data;
};

const getInvoiceById = async (invoiceId) => {
  const { data } = await api.get(`/billing/${invoiceId}`);
  return data.data;
};

const getAllInvoices = async (params = {}) => {
  const { data } = await api.get('/billing', { params });
  return data.data;
};

export { generateInvoice, regenerateInvoice, deleteInvoice, getInvoiceById, getAllInvoices };
