// Updated for free deployment: Vercel + Render + Neon
import { useState, useEffect } from 'react';
import api from '../../services/api';
import logo from '../../assets/logo.png';

/**
 * ApiLoader — shows the app immediately from cached data if available.
 * Pings the server in the background and marks online/offline status.
 * No more 60-second blocking wait screen.
 */
export default function ApiLoader({ children }) {
  const [ready, setReady] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let tries = 0;
    const maxTries = 3; // max 3 silent retries (≈9s total), then just show app

    async function ping() {
      try {
        await api.get('/health', { timeout: 3000 });
        setReady(true);
      } catch {
        tries++;
        setAttempt(tries);
        if (tries < maxTries) {
          setTimeout(ping, 3000); // retry every 3s (not 6s)
        } else {
          // Give up waiting — show the app anyway.
          // The offline banner in Layout will handle the disconnected state.
          setReady(true);
        }
      }
    }

    // Show a brief branded splash (1.5s max) then start pinging
    const splash = setTimeout(() => {
      ping();
    }, 300); // very short delay just to show the splash frame

    return () => clearTimeout(splash);
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        {/* Brand Icon */}
        <div className="w-20 h-20 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden flex items-center justify-center shadow-xl p-2 mb-6">
          <img src={logo} alt="Shri Ganesh Art Logo" className="w-full h-full object-contain" />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-rose-800 border-t-transparent mb-5" />
        <p className="text-rose-800 font-black text-2xl tracking-tight">Shri Ganesh Art</p>
        <p className="text-amber-600 text-[10px] font-extrabold uppercase tracking-widest mt-1">Ganesh Idol Manufacturer</p>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-3">
          {attempt > 0 ? `Connecting... (${attempt}/${3})` : 'Loading live database...'}
        </p>
      </div>
    );
  }

  return children;
}
