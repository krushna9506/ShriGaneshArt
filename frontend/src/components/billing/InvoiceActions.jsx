import { useState } from 'react';
import { exportInvoicePDF } from '../../utils/pdfExport.js';

function InvoiceActions({ invoice }) {
  const [loading, setLoading] = useState(false);

  const handlePrint = () => window.print();

  const handleDownload = async () => {
    try {
      setLoading(true);
      await exportInvoicePDF('invoice-template', invoice?.invoice_number || 'invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="no-print flex flex-wrap gap-3 rounded-3xl border border-slate-200 bg-white p-4">
      <button onClick={handlePrint} className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950">Print</button>
      <button onClick={handleDownload} disabled={loading} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-500/20 transition-colors">
        {loading ? 'Generating PDF…' : 'Download PDF'}
      </button>
    </div>
  );
}

export default InvoiceActions;
