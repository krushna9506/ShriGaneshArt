// Updated for free deployment: Vercel + Render + Neon
import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function ApiLoader({ children }) {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let tries = 0;
    const maxTries = 10;

    async function ping() {
      try {
        await api.get('/health');
        setReady(true);
        setLoading(false);
      } catch {
        tries++;
        setAttempt(tries);
        if (tries < maxTries) {
          setTimeout(ping, 6000);
        } else {
          setLoading(false);
        }
      }
    }
    ping();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* Brand Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/20 mb-6 animate-pulse">
          <span className="text-slate-950 font-black text-4xl">ॐ</span>
        </div>
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent mb-4" />
        <p className="text-amber-800 font-extrabold text-lg uppercase tracking-wider">Starting Shri Ganesh Art...</p>
        <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mt-2">
          {attempt > 0 ? `Connecting to server... (${attempt}/10)` : 'Please wait a moment'}
        </p>
      </div>
    );
  }

  return children;
}
