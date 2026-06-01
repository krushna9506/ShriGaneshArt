import { useState } from 'react';
import { exportInvoicePDF } from '../../utils/pdfExport.js';
import { regenerateInvoice, deleteInvoice } from '../../services/billingService.js';
import { useNavigate } from 'react-router-dom';

function InvoiceActions({ invoice, onRegenerate, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleRegenerate = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to regenerate this invoice?\n\nThis will refresh all items, quantities, pricing, and payments to match the current state of the order."
    );
    if (!confirmed) return;

    try {
      setRegenLoading(true);
      await regenerateInvoice(invoice.order_id);
      if (onRegenerate) {
        await onRegenerate();
      }
    } catch (err) {
      alert(err.message || 'Failed to regenerate invoice');
    } finally {
      setRegenLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this invoice?\n\nThis will remove the invoice snapshot record, but will NOT delete the underlying order or payment details."
    );
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await deleteInvoice(invoice.id);
      if (onDelete) {
        await onDelete();
      } else {
        navigate('/billing');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete invoice');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="no-print flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm w-full">
      <div className="flex flex-wrap gap-2.5">
        <button
          id="btn-print-invoice"
          onClick={handlePrint}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm active:scale-95 transition-all hover:bg-amber-500"
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
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-500/20 transition-colors active:scale-95 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          {loading ? 'Generating…' : 'Download PDF'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 border-t border-slate-100 pt-3">
        <button
          id="btn-regenerate-invoice"
          onClick={handleRegenerate}
          disabled={regenLoading}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-sky-500/30 bg-sky-500/10 px-4 py-2.5 text-sm font-bold text-sky-700 hover:bg-sky-500/20 transition-colors active:scale-95 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-4 h-4 ${regenLoading ? 'animate-spin' : ''}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {regenLoading ? 'Regenerating…' : 'Regenerate'}
        </button>
        <button
          id="btn-delete-invoice"
          onClick={handleDelete}
          disabled={deleteLoading}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-100 transition-colors active:scale-95 disabled:opacity-60"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          {deleteLoading ? 'Deleting…' : 'Delete Invoice'}
        </button>
      </div>
    </div>
  );
}

export default InvoiceActions;
