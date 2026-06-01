function InvoiceTable({ items = [], startIndex = 0 }) {
  const cleanModelName = (name) => {
    if (!name) return '';
    return String(name)
      .replace(/^ganesh\s+mod+el\s*[-:\s]\s*/i, '')
      .replace(/^ganesh\s+mod+el\s*/i, '')
      .trim();
  };

  const totalRowsNeeded = 30;
  const emptyRowsCount = totalRowsNeeded - items.length;

  return (
    <div className="overflow-x-auto rounded-xl border border-rose-800 bg-white">
      <table className="min-w-full text-left border-collapse table-layout-fixed">
        <thead className="bg-rose-100 text-rose-955 font-bold border-b border-rose-800">
          <tr className="h-[24px] text-[10px]">
            <th className="w-[7%] px-1 py-1 border-r border-rose-800 text-center leading-tight">अ.क्र.<br />Sr. No.</th>
            <th className="w-[53%] px-2 py-1 border-r border-rose-800 leading-tight">मालाचा तपशिल / Model Details & Particulars</th>
            <th className="w-[10%] px-1 py-1 border-r border-rose-800 text-center leading-tight">नग<br />Qty</th>
            <th className="w-[14%] px-1 py-1 border-r border-rose-800 text-right leading-tight">दर<br />Rate</th>
            <th className="w-[16%] px-1.5 py-1 text-right leading-tight">रुपये<br />Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.model_name}-${index}`} className="border-b border-rose-200 text-slate-800 font-bold hover:bg-rose-50/20 h-[19px] text-[10.5px]">
              <td className="w-[7%] px-1 py-0.5 border-r border-rose-200 text-center leading-none">{index + 1 + startIndex}</td>
              <td className="w-[53%] px-2 py-0.5 border-r border-rose-200 truncate leading-none">
                <span className="font-extrabold text-slate-900">{cleanModelName(item.model_name)}</span>
                {item.size && <span className="ml-1 text-slate-500 font-semibold text-[0.85em]">({item.size})</span>}
              </td>
              <td className="w-[10%] px-1 py-0.5 border-r border-rose-200 text-center text-slate-900 leading-none">{item.quantity}</td>
              <td className="w-[14%] px-1 py-0.5 border-r border-rose-200 text-right text-slate-900 leading-none">
                ₹{Number(item.rate || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
              <td className="w-[16%] px-1.5 py-0.5 text-right text-slate-900 font-black leading-none">
                ₹{Number(item.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </td>
            </tr>
          ))}
          {emptyRowsCount > 0 && Array.from({ length: emptyRowsCount }).map((_, idx) => {
            const rowNum = idx + 1 + startIndex + items.length;
            return (
              <tr key={`empty-${idx}`} className="border-b border-rose-200 h-[19px] text-[10.5px] select-none">
                <td className="w-[7%] px-1 py-0.5 border-r border-rose-200 text-center text-rose-300 font-normal leading-none">{rowNum}</td>
                <td className="w-[53%] px-2 py-0.5 border-r border-rose-200 text-transparent leading-none">—</td>
                <td className="w-[10%] px-1 py-0.5 border-r border-rose-200 text-transparent leading-none">—</td>
                <td className="w-[14%] px-1 py-0.5 border-r border-rose-200 text-transparent leading-none">—</td>
                <td className="w-[16%] px-1.5 py-0.5 text-transparent leading-none">—</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
