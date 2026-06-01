import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api.js';
import { generateInvoice, getAllInvoices, regenerateInvoice, deleteInvoice } from '../../services/billingService.js';

function BillingPage() {
  const [invoices, setInvoices] = useState({ data: [], totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await getAllInvoices({ page, search });
      setInvoices(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, [page, search]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Order load failed', err);
      }
    };
    loadOrders();
  }, [showModal]);

  const filteredOrders = useMemo(() => orders.filter((order) => [order.orderNumber, order.customerName].join(' ').toLowerCase().includes(orderSearch.toLowerCase())), [orders, orderSearch]);

  const handleGenerate = async (orderId) => {
    try {
      const result = await generateInvoice(orderId);
      setShowModal(false);
      window.location.href = `/billing/${result.id}`;
    } catch (err) {
      console.error('Invoice generation failed', err);
    }
  };

  const handleRegenerate = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to regenerate this invoice snapshot?\n\nThis will synchronize it with the latest order details and payments."
    );
    if (!confirmed) return;
    
    try {
      setLoading(true);
      await regenerateInvoice(orderId);
      await loadInvoices();
    } catch (err) {
      alert(err.message || 'Failed to regenerate invoice');
      setLoading(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this invoice snapshot?\n\nThis action cannot be undone and will remove it from the system."
    );
    if (!confirmed) return;
    
    try {
      setLoading(true);
      await deleteInvoice(invoiceId);
      await loadInvoices();
    } catch (err) {
      alert(err.message || 'Failed to delete invoice');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm w-full min-w-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Billing</h2>
            <p className="text-sm text-slate-600 font-medium mt-1">Generate invoice snapshots and review balances.</p>
          </div>
          <button onClick={() => setShowModal(true)} className="rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-sm active:scale-95 transition-all">Generate New Invoice</button>
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice / customer / order" className="w-full rounded-2xl border border-slate-350 bg-white px-4 py-2.5 text-sm text-slate-900 font-medium lg:max-w-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm w-full min-w-0">
        {loading ? (
          <div className="text-slate-600 font-bold text-center py-8">Loading invoices…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[650px] border-collapse">
              <thead className="text-slate-500 font-black uppercase tracking-wider text-xs border-b border-slate-100">
                <tr>
                  <th className="px-3 py-3">Invoice No</th>
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Total</th>
                  <th className="px-3 py-3">Balance</th>
                  <th className="px-3 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(invoices.data || []).map((invoice) => (
                  <tr key={invoice.id} className={`border-t font-bold hover:bg-slate-50/50 transition-colors ${
                    invoice.is_cancelled ? 'border-rose-100 bg-rose-50/10 text-rose-900' : 'border-slate-100 text-slate-800'
                  }`}>
                    <td className="px-3 py-4 text-slate-900">{invoice.invoice_number}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <span className={invoice.is_cancelled ? 'text-rose-950 font-extrabold' : 'text-slate-900 font-bold'}>
                          {invoice.customer?.name || 'Walk-in Customer'}
                        </span>
                        {invoice.is_cancelled && (
                          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-rose-800 border border-rose-200 shrink-0">
                            Cancelled / रद्द
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-slate-650">{invoice.invoice_date}</td>
                    <td className="px-3 py-4 text-slate-900">₹{Number(invoice.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-4 text-rose-600 font-extrabold">₹{Number(invoice.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <Link to={`/billing/${invoice.id}`} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-800 hover:border-amber-400 active:scale-95 transition-all shadow-sm">
                          View
                        </Link>
                        <button 
                          onClick={() => handleRegenerate(invoice.order_id)} 
                          title="Regenerate Snapshot"
                          className="rounded-xl border border-sky-200 bg-sky-50/50 px-2.5 py-1.5 text-sky-700 hover:bg-sky-100 hover:border-sky-300 active:scale-95 transition-all shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(invoice.id)} 
                          title="Delete Invoice"
                          className="rounded-xl border border-rose-205 bg-rose-50/40 px-2.5 py-1.5 text-rose-700 hover:bg-rose-100 hover:border-rose-350 active:scale-95 transition-all shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(invoices.data || []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-400 font-bold">No invoices recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {invoices.totalPages > 1 && (
          <div className="mt-4 flex gap-2">
            {Array.from({ length: invoices.totalPages || 1 }, (_, i) => i + 1).map((num) => (
              <button key={num} onClick={() => setPage(num)} className={`rounded-xl px-3.5 py-1.5 text-xs font-black transition-all ${page === num ? 'bg-amber-500 text-slate-950 shadow-sm' : 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50'}`}>{num}</button>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Generate invoice from order</h3>
              <button onClick={() => setShowModal(false)} className="rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-black text-slate-800 hover:bg-slate-50 active:scale-95 transition-all">Close</button>
            </div>
            <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} placeholder="Search by order number or customer" className="mt-4 w-full rounded-2xl border border-slate-350 bg-white px-4 py-2.5 text-sm text-slate-900 font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" />
            <div className="mt-4 max-h-72 space-y-3 overflow-auto p-1">
              {filteredOrders.map((order) => (
                <button key={order.id} onClick={() => handleGenerate(order.id)} className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-left text-sm text-slate-850 hover:bg-amber-50/50 hover:border-amber-300 transition-all flex flex-col gap-1 shadow-sm">
                  <p className="font-extrabold text-slate-900">{order.orderNumber}</p>
                  <p className="text-xs text-slate-500 font-medium">Customer: <span className="font-bold text-slate-700">{order.customerName}</span> · Status: <span className="font-bold text-slate-700">{order.status}</span></p>
                </button>
              ))}
              {filteredOrders.length === 0 && (
                <p className="text-center py-6 text-slate-400 font-bold text-xs">No active orders found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BillingPage;
