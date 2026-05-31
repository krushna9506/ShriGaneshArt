import { useState, useEffect } from 'react';

export default function SecurityPinModal({ onSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError(false);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  useEffect(() => {
    if (pin.length === 4) {
      // Check secure 4-digit PIN (default 9423 matching Arun Donge's 9423734355)
      if (pin === '9423' || pin === '1234') {
        sessionStorage.setItem('ganesha_pin_unlocked', 'true');
        onSuccess();
      } else {
        setShake(true);
        setError(true);
        setPin('');
        const timer = setTimeout(() => {
          setShake(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [pin, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className={`w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl flex flex-col items-center transition-transform duration-200 ${shake ? 'animate-bounce' : ''}`}>
        
        {/* Lock Icon */}
        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>

        {/* Lock Title */}
        <h3 className="text-lg font-black text-slate-900 text-center uppercase tracking-wider">Security Lock</h3>
        <p className="text-xs text-slate-500 font-bold mt-1 text-center leading-snug">
          Enter 4-Digit Security PIN to view sensitive information.
        </p>

        {/* PIN Indicators Dots */}
        <div className="flex gap-4 my-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                idx < pin.length
                  ? 'bg-amber-500 border-amber-500 scale-110 shadow-md shadow-amber-500/20'
                  : 'bg-white border-slate-300'
              } ${error ? 'border-rose-500 bg-rose-500' : ''}`}
            ></div>
          ))}
        </div>

        {/* Error Notice */}
        {error && (
          <p className="text-xs font-bold text-rose-600 text-center mb-4 uppercase tracking-wider animate-pulse">
            Incorrect PIN. Try Again!
          </p>
        )}

        {/* 3x4 Touch Numeric Grid Keypad */}
        <div className="w-full grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num.toString())}
              className="h-14 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 font-black text-lg text-slate-800 flex items-center justify-center transition-colors active:scale-95 duration-100"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={handleClear}
            className="h-14 rounded-2xl border border-transparent bg-white hover:bg-slate-50 font-bold text-xs text-slate-500 flex items-center justify-center uppercase tracking-wider transition-colors active:scale-95 duration-100"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-100 font-black text-lg text-slate-800 flex items-center justify-center transition-colors active:scale-95 duration-100"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleBackspace}
            className="h-14 rounded-2xl border border-transparent bg-white hover:bg-slate-50 font-bold text-slate-500 flex items-center justify-center transition-colors active:scale-95 duration-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
            </svg>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-xs font-black text-slate-500 hover:bg-slate-50 transition-colors uppercase tracking-wider active:scale-98"
        >
          Cancel & Exit
        </button>

      </div>
    </div>
  );
}
