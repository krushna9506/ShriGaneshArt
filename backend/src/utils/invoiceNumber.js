const generateInvoiceNumber = (invoices = [], date = new Date()) => {
  const year = date.getFullYear();
  const sameYear = invoices.filter((invoice) => String(invoice.invoice_number || '').startsWith(`GA-${year}-`));
  const next = sameYear.length + 1;
  return `GA-${year}-${String(next).padStart(4, '0')}`;
};

export { generateInvoiceNumber };
