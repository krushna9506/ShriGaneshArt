function InvoiceTable({ items = [], startIndex = 0 }) {
  const cleanModelName = (name) => {
    if (!name) return '';
    return String(name)
      .replace(/^ganesh\s+mod+el\s*[-:\s]\s*/i, '')
      .replace(/^ganesh\s+mod+el\s*/i, '')
      .trim();
  };

  return (
    <div className="overflow-x-auto rounded-2xl border-2 border-rose-800 bg-white">
      <table className="min-w-full text-left text-xs border-collapse">
        <thead className="bg-rose-100 text-rose-950 font-bold border-b-2 border-rose-800">
          <tr>
            <th className="px-3 py-2.5 border-r border-rose-800 text-center w-12">अ.क्र.<br />Sr. No.</th>
            <th className="px-4 py-2.5 border-r border-rose-800">मालाचा तपशिल / Model Details & Particulars</th>
            <th className="px-3 py-2.5 border-r border-rose-800 text-center w-16">नग<br />Qty</th>
            <th className="px-3 py-2.5 border-r border-rose-800 text-right w-24">दर<br />Rate</th>
            <th className="px-3 py-2.5 text-right w-28">रुपये<br />Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.model_name}-${index}`} className="border-b border-rose-300 text-slate-800 font-bold hover:bg-rose-50/20">
              <td className="px-3 py-2 border-r border-rose-300 text-center">{index + 1 + startIndex}</td>
              <td className="px-4 py-2 border-r border-rose-300">
                <span className="font-extrabold text-slate-900">{cleanModelName(item.model_name)}</span>
                {item.size && <span className="ml-2 text-slate-500 font-medium">({item.size})</span>}
              </td>
              <td className="px-3 py-2 border-r border-rose-300 text-center text-slate-900">{item.quantity}</td>
              <td className="px-3 py-2 border-r border-rose-300 text-right text-slate-900">
                ₹{Number(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="px-3 py-2 text-right text-slate-900 font-extrabold">
                ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          {/* Padding rows to simulate physical receipt look if items count is low */}
          {items.length < 5 && Array.from({ length: 5 - items.length }).map((_, idx) => (
            <tr key={`empty-${idx}`} className="border-b border-rose-100 text-transparent h-8 select-none">
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
