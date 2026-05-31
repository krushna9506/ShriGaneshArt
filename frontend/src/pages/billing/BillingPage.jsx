import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { generateInvoice, getAllInvoices } from '../../services/billingService.js';
import SecurityPinModal from '../../components/auth/SecurityPinModal.jsx';

function BillingPage() {
  const [invoices, setInvoices] = useState({ data: [], totalPages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Secure PIN variables
  const [isPinUnlocked, setIsPinUnlocked] = useState(sessionStorage.getItem('ganesha_pin_unlocked') === 'true');
  const [showPinModal, setShowPinModal] = useState(false);

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
    if (isPinUnlocked) {
      loadInvoices();
    }
  }, [page, search, isPinUnlocked]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await import('../../services/api.js').then((m) => m.default.get('/orders'));
        setOrders(data);
      } catch (err) {
        console.error('Order load failed', err);
      }
    };
    if (isPinUnlocked) {
      loadOrders();
    }
  }, [isPinUnlocked]);

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

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Billing</h2>
            <p className="text-sm text-slate-600 font-medium mt-1">Generate invoice snapshots and review balances.</p>
          </div>
          <button onClick={() => {
            if (!isPinUnlocked) {
              setShowPinModal(true);
            } else {
              setShowModal(true);
            }
          }} className="rounded-2xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-sm active:scale-95 transition-all">Generate New Invoice</button>
        </div>
        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice / customer / order" className="w-full rounded-2xl border border-slate-350 bg-white px-4 py-2.5 text-sm text-slate-900 font-medium lg:max-w-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all" />
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {!isPinUnlocked ? (
          <div className="text-center py-12 flex flex-col items-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Invoice Registry Protected</h4>
            <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">All sales statements, customer invoice listings, and balances are secure. Verify your PIN to enter.</p>
            <button type="button" onClick={() => setShowPinModal(true)} className="mt-5 rounded-2xl bg-amber-500 px-6 py-3 text-xs font-black text-slate-950 shadow-md shadow-amber-500/10 active:scale-95 transition-all">Verify Security PIN</button>
          </div>
        ) : loading ? (
          <div className="text-slate-600 font-bold text-center py-8">Loading invoices…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm min-w-[650px] border-collapse">
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
                  <tr key={invoice.id} className="border-t border-slate-100 text-slate-800 font-bold hover:bg-slate-50/50 transition-colors">
                    <td className="px-3 py-4 text-slate-900">{invoice.invoice_number}</td>
                    <td className="px-3 py-4 text-slate-900">{invoice.customer?.name}</td>
                    <td className="px-3 py-4 text-slate-600">{invoice.invoice_date}</td>
                    <td className="px-3 py-4 text-slate-900">₹{Number(invoice.total_amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-4 text-rose-600 font-extrabold">₹{Number(invoice.balance_due || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-4">
                      <Link to={`/billing/${invoice.id}`} className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-black text-slate-800 hover:border-amber-400 active:scale-95 transition-all shadow-sm">
                        View
                      </Link>
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

        {isPinUnlocked && invoices.totalPages > 1 && (
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

      {showPinModal && (
        <SecurityPinModal
          onSuccess={() => {
            setIsPinUnlocked(true);
            setShowPinModal(false);
          }}
          onCancel={() => setShowPinModal(false)}
        />
      )}
    </div>
  );
}

export default BillingPage;
