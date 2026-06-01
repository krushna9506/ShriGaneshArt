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

  // Helper to dynamically correct common spelling errors like "Dharahsiv"
  const cleanAddressPart = (val) => {
    const s = cleanValue(val);
    if (s.toLowerCase() === 'dharahsiv') return 'Dharashiv';
    return s;
  };

  const customerName = cleanValue(invoice.customer?.name || invoice.order?.customerName);
  const customerMobile = cleanValue(invoice.customer?.mobile || invoice.order?.mobile);
  
  const customerAddress = cleanAddressPart(invoice.customer?.address || invoice.order?.address);
  const customerCity = cleanAddressPart(invoice.customer?.city || invoice.order?.city);

  // Deduplicate address parts so city is not repeated (e.g. "Dharashiv, Dharashiv" becomes just "Dharashiv")
  const formattedAddress = [customerAddress, customerCity].filter(Boolean).reduce((acc, current) => {
    if (acc.toLowerCase().includes(current.toLowerCase())) return acc;
    return acc ? `${acc}, ${current}` : current;
  }, '');

  // Formatting helper for currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(Number(amount || 0));
  };

  const ITEMS_PER_PAGE = 30; // Max 30 models on a single page to fit signature blocks and totals beautifully
  const items = invoice.items || [];
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE) || 1;

  return (
    // Outer scroll wrapper — on mobile this lets user scroll the fixed-width invoice
    <div id="invoice-template" className="invoice-scroll-wrapper">
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const pageItems = items.slice(pageIndex * ITEMS_PER_PAGE, (pageIndex + 1) * ITEMS_PER_PAGE);
        const pageModelsCount = pageItems.length;
        const pageQtySum = pageItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
        const pageAmountSum = pageItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const isLastPage = pageIndex === totalPages - 1;

        return (
          <div 
            key={pageIndex}
            className="invoice-printable"
            style={{ fontFamily: "'Outfit', 'Noto Sans Devanagari', 'Inter', sans-serif" }}
          >
            <div>
              {/* 1. Top Invocation Row (Compressed font size) */}
              <div className="flex flex-wrap justify-between items-center border-b border-rose-800 pb-1 gap-1 text-[9px] font-black">
                <div className="border border-rose-800 rounded-full px-2 py-0.5 bg-rose-50 text-rose-800 font-bold print:bg-transparent">
                  प्रो. डोंगे बंधू / Proprietor: Donge Brothers
                </div>
                <div className="text-center tracking-widest text-rose-850">
                  ॥ श्री गजानन प्रसन्न ॥
                </div>
                <div className="border border-rose-800 rounded-lg px-2 py-0.5 bg-rose-50/50 text-rose-800 font-bold tracking-wider print:bg-transparent">
                  कॅश/क्रेडिट मेमो / Cash/Credit Memo
                </div>
              </div>

              {/* 2. Main Brand Header (Extremely space-saving) */}
              <div className="mt-1 flex flex-row justify-between items-center gap-2 border-b-2 border-double border-rose-800 pb-1">
                {/* Left Side: Ganesha Brand Logo artwork (Smaller profile h-9 w-9) */}
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg border border-rose-800 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden relative flex items-center justify-center shadow-sm print:shadow-none">
                    <img src={logo} alt="Shri Ganesh Art Logo" className="absolute inset-0 w-full h-full object-contain p-0.5" />
                  </div>
                </div>

                {/* Center: Title and Address */}
                <div className="flex-1 text-center">
                  <h1 className="text-lg font-extrabold text-rose-800 tracking-tight leading-none">
                    श्री गणेश आर्ट <span className="text-[11px] font-black text-rose-700 ml-1">/ SHRI GANESH ART</span>
                  </h1>
                  <p className="mt-0.5 text-[9px] font-extrabold text-rose-900 leading-none">
                    यादव नगर, संभाजीनगर बायपास रोड, धाराशिव - ४१३५०१ · Yadav Nagar, Bypass Road, Dharashiv
                  </p>
                </div>

                {/* Right Side: Contact Info */}
                <div className="text-right text-[9px] font-bold text-rose-800 leading-none space-y-0.5">
                  <p className="text-rose-700 uppercase tracking-wider text-[7.5px] font-black">मोबाईल नं. / Mobile:</p>
                  <p className="font-black text-rose-900">9423734355 · 9922743650</p>
                </div>
              </div>

              {/* 3. Slogan Banner (Highly compressed) */}
              <div className="mt-1 border-b border-rose-800 bg-rose-50/50 py-0.5 px-3 text-center text-[9px] font-extrabold text-rose-800 rounded-lg print:bg-transparent leading-none">
                आमच्याकडे सर्व प्रकारचे लहान मोठे श्री गणेश मुर्ती ठोक व किरकोळ योग्य भावात मिळेल. · <span className="text-[8px] font-semibold text-rose-700">All Ganesha Idols available wholesale & retail.</span>
              </div>

              {/* 4. Customer & Invoice Details (Ultra-compact margins) */}
              <div className="mt-1.5 grid grid-cols-3 gap-2.5 border-b border-rose-800 pb-1.5">
                {/* Customer fields */}
                <div className="col-span-2 space-y-0.5 text-[11px]">
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-350 pb-0.5">
                    <span className="text-[10px] font-black text-rose-800 min-w-[70px] shrink-0">नांव / Name:</span>
                    <span className="font-extrabold text-slate-800 leading-none">{customerName || 'Valued Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-350 pb-0.5">
                    <span className="text-[10px] font-black text-rose-800 min-w-[70px] shrink-0">पत्ता / Address:</span>
                    <span className="font-semibold text-slate-800 leading-none">
                      {formattedAddress || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-350 pb-0.5">
                    <span className="text-[10px] font-black text-rose-800 min-w-[70px] shrink-0">मोबाईल / Mob:</span>
                    <span className="font-bold text-slate-800 leading-none">{customerMobile || '—'}</span>
                  </div>
                </div>

                {/* Invoice Metadata block */}
                <div className="bg-rose-50/30 border border-rose-800 rounded-lg p-1.5 flex flex-col justify-between text-[9px] font-bold text-rose-800 print:bg-transparent">
                  <div className="flex justify-between items-center">
                    <span>नं. / Memo No:</span>
                    <span className="font-black text-rose-900">{invoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5 border-t border-rose-200 pt-0.5">
                    <span>बुकिंग / Booking:</span>
                    <span className="text-[8px] font-semibold text-rose-850">{invoice.order?.orderDate || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5 border-t border-rose-100 pt-0.5">
                    <span>बिल दिनांक / Date:</span>
                    <span className="font-black text-rose-900">{invoice.invoice_date}</span>
                  </div>
                </div>
              </div>

              {/* 5. Items Table (Very tight margin) */}
              <div className="mt-2">
                <InvoiceTable items={pageItems} startIndex={pageIndex * ITEMS_PER_PAGE} />
              </div>
            </div>

            <div>
              {/* 6. Page-Specific Totals */}
              <div className="mt-1 border border-dashed border-rose-800 rounded-lg p-1.5 bg-rose-50/10 flex flex-wrap justify-between gap-2 text-[9px] font-bold text-rose-800 print:bg-transparent">
                <div>
                  या पानावरील एकूण मॉडेल्स: <span className="font-extrabold text-rose-955 ml-0.5">{pageModelsCount}</span>
                </div>
                <div>
                  या पानावरील एकूण नग: <span className="font-extrabold text-rose-955 ml-0.5">{pageQtySum}</span>
                </div>
                <div>
                  या पानावरील एकूण रक्कम: <span className="font-extrabold text-rose-955 ml-0.5">{formatCurrency(pageAmountSum)}</span>
                </div>
              </div>

              {/* 7. Cumulative Totals and Slogans (ONLY on the last page) */}
              {isLastPage && (
                <div className="grid grid-cols-2 gap-2.5 items-end mt-1.5">
                  {/* Payments / Installments History */}
                  <div className="text-left space-y-1">
                    <div className="border border-rose-800 rounded-lg p-1.5 bg-rose-50/20 text-[9px] font-bold text-rose-800 print:bg-transparent print:border-rose-800">
                      <h4 className="font-extrabold text-rose-955 border-b border-rose-200 pb-0.5 mb-1 uppercase tracking-wider text-[8px]">भरणा तपशील / Payments:</h4>
                      {invoice.payments && invoice.payments.length > 0 ? (
                        <div className="space-y-0.5">
                          {invoice.payments.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-slate-800 border-b border-rose-100 last:border-none pb-0.5 last:pb-0">
                              <span>{p.paymentDate || p.payment_date || '—'} · {p.mode}</span>
                              <span className="font-extrabold text-rose-900">₹{Number(p.amount).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-500 italic font-semibold text-[8px]">No payments recorded yet.</div>
                      )}
                    </div>
                    <div className="text-left text-[8px] font-bold text-rose-700 italic pl-0.5">
                      भगवान गणेश आपल्या घरी सुख, समृद्धी आणि आनंद घेऊन येवोत! 🙏
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 text-[9px] font-bold text-rose-800">
                    <div className="w-full max-w-[240px] space-y-0.5 border border-rose-800 rounded-lg p-1.5 bg-rose-50/20 print:bg-transparent">
                      <div className="flex justify-between text-rose-900 font-bold border-b border-rose-200 pb-0.5">
                        <span>एकूण / Total Amount:</span>
                        <span className="font-black text-rose-955">{formatCurrency(invoice.total_amount)}</span>
                      </div>
                      <div className="flex justify-between text-rose-850 font-bold border-b border-rose-200 pb-0.5">
                        <span>भरलेले एकूण / Total Paid:</span>
                        <span className="font-extrabold text-rose-900">{formatCurrency(invoice.advance_paid)}</span>
                      </div>
                      <div className={`flex justify-between font-black pt-0.5 rounded ${
                        Number(invoice.balance_due || 0) > 0 ? 'text-rose-750' : 'text-emerald-700'
                      }`}>
                        <span>बाकी / Balance Due:</span>
                        <span className="text-[11px] font-black">{formatCurrency(invoice.balance_due)}</span>
                      </div>
                    </div>

                    {Number(invoice.balance_due || 0) === 0 ? (
                      <span className="inline-flex items-center rounded bg-emerald-100 border border-emerald-350 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-emerald-800 print:bg-transparent">
                        ✔ FULLY PAID / पूर्ण भरणा
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded bg-amber-100 border border-amber-350 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-amber-800 print:bg-transparent">
                        ⏳ BALANCE DUE / बाकी देणे
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* 8. Terms Notes (ONLY on the last page) */}
              {isLastPage && (
                <div className="mt-1.5 border-t border-rose-850 pt-1.5 text-[7.5px] text-rose-800 leading-tight font-semibold">
                  <div className="space-y-0">
                    <p className="font-extrabold text-rose-955 uppercase tracking-wider mb-0.5 text-[8px]">नम्र सुचना / Kindly Note:</p>
                    <p>१) एकदा विकलेला माल परत घेतला जाणार नाही. / 1. Goods once sold will not be taken back.</p>
                    <p>२) मुर्ती पाहून घेणे. मुर्तीची मोडतोड झाल्यास श्री गणेश आर्ट त्यास जबाबदार नाही. / 2. Shri Ganesh Art is not responsible for breakage after checking.</p>
                    <p>३) मुर्ती नेण्याची जबाबदारी स्वतः असावे. / 3. Carry the idol under your own supervision.</p>
                    <p>४) भूल देणे घ्यावी. / 4. E. & O. E.</p>
                  </div>
                </div>
              )}

              {/* 9. Signatures Block and Page Indicator (On EVERY page) */}
              <div className="mt-2 border-t border-rose-200 pt-1.5 flex justify-between items-end text-[7.5px] text-rose-800 leading-none font-bold">
                <div className="text-center w-28">
                  <div className="h-3.5"></div>
                  <div className="border-b border-rose-800"></div>
                  <p className="mt-0.5 text-[7.5px] font-bold uppercase tracking-wider text-rose-800">ऑर्डर दे. सही<br />Customer Signature</p>
                </div>
                
                {/* Page Number indicator */}
                <div className="text-center text-[9px] font-black text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 print:bg-transparent">
                  पाने {pageIndex + 1} पैकी {totalPages} / Page {pageIndex + 1} of {totalPages}
                </div>

                <div className="text-center w-36">
                  <div className="h-3.5"></div>
                  <div className="border-b border-rose-800"></div>
                  <p className="mt-0.5 text-[7.5px] font-bold uppercase tracking-wider text-rose-800">श्री गणेश आर्ट करिता<br />For Shri Ganesh Art</p>
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

    /* ── Fixed A4 page on SCREEN: never reflows ── */
    @media screen {
      .invoice-printable {
        width: 794px;          /* 210mm at 96 dpi */
        min-height: 1123px;    /* 297mm at 96 dpi */
        margin: 0 auto 16px auto;
        background: #ffffff;
        border: 2px solid #881337;
        border-radius: 12px;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #881337;
        box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      }
    }
  `}</style>
);

export default InvoiceTemplate;
