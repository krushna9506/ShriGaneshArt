import { useState } from 'react';
import { exportInvoicePDF } from '../../utils/pdfExport.js';

function InvoiceActions({ invoice }) {
  const [loading, setLoading] = useState(false);

  const handlePrint = () => {
    // Add class to body before printing so CSS can hide app shell
    document.body.classList.add('printing-invoice');
    
    // Remove the class after print dialog closes (both on confirm or cancel)
    const cleanup = () => {
      document.body.classList.remove('printing-invoice');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    
    window.print();
  };

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
      <button
        id="btn-print-invoice"
        onClick={handlePrint}
        className="flex items-center gap-2 rounded-2xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.056 48.056 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
        </svg>
        Print Invoice
      </button>
      <button
        id="btn-download-invoice-pdf"
        onClick={handleDownload}
        disabled={loading}
        className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-500/20 transition-colors active:scale-95 disabled:opacity-60"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        {loading ? 'Generating PDF…' : 'Download PDF'}
      </button>
    </div>
  );
}

export default InvoiceActions;
