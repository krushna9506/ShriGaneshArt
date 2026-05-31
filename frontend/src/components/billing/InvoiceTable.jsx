function InvoiceTable({ items = [], startIndex = 0 }) {
  const cleanModelName = (name) => {
    if (!name) return '';
    return String(name)
      .replace(/^ganesh\s+mod+el\s*[-:\s]\s*/i, '')
      .replace(/^ganesh\s+mod+el\s*/i, '')
      .trim();
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-rose-800 bg-white">
      <table className="min-w-full text-left text-[11px] border-collapse">
        <thead className="bg-rose-100 text-rose-955 font-bold border-b border-rose-800">
          <tr>
            <th className="px-2 py-1.5 border-r border-rose-800 text-center w-12">अ.क्र.<br />Sr. No.</th>
            <th className="px-3 py-1.5 border-r border-rose-800">मालाचा तपशिल / Model Details & Particulars</th>
            <th className="px-2 py-1.5 border-r border-rose-800 text-center w-14">नग<br />Qty</th>
            <th className="px-2 py-1.5 border-r border-rose-800 text-right w-20">दर<br />Rate</th>
            <th className="px-2 py-1.5 text-right w-24">रुपये<br />Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.model_name}-${index}`} className="border-b border-rose-200 text-slate-800 font-bold hover:bg-rose-50/20">
              <td className="px-2 py-1 border-r border-rose-200 text-center">{index + 1 + startIndex}</td>
              <td className="px-3 py-1 border-r border-rose-200">
                <span className="font-extrabold text-slate-900">{cleanModelName(item.model_name)}</span>
                {item.size && <span className="ml-1.5 text-slate-500 font-semibold text-[10px]">({item.size})</span>}
              </td>
              <td className="px-2 py-1 border-r border-rose-200 text-center text-slate-900">{item.quantity}</td>
              <td className="px-2 py-1 border-r border-rose-200 text-right text-slate-900">
                ₹{Number(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-2 py-1 text-right text-slate-900 font-black">
                ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          {/* Padding rows to simulate physical receipt look only if items count is very low */}
          {items.length < 3 && Array.from({ length: 3 - items.length }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="border-b border-rose-100 text-transparent h-6 select-none">
              <td className="border-r border-rose-100"></td>
              <td className="border-r border-rose-100"></td>
              <td className="border-r border-rose-100"></td>
              <td className="border-r border-rose-100"></td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
