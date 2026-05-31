import { useEffect, useState } from 'react';
import { getInvoiceById } from '../services/billingService.js';

const useInvoice = (invoiceId) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refetch = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const data = await getInvoiceById(invoiceId);
      setInvoice(data);
      setError('');
    } catch (err) {
      setError('Unable to load invoice.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [invoiceId]);

  return { invoice, loading, error, refetch };
};

export default useInvoice;
