import { useParams } from 'react-router-dom';
import useInvoice from '../../hooks/useInvoice.js';
import InvoiceTemplate from '../../components/billing/InvoiceTemplate.jsx';
import InvoiceActions from '../../components/billing/InvoiceActions.jsx';

function InvoicePage() {
  const { id } = useParams();
  const { invoice, loading, error, refetch } = useInvoice(id);

  if (loading) return <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-700">Loading invoice…</div>;
  if (error || !invoice) return <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 font-medium">{error || 'Invoice not found.'}</div>;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.4fr]">
      <InvoiceTemplate invoice={invoice} />
      <div className="space-y-4 no-print">
        <InvoiceActions invoice={invoice} onRegenerate={refetch} />
        <div className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          Invoice is generated from the selected order and stored as a snapshot for future reference.
        </div>
      </div>
    </div>
  );
}

export default InvoicePage;
