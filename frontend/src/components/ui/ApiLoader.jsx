// Updated for free deployment: Vercel + Render + Neon
import { useState, useEffect } from 'react';
import api from '../../services/api';

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50" style={{ fontFamily: "'Outfit', sans-serif" }}>
        {/* Brand Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/20 mb-6">
          <span className="text-slate-950 font-black text-4xl">ॐ</span>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-4" />
        <p className="text-amber-800 font-extrabold text-base uppercase tracking-wider">Shri Ganesh Art</p>
        <p className="text-amber-600 text-xs font-bold uppercase tracking-widest mt-1">
          {attempt > 0 ? `Connecting... (${attempt}/${3})` : 'Loading...'}
        </p>
      </div>
    );
  }

  return children;
}
