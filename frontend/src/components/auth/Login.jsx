// Updated for secure PostgreSQL manual login only
import { useState } from 'react';
import api from '../../services/api.js';

export default function Login({ onLoginSuccess }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSuccess = (userMobile, token) => {
    localStorage.setItem('ganesha_user', userMobile);
    localStorage.setItem('ganesha_token', token);
    onLoginSuccess();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedMobile = mobileNumber.trim();
    const trimmedPassword = password.trim();

    // Fast local mobile verification length check
    if (trimmedMobile.length < 8) {
      setError('Please enter a valid mobile number.');
      setLoading(false);
      return;
    }

    try {
      // Direct backend PostgreSQL authentication check
      const response = await api.post('/api/auth/login', {
        username: trimmedMobile,
        password: trimmedPassword
      });

      if (response.data && response.data.token) {
        handleLoginSuccess(trimmedMobile, response.data.token);
      } else {
        setError('Login failed. No token returned by server.');
      }
    } catch (err) {
      console.error('Manual login failed', err);
      const errMsg = err.response?.data?.error || 'Invalid credentials or connection timeout.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ fontFamily: "'Outfit', sans-serif" }}>
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl flex flex-col items-center">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 animate-float">
          <span className="text-slate-955 font-black text-3xl">ॐ</span>
        </div>

        {/* Brand Titles */}
        <h1 className="text-2xl font-black text-slate-900 tracking-tight text-center">Shri Ganesh Art</h1>
        <p className="text-[10px] text-amber-600 font-extrabold tracking-widest uppercase mt-1.5 mb-6">Studio Portal Login</p>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-bold text-rose-700 text-center animate-pulse">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1.5">Mobile Number</label>
            <input
              type="tel"
              required
              disabled={loading}
              placeholder="e.g. 9423734355"
              value={mobileNumber}
              onChange={(e) => { setMobileNumber(e.target.value); setError(''); }}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              required
              disabled={loading}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-2xl bg-amber-500 py-3.5 text-sm font-black text-slate-955 hover:bg-amber-600 shadow-md shadow-amber-500/10 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Securing Access...' : 'Sign In Securely'}
          </button>
        </form>

        <div className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Shri Ganesh Art © 2026 · Dharashiv
        </div>
      </div>
    </div>
  );
}
