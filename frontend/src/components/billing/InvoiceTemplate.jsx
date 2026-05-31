import InvoiceTable from './InvoiceTable.jsx';
import logo from '../../assets/logo.png';

function InvoiceTemplate({ invoice }) {
  if (!invoice) return null;

  // Utility to clean up database string representations of null
  const cleanValue = (val) => {
    if (!val) return '';
    const s = String(val).trim();
    if (s === 'NULL' || s === 'null' || s === 'undefined' || s === 'None' || s === '-') return '';
    return s;
  };

  const customerName = cleanValue(invoice.customer?.name || invoice.order?.customerName);
  const customerMobile = cleanValue(invoice.customer?.mobile || invoice.order?.mobile);
  const customerAddress = cleanValue(invoice.customer?.address || invoice.order?.address);
  const customerCity = cleanValue(invoice.customer?.city || invoice.order?.city);

  // Formatting helper for currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(Number(amount || 0));
  };

  const ITEMS_PER_PAGE = 12;
  const items = invoice.items || [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;

  return (
    // Outer scroll wrapper — on mobile this lets user scroll the fixed-width invoice
    <div className="invoice-scroll-wrapper">
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const pageItems = items.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
        const pageModelsCount = pageItems.length;
        const pageQtySum = pageItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        const pageAmountSum = pageItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const isLastPage = pageIndex === totalPages - 1;

        return (
          <div 
            key={pageIndex}
            id="invoice-template" 
            className="invoice-printable"
            style={{ fontFamily: "'Outfit', 'Noto Sans Devanagari', 'Inter', sans-serif" }}
          >
            <div>
              {/* 1. Top Invocation Row */}
              <div className="flex flex-wrap justify-between items-center border-b-2 border-rose-800 pb-2 gap-2 text-xs font-black">
                <div className="border border-rose-800 rounded-full px-4 py-1 bg-rose-50 text-rose-800 font-bold print:bg-transparent">
                  प्रो. डोंगे बंधू / Proprietor: Donge Brothers
                </div>
                <div className="text-center tracking-widest text-rose-800">
                  ॥ श्री गजानन प्रसन्न ॥
                </div>
                <div className="border border-rose-800 rounded-lg px-3 py-1 bg-rose-50/50 text-rose-800 font-bold tracking-wider print:bg-transparent">
                  कॅश/क्रेडिट मेमो / Cash/Credit Memo
                </div>
              </div>

              {/* 2. Main Brand Header */}
              <div className="mt-4 flex flex-row justify-between items-center gap-4 border-b-4 border-double border-rose-800 pb-4">
                {/* Left Side: Ganesha Brand Logo */}
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl border-2 border-rose-800 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden relative flex items-center justify-center shadow-sm print:shadow-none">
                    <img src={logo} alt="Shri Ganesh Art Logo" className="absolute inset-0 w-full h-full object-contain p-1" />
                  </div>
                </div>

                {/* Center: Title and Address */}
                <div className="flex-1 text-center">
                  <h1 className="text-3xl font-extrabold text-rose-800 tracking-tight">
                    श्री गणेश आर्ट <span className="text-xl font-black text-rose-700 ml-2">/ SHRI GANESH ART</span>
                  </h1>
                  <p className="mt-2 text-xs font-extrabold text-rose-900 leading-snug">
                    यादव नगर, साईकमल हॉटेल समोर, संभाजीनगर बायपास रोड, धाराशिव - ४१३५०१
                  </p>
                  <p className="text-[10px] font-bold text-rose-700 leading-snug">
                    Yadav Nagar, Opposite Saikamal Hotel, Sambhajinagar Bypass Road, Dharashiv - 413501
                  </p>
                </div>

                {/* Right Side: Contact Info */}
                <div className="text-right text-xs font-bold text-rose-800">
                  <p className="text-rose-700 uppercase tracking-wider text-[10px]">मोबाईल नं. / Mobile No:</p>
                  <p className="text-base font-black text-rose-900 mt-0.5">9423734355</p>
                  <p className="text-base font-black text-rose-900">9922743650</p>
                </div>
              </div>

              {/* 3. Slogan Banner */}
              <div className="mt-2 border-b-2 border-rose-800 bg-rose-50/50 py-1.5 px-4 text-center text-xs font-extrabold text-rose-800 rounded-lg print:bg-transparent">
                आमच्याकडे सर्व प्रकारचे लहान मोठे श्री गणेश मुर्ती ठोक व किरकोळ योग्य भावात मिळेल. <br />
                <span className="text-[10px] font-semibold text-rose-700">All types of Ganesha Idols available in wholesale & retail at reasonable rates.</span>
              </div>

              {/* 4. Customer & Invoice Details */}
              <div className="mt-4 grid grid-cols-3 gap-4 border-b-2 border-rose-800 pb-4">
                {/* Customer fields */}
                <div className="col-span-2 space-y-2.5">
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-400 pb-0.5">
                    <span className="text-xs font-black text-rose-800 min-w-[100px] shrink-0">नांव / Name:</span>
                    <span className="text-sm font-extrabold text-slate-800">{customerName || 'Valued Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-400 pb-0.5">
                    <span className="text-xs font-black text-rose-800 min-w-[100px] shrink-0">पत्ता / Address:</span>
                    <span className="text-sm font-semibold text-slate-800">
                      {[customerAddress, customerCity].filter(Boolean).join(', ') || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-400 pb-0.5">
                    <span className="text-xs font-black text-rose-800 min-w-[100px] shrink-0">मोबाईल / Mob:</span>
                    <span className="text-sm font-bold text-slate-800">{customerMobile || '—'}</span>
                  </div>
                </div>

                {/* Invoice Metadata block */}
                <div className="bg-rose-50/40 border border-rose-800 rounded-2xl p-3 flex flex-col justify-between text-xs font-bold text-rose-800 print:bg-transparent">
                  <div className="flex justify-between items-center">
                    <span>नं. / Memo No:</span>
                    <span className="text-sm font-extrabold text-rose-900">{invoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-rose-200 pt-2">
                    <span>दिनांक / Date:</span>
                    <span className="text-sm font-extrabold text-rose-900">{invoice.invoice_date}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span>डिलिव्हरी / Delivery:</span>
                    <span className="text-xs font-semibold text-rose-800">{invoice.order?.deliveryDate || '—'}</span>
                  </div>
                </div>
              </div>

              {/* 5. Items Table for current page chunk */}
              <div className="mt-4">
                <InvoiceTable items={pageItems} startIndex={pageIndex * ITEMS_PER_PAGE} />
              </div>
            </div>

            <div>
              {/* 6. Page-Specific Totals */}
              <div className="mt-4 border-2 border-dashed border-rose-800 rounded-2xl p-4 bg-rose-50/10 flex flex-wrap justify-between gap-4 text-xs font-bold text-rose-800 print:bg-transparent">
                <div>
                  या पानावरील एकूण मॉडेल्स / Models on this page: <span className="text-sm font-extrabold text-rose-955 ml-1">{pageModelsCount}</span>
                </div>
                <div>
                  या पानावरील एकूण नग / Qty on this page: <span className="text-sm font-extrabold text-rose-955 ml-1">{pageQtySum}</span>
                </div>
                <div>
                  या पानावरील एकूण रक्कम / Bill on this page: <span className="text-sm font-extrabold text-rose-955 ml-1">{formatCurrency(pageAmountSum)}</span>
                </div>
              </div>

              {/* 7. Cumulative Totals and Slogans (ONLY on the last page) */}
              {isLastPage && (
                <div className="grid grid-cols-2 gap-4 items-end mt-4">
                  {/* Payments / Installments History */}
                  <div className="text-left space-y-2">
                    <div className="border border-rose-800 rounded-2xl p-3 bg-rose-50/20 text-[11px] font-bold text-rose-800 print:bg-transparent print:border-rose-800">
                      <h4 className="font-extrabold text-rose-955 border-b border-rose-200 pb-1 mb-1.5 uppercase tracking-wider text-xs">भरणा तपशील / Payment Installments:</h4>
                      {invoice.payments && invoice.payments.length > 0 ? (
                        <div className="space-y-1 max-h-24 overflow-y-auto">
                          {invoice.payments.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-slate-800 border-b border-rose-100 last:border-none pb-0.5 last:pb-0">
                              <span>{p.paymentDate || p.payment_date || '—'} · {p.mode}</span>
                              <span className="font-extrabold text-rose-900">₹{Number(p.amount).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-500 italic font-semibold text-[10px]">No payments recorded yet.</div>
                      )}
                    </div>
                    <div className="text-left text-xs font-bold text-rose-700 italic pl-1">
                      भगवान गणेश आपल्या घरी सुख, समृद्धी आणि आनंद घेऊन येवोत! 🙏
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 text-xs font-bold text-rose-800">
                    <div className="w-full max-w-sm space-y-1.5 border-2 border-rose-800 rounded-2xl p-4 bg-rose-50/20 print:bg-transparent">
                      <div className="flex justify-between text-rose-900 font-bold border-b border-rose-200 pb-1">
                        <span>एकूण / Total Amount:</span>
                        <span className="text-sm font-black text-rose-950">{formatCurrency(invoice.total_amount)}</span>
                      </div>
                      <div className="flex justify-between text-rose-800 font-bold border-b border-rose-200 pb-1">
                        <span>भरलेले एकूण / Total Paid:</span>
                        <span className="text-sm font-extrabold text-rose-900">{formatCurrency(invoice.advance_paid)}</span>
                      </div>
                      <div className={`flex justify-between font-black text-sm pt-0.5 rounded-lg ${
                        Number(invoice.balance_due || 0) > 0 ? 'text-rose-700' : 'text-emerald-700'
                      }`}>
                        <span>बाकी / Balance Due:</span>
                        <span className="text-base font-black">{formatCurrency(invoice.balance_due)}</span>
                      </div>
                    </div>

                    {Number(invoice.balance_due || 0) === 0 ? (
                      <span className="inline-flex items-center rounded-xl bg-emerald-100 border-2 border-emerald-300 px-4 py-0.5 text-xs font-black uppercase tracking-widest text-emerald-800 scale-105 print:border-2 print:border-emerald-600 print:text-emerald-700 print:bg-transparent">
                        ✔ FULLY PAID / पूर्ण भरणा
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-xl bg-amber-100 border-2 border-amber-300 px-4 py-0.5 text-xs font-black uppercase tracking-widest text-amber-800 print:border-2 print:border-amber-600 print:text-amber-700 print:bg-transparent">
                        ⏳ BALANCE DUE / बाकी देणे
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 8. Terms Notes (ONLY on the last page) */}
              {isLastPage && (
                <div className="mt-4 border-t-2 border-rose-800 pt-4 text-[10px] text-rose-800 leading-relaxed font-semibold">
                  <div className="space-y-1">
                    <p className="font-extrabold text-rose-955 uppercase tracking-wider mb-1 text-xs">नम्र सुचना / Kindly Note:</p>
                    <p>१) एकदा विकलेला माल परत घेतला जाणार नाही. / 1. Goods once sold will not be taken back.</p>
                    <p>२) मुर्ती पाहून घेणे. मुर्तीची मोडतोड झाल्यास श्री गणेश आर्ट त्यास जबाबदार नाही. / 2. Please check the idol thoroughly. Shri Ganesh Art is not responsible for any damage or breakage afterwards.</p>
                    <p>३) मुर्ती नेण्याची जबाबदारी शक्यतो स्वतः वाहनाबरोबर असावे. / 3. The responsibility of carrying the idol should preferably be with your own vehicle.</p>
                    <p>४) चूक भूल देणे घ्यावी. / 4. Errors and omissions excepted.</p>
                  </div>
                </div>
              )}

              {/* 9. Signatures Block and Page Indicator (On EVERY page) */}
              <div className="mt-6 border-t border-rose-200 pt-4 flex justify-between items-end text-[10px] text-rose-800 leading-relaxed font-bold">
                <div className="text-center w-36">
                  <div className="h-10"></div>
                  <div className="border-b border-rose-800"></div>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-rose-800">ऑर्डर दे. सही<br />Customer Signature</p>
                </div>
                
                {/* Page Number indicator in Devanagari & English */}
                <div className="text-center text-xs font-black text-rose-700 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200 print:bg-transparent">
                  पाने {pageIndex + 1} पैकी {totalPages} / Page {pageIndex + 1} of {totalPages}
                </div>

                <div className="text-center w-48">
                  <div className="h-10"></div>
                  <div className="border-b border-rose-800"></div>
                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-rose-800">श्री गणेश आर्ट करिता<br />For Shri Ganesh Art</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {styleTag}
    </div> /* end invoice-scroll-wrapper */
  );
}

const styleTag = (
  <style>{`
    /* ── Scroll wrapper: centres the A4 page on any screen ── */
    .invoice-scroll-wrapper {
      overflow-x: auto;
      overflow-y: visible;
      -webkit-overflow-scrolling: touch;
      background: #f1f5f9;
      padding: 16px 8px;
    }

    /* ── Fixed A4 page: never reflows ── */
    .invoice-printable {
      width: 794px;          /* 210mm at 96 dpi */
      min-height: 1123px;    /* 297mm at 96 dpi */
      margin: 0 auto 24px auto;
      background: #ffffff;
      border: 2px solid #881337;
      border-radius: 16px;
      padding: 24px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #881337;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    /* ── Print / PDF ── */
    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      body, html {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
      }
      .invoice-scroll-wrapper {
        background: transparent !important;
        padding: 0 !important;
        overflow: visible !important;
      }
      .no-print {
        display: none !important;
      }
      .invoice-printable {
        width: 210mm !important;
        min-height: 297mm !important;
        height: 297mm !important;
        margin: 0 !important;
        padding: 10mm !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        page-break-after: always;
        border: 2px solid #881337 !important;
      }
    }

    @page {
      size: A4 portrait;
      margin: 0;
    }
  `}</style>
);

export default InvoiceTemplate;
