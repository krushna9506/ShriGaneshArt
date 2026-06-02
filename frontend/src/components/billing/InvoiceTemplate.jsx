import InvoiceTable from './InvoiceTable.jsx';
import logo from '../../assets/logo.png';
import './invoice-print.css';

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
              <div className="invoice-top-row flex flex-wrap justify-between items-center border-b border-rose-800 pb-1 gap-1 font-black">
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

              {/* 2. Main Brand Header */}
              <div className="invoice-brand-header flex flex-row justify-between items-center gap-3 border-b-2 border-double border-rose-800 pb-2">
                {/* Left Side: Ganesha Brand Logo artwork */}
                <div className="flex items-center gap-3">
                  <div className="invoice-brand-logo-container rounded-xl border border-rose-800 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden relative flex items-center justify-center shadow-sm print:shadow-none">
                    <img src={logo} alt="Shri Ganesh Art Logo" className="absolute inset-0 w-full h-full object-contain p-0.5" />
                  </div>
                </div>

                {/* Center: Title and Address */}
                <div className="flex-1 text-center">
                  <h1 className="invoice-brand-title font-extrabold text-rose-800 tracking-tight leading-none">
                    श्री गणेश आर्ट <span className="text-sm font-black text-rose-700 ml-1">/ SHRI GANESH ART</span>
                  </h1>
                  <p className="invoice-brand-address font-extrabold text-rose-900 leading-none">
    
    /* Print rules moved to invoice-print.css to avoid parser issues during build */
                    यादव नगर, संभाजीनगर बायपास रोड, धाराशिव - ४१३५०१ · Yadav Nagar, Bypass Road, Dharashiv, 413501
                  </p>
                </div>

                {/* Right Side: Contact Info */}
                <div className="invoice-brand-contact text-right font-bold text-rose-800 leading-tight">
                  <p className="text-rose-700 uppercase tracking-wider font-black">मोबाईल नं. / Mobile:</p>
                  <p className="font-black text-rose-900 mt-0.5">9423734355 · 9922743650</p>
                </div>
              </div>

              {/* 3. Slogan Banner (Legible and space-optimized) */}
              <div className="invoice-slogan-banner border-b border-rose-800 bg-rose-50/50 text-center font-extrabold text-rose-800 rounded-lg print:bg-transparent leading-none">
                आमच्याकडे सर्व प्रकारचे लहान मोठे श्री गणेश मुर्ती ठोक व किरकोळ योग्य भावात मिळेल. · <span className="font-semibold text-rose-700 text-[0.9em]">All Ganesha Idols available wholesale & retail.</span>
              </div>

              {/* 4. Customer & Invoice Details */}
              <div className="invoice-customer-details grid grid-cols-3 border-b border-rose-800">
                {/* Customer fields */}
                <div className="invoice-customer-info col-span-2 space-y-1">
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-350">
                    <span className="font-black text-rose-800 shrink-0">नांव / Name:</span>
                    <span className="font-extrabold text-slate-800 leading-none">{customerName || 'Valued Customer'}</span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-350">
                    <span className="font-black text-rose-800 shrink-0">पत्ता / Address:</span>
                    <span className="font-semibold text-slate-800 leading-none">
                      {formattedAddress || '—'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 border-b border-dashed border-rose-350">
                    <span className="font-black text-rose-800 shrink-0">मोबाईल / Mob:</span>
                    <span className="font-bold text-slate-800 leading-none">{customerMobile || '—'}</span>
                  </div>
                </div>

                {/* Invoice Metadata block */}
                <div className="invoice-metadata-card bg-rose-50/30 border border-rose-800 flex flex-col justify-between font-bold text-rose-800 print:bg-transparent">
                  <div className="flex justify-between items-center">
                    <span>नं. / Memo No:</span>
                    <span className="font-black text-rose-900">{invoice.invoice_number}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-rose-200 pt-1">
                    <span>बुकिंग / Booking:</span>
                    <span className="font-semibold text-rose-850">{invoice.order?.orderDate || invoice.invoice_date || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-rose-100 pt-1">
                    <span>बिल दिनांक / Date:</span>
                    <span className="font-black text-rose-900">{invoice.invoice_date || invoice.order?.orderDate || '—'}</span>
                  </div>
                </div>
              </div>

              {/* 5. Items Table */}
              <div className="invoice-table-container">
                <InvoiceTable items={pageItems} startIndex={pageIndex * ITEMS_PER_PAGE} />
              </div>
            </div>

            <div>
              {/* 6. Page-Specific Totals */}
              <div className="invoice-page-totals border border-dashed border-rose-800 flex flex-wrap justify-between bg-rose-50/10 font-bold text-rose-800 print:bg-transparent">
                <div>
                  या पानावरील एकूण मॉडेल्स / Models on this page: <span className="font-extrabold text-rose-955 ml-0.5">{pageModelsCount}</span>
                </div>
                <div>
                  या पानावरील एकूण नग / Qty on this page: <span className="font-extrabold text-rose-955 ml-0.5">{pageQtySum}</span>
                </div>
                <div>
                  या पानावरील एकूण रक्कम / Bill on this page: <span className="font-extrabold text-rose-955 ml-0.5">{formatCurrency(pageAmountSum)}</span>
                </div>
              </div>

              {/* 7. Cumulative Totals and Slogans (On EVERY page to preserve height and structure) */}
              <div className="invoice-cumulative-block grid grid-cols-2 items-end">
                {/* Payments / Installments History */}
                <div className="text-left space-y-1.5">
                  <div className="invoice-installments-card border border-rose-800 bg-rose-50/20 font-bold text-rose-800 print:bg-transparent print:border-rose-800">
                    <h4 className="font-extrabold text-rose-955 border-b border-rose-200 pb-0.5 mb-1 uppercase tracking-wider">भरणा तपशील / Payment Installments:</h4>
                    {isLastPage && invoice.payments && invoice.payments.length > 0 ? (
                      <div className="space-y-0.5">
                        {invoice.payments.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-800 border-b border-rose-100 last:border-none pb-0.5 last:pb-0 text-[0.95em]">
                            <span>{p.paymentDate || p.payment_date || '—'} · {p.mode}</span>
                            <span className="font-extrabold text-rose-900">₹{Number(p.amount).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-slate-400 italic font-semibold text-[0.85em] mt-1 border-b border-dashed border-rose-200 pb-0.5">
                        {isLastPage ? 'No payments recorded yet.' : 'Carried Forward / पुढे चालू...'}
                      </div>
                    )}
                  </div>
                  <div className="invoice-blessing-text text-left font-bold text-rose-700 italic pl-0.5">
                    भगवान गणेश आपल्या घरी सुख, समृद्धी आणि आनंद घेऊन येवोत! 🙏
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 text-rose-800 font-bold">
                  <div className="invoice-totals-card w-full border border-rose-800 bg-rose-50/20 print:bg-transparent">
                    <div className="flex justify-between text-rose-900 font-bold border-b border-rose-200 pb-0.5">
                      <span>एकूण / Total Amount:</span>
                      <span className="font-black text-rose-950">{isLastPage ? formatCurrency(invoice.total_amount) : '—'}</span>
                    </div>
                    <div className="flex justify-between text-rose-800 font-bold border-b border-rose-200 pb-0.5">
                      <span>भरलेले एकूण / Total Paid:</span>
                      <span className="font-extrabold text-rose-900">{isLastPage ? formatCurrency(invoice.advance_paid) : '—'}</span>
                    </div>
                    <div className={`flex justify-between font-black pt-0.5 rounded-lg text-[1.1em] ${isLastPage && Number(invoice.balance_due || 0) > 0 ? 'text-rose-750' : 'text-emerald-700'
                      }`}>
                      <span>बाकी / Balance Due:</span>
                      <span className="font-black">{isLastPage ? formatCurrency(invoice.balance_due) : '—'}</span>
                    </div>
                  </div>

                  {isLastPage ? (
                    Number(invoice.balance_due || 0) === 0 ? (
                      <span className="invoice-status-badge inline-flex items-center rounded-lg bg-emerald-100 border border-emerald-350 text-emerald-800 print:bg-transparent">
                        ✔ FULLY PAID / पूर्ण भरणा
                      </span>
                    ) : (
                      <span className="invoice-status-badge inline-flex items-center rounded-lg bg-amber-100 border border-amber-350 text-amber-800 print:bg-transparent">
                        ⏳ BALANCE DUE / बाकी देणे
                      </span>
                    )
                  ) : (
                    <span className="invoice-status-badge inline-flex items-center rounded-lg bg-slate-100 border border-slate-350 text-slate-500 print:bg-transparent">
                      ⏳ PAGE {pageIndex + 1} / पाने {pageIndex + 1}
                    </span>
                  )}
                </div>
              </div>

              {/* 8. Terms Notes (On EVERY page to preserve A4 space budgeting) */}
              <div className="invoice-terms-block border-t border-rose-850 pt-2 text-rose-800 leading-snug font-semibold">
                <div className="space-y-0.5">
                  <p className="font-extrabold text-rose-955 uppercase tracking-wider mb-0.5 text-[1.1em]">नम्र सुचना / Kindly Note:</p>
                  <p>१) एकदा विकलेला माल परत घेतला जाणार नाही. / 1. Goods once sold will not be taken back.</p>
                  <p>२) मुर्ती पाहून घेणे. मुर्तीची मोडतोड झाल्यास श्री गणेश आर्ट त्यास जबाबदार नाही. / 2. Please check the idol thoroughly. Shri Ganesh Art is not responsible for any damage or breakage afterwards.</p>
                  <p>३) मुर्ती नेण्याची जबाबदारी शक्यतो स्वतः वाहनाबरोबर असावे. / 3. The responsibility of carrying the idol should preferably be with your own vehicle.</p>
                  <p>४) चूक भूल देणे घ्यावी. / 4. Errors and omissions excepted.</p>
                </div>
              </div>

              {/* 9. Signatures Block and Page Indicator (On EVERY page) */}
              <div className="invoice-signatures-block border-t border-rose-200 pt-2 flex justify-between items-end text-rose-800 leading-relaxed font-bold">
                <div className="text-center w-32">
                  <div className="invoice-sig-gap"></div>
                  <div className="border-b border-rose-800"></div>
                  <p className="mt-1 font-bold uppercase tracking-wider text-rose-800 leading-none">ऑर्डर दे. सही<br />Customer Signature</p>
                </div>

                {/* Page Number indicator */}
                <div className="invoice-page-indicator text-center font-black text-rose-700 bg-rose-50 rounded-full border border-rose-200 print:bg-transparent">
                  पाने {pageIndex + 1} पैकी {totalPages} / Page {pageIndex + 1} of {totalPages}
                </div>

                <div className="text-center w-40">
                  <div className="invoice-sig-gap"></div>
                  <div className="border-b border-rose-800"></div>
                  <p className="mt-1 font-bold uppercase tracking-wider text-rose-800 leading-none">श्री गणेश आर्ट करिता<br />For Shri Ganesh Art</p>
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
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #881337;
        box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      }
    }

    /* ── Fixed A4 page padding ── */
    .invoice-printable {
      padding: 16px 20px !important;
    }

    @media print {
      body.printing-invoice .invoice-printable,
      .invoice-printable {
        padding: 5mm !important;
      }
    }

    /* ── Fixed layout typography & spacing ── */
    .invoice-top-row { font-size: 9.5px !important; }
    
    .invoice-brand-header { margin-top: 8px !important; padding-bottom: 8px !important; }
    .invoice-brand-logo-container { height: 48px !important; width: 48px !important; border-radius: 10px !important; }
    .invoice-brand-title { font-size: 22px !important; }
    .invoice-brand-title span { font-size: 12.5px !important; }
    .invoice-brand-address { font-size: 10px !important; margin-top: 4px !important; }
    .invoice-brand-contact { font-size: 10px !important; }
    .invoice-brand-contact p:first-child { font-size: 8.5px !important; }
    
    .invoice-slogan-banner { font-size: 10px !important; padding: 4px 8px !important; margin-top: 8px !important; border-radius: 8px !important; }
    
    .invoice-customer-details { margin-top: 10px !important; padding-bottom: 8px !important; gap: 12px !important; }
    .invoice-customer-info { font-size: 12.5px !important; }
    .invoice-customer-info > div { border-bottom-width: 1px !important; padding-bottom: 4px !important; }
    .invoice-customer-info span:first-child { min-width: 75px !important; font-size: 11.5px !important; }
    
    .invoice-metadata-card { font-size: 10.5px !important; padding: 8px 10px !important; border-radius: 10px !important; }
    .invoice-metadata-card > div { margin-top: 4px !important; }
    
    .invoice-table-container { margin-top: 6px !important; }
    
    .invoice-page-totals { margin-top: 6px !important; padding: 4px 8px !important; font-size: 9px !important; border-radius: 8px !important; gap: 4px !important; }
    
    .invoice-cumulative-block { margin-top: 6px !important; gap: 6px !important; }
    
    .invoice-installments-card { padding: 4px 6px !important; font-size: 8.5px !important; border-radius: 8px !important; }
    .invoice-installments-card h4 { font-size: 8px !important; margin-bottom: 2px !important; }
    
    .invoice-blessing-text { font-size: 8.5px !important; }
    
    .invoice-totals-card { padding: 4px 6px !important; font-size: 9px !important; border-radius: 8px !important; max-width: 210px !important; }
    
    .invoice-status-badge { font-size: 8px !important; padding: 2px 6px !important; border-radius: 6px !important; }
    
    .invoice-terms-block { margin-top: 6px !important; font-size: 7.2px !important; line-height: 1.25 !important; }
    .invoice-terms-block p { margin-top: 1px !important; }
    
    .invoice-signatures-block { margin-top: 6px !important; font-size: 8px !important; }
    .invoice-signatures-block p { font-size: 7.5px !important; }
    .invoice-sig-gap { height: 12px !important; }
    .invoice-page-indicator { font-size: 8.5px !important; padding: 2px 8px !important; }
  `}</style>
);

export default InvoiceTemplate;
