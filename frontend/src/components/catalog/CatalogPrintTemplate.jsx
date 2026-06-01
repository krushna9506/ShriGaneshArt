import React from 'react';
import logo from '../../assets/logo.png';

function CatalogPrintTemplate({ models = [] }) {
  if (!models || models.length === 0) return null;

  const MODELS_PER_COLUMN = 30;
  const MODELS_PER_PAGE = MODELS_PER_COLUMN * 2; // 60
  
  const totalPages = Math.ceil(models.length / MODELS_PER_PAGE) || 1;

  return (
    <div id="catalog-print-template" className="catalog-scroll-wrapper no-print hidden">
      {Array.from({ length: totalPages }).map((_, pageIndex) => {
        const pageModels = models.slice(pageIndex * MODELS_PER_PAGE, (pageIndex + 1) * MODELS_PER_PAGE);
        
        const leftColumnModels = pageModels.slice(0, MODELS_PER_COLUMN);
        const rightColumnModels = pageModels.slice(MODELS_PER_COLUMN, MODELS_PER_PAGE);

        // Pad left and right columns to exactly 30 rows
        const leftPadCount = MODELS_PER_COLUMN - leftColumnModels.length;
        const rightPadCount = MODELS_PER_COLUMN - rightColumnModels.length;

        return (
          <div key={pageIndex} className="catalog-printable" style={{ fontFamily: "'Outfit', 'Noto Sans Devanagari', 'Inter', sans-serif" }}>
            <div>
              {/* Header Branding (35% page height budget - spacious & premium) */}
              <div className="flex flex-wrap justify-between items-center border-b border-rose-800 pb-1.5 gap-1 text-[10px] font-black">
                <div className="border border-rose-800 rounded-full px-2.5 py-0.5 bg-rose-50 text-rose-800 font-bold">
                  प्रो. डोंगे बंधू / Proprietor: Donge Brothers
                </div>
                <div className="text-center tracking-widest text-rose-850">
                  ॥ श्री गजानन प्रसन्न ॥
                </div>
                <div className="border border-rose-800 rounded-lg px-2.5 py-0.5 bg-rose-50/50 text-rose-800 font-bold tracking-wider">
                  मॉडेल कॅटलॉग / Model Master Catalog
                </div>
              </div>

              <div className="mt-3.5 flex flex-row justify-between items-center gap-4 border-b-2 border-double border-rose-800 pb-3">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl border border-rose-800 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden relative flex items-center justify-center shadow-sm">
                    <img src={logo} alt="Shri Ganesh Art Logo" className="absolute inset-0 w-full h-full object-contain p-0.5" />
                  </div>
                </div>

                <div className="flex-1 text-center">
                  <h1 className="text-2xl font-extrabold text-rose-800 tracking-tight leading-none">
                    श्री गणेश आर्ट <span className="text-sm font-black text-rose-700 ml-1">/ SHRI GANESH ART</span>
                  </h1>
                  <p className="mt-1.5 text-xs font-extrabold text-rose-900 leading-none">
                    यादव नगर, संभाजीनगर बायपास रोड, धाराशिव - ४१३५०१ · Yadav Nagar, Bypass Road, Dharashiv
                  </p>
                </div>

                <div className="text-right text-xs font-bold text-rose-800 leading-tight">
                  <p className="text-rose-700 uppercase tracking-wider text-[8.5px] font-black">मोबाईल नं. / Mobile:</p>
                  <p className="font-black text-rose-900 mt-1">9423734355 · 9922743650</p>
                </div>
              </div>

              <div className="mt-2 border-b border-rose-800 bg-rose-50/50 py-1.5 px-4 text-center text-xs font-extrabold text-rose-800 rounded-lg leading-none">
                आमच्याकडे सर्व प्रकारचे लहान मोठे श्री गणेश मुर्ती ठोक व किरकोळ योग्य भावात मिळेल. · <span className="font-semibold text-rose-700 text-[0.95em]">All Ganesha Idols available wholesale & retail.</span>
              </div>

              {/* Dual Column Table Container (65% page height budget) */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Left Table Column */}
                <div>
                  <table className="w-full text-left text-xs border-collapse border border-rose-800 table-fixed" style={{ tableLayout: 'fixed' }}>
                    <thead className="bg-rose-100 text-rose-955 font-bold border-b border-rose-800">
                      <tr className="h-[26px]">
                        <th className="w-[12%] px-1 border-r border-rose-800 text-center leading-none">अ.क्र.</th>
                        <th className="w-[48%] px-1.5 border-r border-rose-800 leading-none">मॉडेल कोड</th>
                        <th className="w-[22%] px-1 border-r border-rose-800 text-center leading-none">आकार</th>
                        <th className="w-[18%] px-1 text-right leading-none">किंमत</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leftColumnModels.map((item, index) => (
                        <tr key={item.id} className="border-b border-rose-200 text-slate-800 font-bold h-[26px]">
                          <td className="w-[12%] px-1 border-r border-rose-200 text-center leading-none">{pageIndex * MODELS_PER_PAGE + index + 1}</td>
                          <td className="w-[48%] px-1.5 border-r border-rose-200 truncate leading-none">{item.code}</td>
                          <td className="w-[22%] px-1 border-r border-rose-200 text-center leading-none">{item.size}</td>
                          <td className="w-[18%] px-1 text-right leading-none">₹{Number(item.price || 0).toFixed(0)}</td>
                        </tr>
                      ))}
                      {Array.from({ length: leftPadCount }).map((_, idx) => {
                        const rowNum = pageIndex * MODELS_PER_PAGE + leftColumnModels.length + idx + 1;
                        return (
                          <tr key={`left-pad-${idx}`} className="border-b border-rose-200 text-transparent h-[26px] select-none">
                            <td className="w-[12%] px-1 border-r border-rose-200 text-center text-rose-350/40 font-normal leading-none">{rowNum}</td>
                            <td className="w-[48%] px-1.5 border-r border-rose-200 leading-none">—</td>
                            <td className="w-[22%] px-1 border-r border-rose-200 text-center leading-none">—</td>
                            <td className="w-[18%] px-1 text-right leading-none">—</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Right Table Column */}
                <div>
                  <table className="w-full text-left text-xs border-collapse border border-rose-800 table-fixed" style={{ tableLayout: 'fixed' }}>
                    <thead className="bg-rose-100 text-rose-955 font-bold border-b border-rose-800">
                      <tr className="h-[26px]">
                        <th className="w-[12%] px-1 border-r border-rose-800 text-center leading-none">अ.क्र.</th>
                        <th className="w-[48%] px-1.5 border-r border-rose-800 leading-none">मॉडेल कोड</th>
                        <th className="w-[22%] px-1 border-r border-rose-800 text-center leading-none">आकार</th>
                        <th className="w-[18%] px-1 text-right leading-none">किंमत</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rightColumnModels.map((item, index) => (
                        <tr key={item.id} className="border-b border-rose-200 text-slate-800 font-bold h-[26px]">
                          <td className="w-[12%] px-1 border-r border-rose-200 text-center leading-none">{pageIndex * MODELS_PER_PAGE + MODELS_PER_COLUMN + index + 1}</td>
                          <td className="w-[48%] px-1.5 border-r border-rose-200 truncate leading-none">{item.code}</td>
                          <td className="w-[22%] px-1 border-r border-rose-200 text-center leading-none">{item.size}</td>
                          <td className="w-[18%] px-1 text-right leading-none">₹{Number(item.price || 0).toFixed(0)}</td>
                        </tr>
                      ))}
                      {Array.from({ length: rightPadCount }).map((_, idx) => {
                        const rowNum = pageIndex * MODELS_PER_PAGE + MODELS_PER_COLUMN + rightColumnModels.length + idx + 1;
                        return (
                          <tr key={`right-pad-${idx}`} className="border-b border-rose-200 text-transparent h-[26px] select-none">
                            <td className="w-[12%] px-1 border-r border-rose-200 text-center text-rose-350/40 font-normal leading-none">{rowNum}</td>
                            <td className="w-[48%] px-1.5 border-r border-rose-200 leading-none">—</td>
                            <td className="w-[22%] px-1 border-r border-rose-200 text-center leading-none">—</td>
                            <td className="w-[18%] px-1 text-right leading-none">—</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer containing blessing and page numbers */}
            <div className="mt-4 border-t border-rose-200 pt-2 flex justify-between items-center text-xs text-rose-800 font-bold">
              <div>
                श्री गणेश आर्ट · Model Master Catalog List
              </div>
              <div className="bg-rose-55 px-4 py-0.5 rounded-full border border-rose-200 text-[10px]">
                पाने {pageIndex + 1} पैकी {totalPages} / Page {pageIndex + 1} of {totalPages}
              </div>
              <div>
                Shri Ganesh Art © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        );
      })}
      
      <style>{`
        .catalog-scroll-wrapper {
          width: 794px;
          background: #ffffff;
        }
        @media screen {
          .catalog-printable {
            width: 794px;
            height: 1123px;
            margin: 0 auto 16px auto;
            background: #ffffff;
            border: 2px solid #881337;
            border-radius: 12px;
            padding: 24px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            color: #881337;
            box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          }
        }
        @media print {
          body.printing-invoice .catalog-printable,
          .catalog-printable {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            page-break-after: always !important;
            border: 2px solid #881337 !important;
            background: #ffffff !important;
            box-sizing: border-box !important;
            color: #881337 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CatalogPrintTemplate;
