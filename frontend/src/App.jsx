import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import api from './services/api.js';
import BillingPage from './pages/billing/BillingPage.jsx';
import InvoicePage from './pages/billing/InvoicePage.jsx';
import Login from './components/auth/Login.jsx';
import ApiLoader from './components/ui/ApiLoader.jsx';

// Clear any stale local dev URL that was saved while testing on local network.
// If the stored URL points to localhost or a LAN IP, remove it so the app uses
// the production Render backend (set via VITE_API_URL in Vercel env vars).
(function clearStaleLocalUrl() {
  const saved = localStorage.getItem('ganesha_api_url');
  if (saved && (saved.includes('localhost') || saved.includes('192.168') || saved.includes('127.0.0'))) {
    localStorage.removeItem('ganesha_api_url');
  }
})();


async function ensureSession() {
  const stored = localStorage.getItem('ganesha_token');
  if (stored) {
    api.defaults.headers.common.Authorization = `Bearer ${stored}`;
    return stored;
  }

  // Clear any partial storage and reload to display secure login form
  localStorage.removeItem('ganesha_token');
  localStorage.removeItem('ganesha_user');
  window.location.reload();
  throw new Error('No active session. Please log in.');
}

function Layout({ children }) {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);
  const [isOnline, setIsOnline] = useState(true);
  const [pingMs, setPingMs] = useState(null);

  useEffect(() => {
    setActivePath(window.location.pathname);
  }, [window.location.pathname]);

  useEffect(() => {
    const pingServer = async () => {
      const start = Date.now();
      try {
        await api.get('/health', { timeout: 2000 });
        setIsOnline(true);
        setPingMs(Date.now() - start);
      } catch (e) {
        setIsOnline(false);
        setPingMs(null);
      }
    };
    pingServer();
    const interval = setInterval(pingServer, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Portal', to: '/', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
    )},
    { label: 'Catalog', to: '/models', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
    )},
    { label: 'Orders', to: '/orders', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
    )},
    { label: 'Payments', to: '/payments', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    )},
    { label: 'Billing', to: '/billing', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col pb-20 lg:pb-0 lg:pl-64 w-full max-w-full overflow-x-hidden lg:overflow-x-visible">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-150 bg-white p-6 lg:block z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <span className="text-slate-955 font-black text-xl">ॐ</span>
          </div>
          <div>
            <h2 className="text-md font-bold tracking-tight text-slate-900 leading-none">Shri Ganesh Art</h2>
            <p className="text-[10px] text-amber-600 font-semibold tracking-widest uppercase mt-1">Studio Portal</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 text-xs text-slate-650 shadow-sm flex flex-col gap-1.5">
          <p className="font-bold text-slate-900 text-sm">Arun Donge</p>
          <p>Contact: 9423734355</p>
          <p>Location: Dharashiv, 413501</p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem('ganesha_user');
              sessionStorage.removeItem('ganesha_pin_unlocked');
              window.location.reload();
            }}
            className="mt-2.5 w-full rounded-xl border border-rose-200 bg-rose-50/50 py-2 text-[10px] font-black text-rose-700 uppercase tracking-widest hover:bg-rose-100/50 transition-colors active:scale-95 duration-100"
          >
            Sign Out
          </button>
        </div>
        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const isActive = activePath === item.to || (item.to !== '/' && activePath.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setActivePath(item.to)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'text-slate-600 hover:bg-amber-50/50 hover:text-amber-600'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Responsive Mobile Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black text-md">
            ॐ
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 block">Shri Ganesh Art</span>
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider leading-none">Studio Portal</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border ${
            isOnline 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}>
            <span className={`relative flex h-2 w-2`}>
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className="font-bold text-[10px] tracking-wider uppercase">
              {isOnline ? `${pingMs ?? 0}ms` : 'Offline'}
            </span>
          </div>
        </div>
      </header>

      {/* Main app panel */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <header className="hidden border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur-md lg:block z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-600 font-bold">Shri Ganesh Art</p>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">Studio Operations</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold ${
                isOnline 
                  ? 'bg-emerald-55 border-emerald-200 text-emerald-800' 
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                <span className={`relative flex h-2 w-2`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                </span>
                <span>{isOnline ? `Backend Connected (${pingMs ?? 0} ms)` : 'Backend Disconnected'}</span>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 p-4 lg:p-6 w-full max-w-[1600px] mx-auto">
          {children}
        </section>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-30 border-t border-slate-200 bg-white/90 backdrop-blur-lg lg:hidden flex justify-around py-2 shadow-2xl safe-bottom">
        {navItems.map((item) => {
          const isActive = activePath === item.to || (item.to !== '/' && activePath.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setActivePath(item.to)}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-center transition-all duration-150 ${
                isActive 
                  ? 'text-amber-655 font-extrabold scale-105' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {item.icon}
              <span className="text-[9px] tracking-wide font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function WelcomePortal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [pingMs, setPingMs] = useState(null);

  const [isStockOpen, setIsStockOpen] = useState(false);
  const [stockQuery, setStockQuery] = useState('');
  const [modelsList, setModelsList] = useState([]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState(localStorage.getItem('ganesha_api_url') || '');
  const [settingsPing, setSettingsPing] = useState(null);
  const [settingsStatus, setSettingsStatus] = useState('');
  
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const loadPortalData = async () => {
      try {
        await ensureSession();
        const start = Date.now();
        const modelsRes = await api.get('/models');
        if (mounted) {
          setModelsList(modelsRes.data);
          setIsOnline(true);
          setPingMs(Date.now() - start);
          setLoading(false);
        }
      } catch (err) {
        console.error('Portal load failed', err);
        if (mounted) {
          setIsOnline(false);
          setLoading(false);
        }
      }
    };
    
    loadPortalData();
    const interval = setInterval(loadPortalData, 15000);
    
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsStatus('checking');
    const cleanUrl = apiUrlInput.trim();
    
    try {
      const testUrl = cleanUrl ? (cleanUrl + '/health') : '/api/health';
      const res = await axios.get(testUrl, { timeout: 3000 });
      
      if (res.data && res.data.ok) {
        if (cleanUrl) {
          localStorage.setItem('ganesha_api_url', cleanUrl);
          api.defaults.baseURL = cleanUrl;
        } else {
          localStorage.removeItem('ganesha_api_url');
          api.defaults.baseURL = '/api';
        }
        
        localStorage.removeItem('ganesha_token');
        await ensureSession();
        
        setSettingsStatus('success');
        setIsOnline(true);
        
        const start = Date.now();
        const modelsRes = await api.get('/models');
        setModelsList(modelsRes.data);
        setPingMs(Date.now() - start);
        
        setTimeout(() => {
          setIsSettingsOpen(false);
          setSettingsStatus('');
        }, 1200);
      } else {
        setSettingsStatus('failed');
      }
    } catch (err) {
      console.error('Test connection failed', err);
      setSettingsStatus('failed');
    }
  };

  const handleTestConnection = async () => {
    setSettingsStatus('checking');
    const testUrl = apiUrlInput.trim() ? (apiUrlInput.trim() + '/health') : '/api/health';
    const start = Date.now();
    try {
      const res = await axios.get(testUrl, { timeout: 3000 });
      if (res.data && res.data.ok) {
        setSettingsPing(Date.now() - start);
        setSettingsStatus('success');
      } else {
        setSettingsStatus('failed');
        setSettingsPing(null);
      }
    } catch (e) {
      setSettingsStatus('failed');
      setSettingsPing(null);
    }
  };

  const filteredModels = modelsList.filter((m) =>
    m.code.toLowerCase().includes(stockQuery.toLowerCase()) ||
    m.size.toLowerCase().includes(stockQuery.toLowerCase())
  );

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good Morning ☀️';
    if (hrs < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌙';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-800">
      {/* Welcome Banner Card */}
      <div className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-sm overflow-hidden animate-float">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-xl shadow-amber-500/20">
              <span className="text-slate-950 font-black text-3xl">ॐ</span>
            </div>
            <div>
              <p className="text-xs font-extrabold text-amber-600 tracking-widest uppercase">{getGreeting()}</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">Shri Ganesh Art Studio</h2>
              <p className="text-sm text-slate-600 mt-1 font-medium">Welcome to the Live Operations & Catalog Portal</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-amber-500 hover:text-amber-600 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.645-.869l.214-1.28z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            App Settings
          </button>
        </div>
      </div>

      {/* Connection Failure Warning Banner */}
      {!isOnline && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
            <p className="font-bold">Offline: Cannot connect to Shri Ganesh Art server database.</p>
          </div>
          <button 
            type="button"
            onClick={() => setIsSettingsOpen(true)} 
            className="rounded-xl bg-rose-600 text-white font-bold px-3.5 py-1.5 text-xs hover:bg-rose-700 transition-colors shadow-sm"
          >
            Configure Connection IP
          </button>
        </div>
      )}

      {/* Quick stats moved to Payments History */}

      {/* Quick Launch Operations App Grid */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold text-slate-400">Quick Launch Operations</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { 
              title: 'Create Invoice', 
              desc: 'Generate & print billing statements', 
              border: 'border-amber-100 hover:border-amber-400 hover:bg-amber-50/20', 
              text: 'text-slate-800',
              iconBg: 'bg-amber-50 text-amber-600',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              ), 
              onClick: () => navigate('/billing') 
            },
            { 
              title: 'Fast Stock Checker', 
              desc: 'Lookup stock items instantly', 
              border: 'border-emerald-100 hover:border-emerald-400 hover:bg-emerald-50/20', 
              text: 'text-slate-800',
              iconBg: 'bg-emerald-50 text-emerald-600',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.636z" /></svg>
              ), 
              onClick: () => { setIsStockOpen(true); setStockQuery(''); }
            },
            { 
              title: 'Take New Order', 
              desc: 'Record client model bookings', 
              border: 'border-indigo-100 hover:border-indigo-400 hover:bg-indigo-50/20', 
              text: 'text-slate-800',
              iconBg: 'bg-indigo-50 text-indigo-600',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
              ), 
              onClick: () => navigate('/orders') 
            },
            { 
              title: 'Stock Ledger', 
              desc: 'Model master & ledger grid', 
              border: 'border-sky-100 hover:border-sky-400 hover:bg-sky-50/20', 
              text: 'text-slate-800',
              iconBg: 'bg-sky-50 text-sky-600',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125H5.625C5.004 8.25 4.5 7.746 4.5 7.125v-1.5c0-.621.504-1.125 1.125-1.125z" /></svg>
              ), 
              onClick: () => navigate('/models') 
            },
            { 
              title: 'Record Payment', 
              desc: 'Log advances & balance cash', 
              border: 'border-violet-100 hover:border-violet-400 hover:bg-violet-50/20', 
              text: 'text-slate-800',
              iconBg: 'bg-violet-50 text-violet-600',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              ), 
              onClick: () => navigate('/payments') 
            },
            { 
              title: 'Deliveries', 
              desc: 'Manage dispatches & cancel orders', 
              border: 'border-rose-100 hover:border-rose-400 hover:bg-rose-50/20', 
              text: 'text-slate-800',
              iconBg: 'bg-rose-50 text-rose-600',
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 014.513 4.5h8.974c.576 0 1.059.435 1.119 1.007M8.25 18.75h6m0 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.5a2.25 2.25 0 002.25-2.25v-6a2.25 2.25 0 00-2.25-2.25h-1.5M10.5 4.5v3h3" /></svg>
              ), 
              onClick: () => navigate('/delivery') 
            }
          ].map((tile, i) => (
            <button
              key={i}
              type="button"
              onClick={tile.onClick}
              className={`rounded-3xl border ${tile.border} bg-white p-5 text-left shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] group`}
            >
              <div className={`w-10 h-10 rounded-2xl ${tile.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {tile.icon}
              </div>
              <h4 className="font-extrabold text-slate-800 text-base tracking-tight">{tile.title}</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-snug">{tile.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* FLOATING QUICK STOCK CHECKER DIALOG MODAL */}
      {isStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-amber-500"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                <span>Fast Stock Lookup</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setIsStockOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 border-b border-slate-100 bg-white">
              <input
                type="text"
                autoFocus
                placeholder="Type model code (e.g. GA-001)..."
                value={stockQuery}
                onChange={(e) => setStockQuery(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredModels.slice(0, 15).map((model) => (
                <div key={model.id} className="rounded-2xl border border-slate-100 bg-white p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div>
                    <h5 className="font-extrabold text-slate-900 text-base leading-none">{model.code}</h5>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">Size: <span className="font-semibold text-slate-700">{model.size}</span> · Price: <span className="font-semibold text-slate-700">₹{model.price}</span></p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex rounded-xl px-3 py-1.5 text-xs font-black tracking-wide bg-emerald-50 border border-emerald-200 text-emerald-700">
                      {model.remainingStock} available
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 leading-none font-extrabold">of {model.totalStock} total units</p>
                  </div>
                </div>
              ))}
              
              {filteredModels.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-sm">No models match your query.</p>
                </div>
              )}
            </div>
            
            <div className="px-5 py-3 border-t border-slate-100 bg-white text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Showing top {Math.min(filteredModels.length, 15)} matching models
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS DIALOG DRAWER MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <form 
            onSubmit={handleSaveSettings}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base">App Connection Settings</h3>
              <button 
                type="button" 
                onClick={() => { setIsSettingsOpen(false); setSettingsStatus(''); }}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                Backend API Server Base URL
              </label>
              <input
                type="url"
                placeholder="e.g. https://shriganeshart.onrender.com (leave blank to use default)"
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
              />
              <p className="text-[10px] text-slate-400 leading-snug font-medium">
                Your backend is hosted on Render. The default URL is pre-configured.
                Only change this if you are running a local development server.
              </p>
            </div>

            {settingsStatus && (
              <div className={`rounded-xl border p-3 text-xs font-bold ${
                settingsStatus === 'checking' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                settingsStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {settingsStatus === 'checking' && 'Pinging backend database...'}
                {settingsStatus === 'success' && `Connected successfully! (Latency: ${settingsPing ?? 10}ms)`}
                {settingsStatus === 'failed' && 'Unable to reach backend. Check IP address, port, and Wi-Fi connection.'}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                Test Ping
              </button>
              
              <button
                type="submit"
                className="flex-1 rounded-2xl bg-amber-500 py-3 text-xs font-black text-slate-950 hover:bg-amber-600 shadow-md shadow-amber-500/10 transition-colors"
              >
                Save & Connect
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    ensureSession()
      .then(() => api.get('/dashboard'))
      .then((r) => { if (mounted) setData(r.data); })
      .catch((err) => console.error('Dashboard fetch failed', err));
    return () => { mounted = false; };
  }, []);

  if (!data) return <div className="text-slate-500 font-semibold p-6">Loading dashboard…</div>;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {data.cards.map(card => {
          const isSensitive = card.label === 'Payments Pending' || card.label === 'Revenue Recorded';
          return (
            <div key={card.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-800">{card.value}</p>
            </div>
          );
        })}
      </div>
      
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Monthly sales</h3>
          <div className="mt-4 flex items-end gap-3 h-32 pt-2">
            {data.sales.map(item => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-lg bg-gradient-to-t from-amber-600 to-amber-400 relative group" style={{height: `${item.value * 1.5}px`}}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}
                  </div>
                </div>
                <span className="text-[10px] text-slate-655 font-bold">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">Alerts</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            {data.alerts.map(alert => (
              <li key={alert} className="rounded-2xl border border-amber-100 bg-white p-3 shadow-sm text-slate-700 font-medium">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Models() {
  const [models, setModels] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' or 'stock'
  const [search, setSearch] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [form, setForm] = useState({ code: '', size: '', price: '', totalStock: '', soldStock: '', remainingStock: '', active: true });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      await ensureSession();
      const [modelsRes, ordersRes] = await Promise.all([
        api.get('/models'),
        api.get('/orders')
      ]);
      setModels(modelsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Models/Orders data fetch failed', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredModels = models.filter((item) => [item.code, item.size].join(' ').toLowerCase().includes(search.toLowerCase()));

  // Group active bookings by model
  const modelBookingsMap = {};
  models.forEach((model) => {
    modelBookingsMap[model.id] = [];
  });

  orders.forEach((order) => {
    if (order.status !== 'Cancelled') {
      order.items?.forEach((item) => {
        if (modelBookingsMap[item.modelId]) {
          modelBookingsMap[item.modelId].push({
            customerName: order.customerName,
            qtyGiven: item.quantity,
            orderNumber: order.orderNumber
          });
        }
      });
    }
  });

  // Calculate the max bookings across all models
  let maxBookings = 0;
  models.forEach((model) => {
    const bookingsCount = modelBookingsMap[model.id]?.length || 0;
    if (bookingsCount > maxBookings) {
      maxBookings = bookingsCount;
    }
  });

  const numCustomerCols = Math.max(6, maxBookings);

  // Filter models based on the stock search (checks model code OR active booking customer names)
  const filteredModelsForStock = models.filter((model) => {
    const query = stockSearch.toLowerCase().trim();
    if (!query) return true;
    const matchesModel = model.code.toLowerCase().includes(query);
    const bookings = modelBookingsMap[model.id] || [];
    const matchesCustomer = bookings.some((b) =>
      b.customerName.toLowerCase().includes(query)
    );
    return matchesModel || matchesCustomer;
  });

  const submitModel = async (e) => {
    e.preventDefault();
    const totalStock = Number(form.totalStock || 0);
    const soldStock = Number(form.soldStock || 0);
    const remainingStock = totalStock - soldStock;  // always auto-computed
    const payload = {
      ...form,
      name: `Ganesh Model ${form.code}`,
      price: form.price || '',
      totalStock,
      soldStock,
      remainingStock,
    };
    try {
      await ensureSession();
      if (editingId) {
        await api.put(`/models/${editingId}`, payload);
      } else {
        await api.post('/models', payload);
      }
      setForm({ code: '', size: '', price: '', totalStock: '', soldStock: '', remainingStock: '', active: true });
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error('Save model failed', err);
      alert(`Failed to save model: ${err.response?.data?.error || err.message}`);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({ code: item.code || '', size: item.size || '', price: item.price ?? '', totalStock: item.totalStock ?? '', soldStock: item.soldStock ?? '', remainingStock: item.remainingStock ?? '', active: Boolean(item.active) });
  };

  const deleteModel = async (id) => {
    if (!window.confirm('Delete this model?')) return;
    try {
      await ensureSession();
      await api.delete(`/models/${id}`);
      loadData();
    } catch (err) {
      console.error('Delete model failed', err);
    }
  };

  const submitInlineEdit = async () => {
    const totalStock = Number(form.totalStock || 0);
    const soldStock = Number(form.soldStock || 0);
    const remainingStock = totalStock - soldStock;  // always auto-computed
    const payload = {
      ...form,
      name: `Ganesh Model ${form.code}`,
      price: form.price || '',
      totalStock,
      soldStock,
      remainingStock,
    };
    try {
      await ensureSession();
      await api.put(`/models/${editingId}`, payload);
      setForm({ code: '', size: '', price: '', totalStock: '', soldStock: '', remainingStock: '', active: true });
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error('Inline save model failed', err);
      alert(`Failed to save: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Models</h2>
            <p className="mt-1 text-sm text-slate-600">Admin CRUD for model master data. Model code supports any language and special characters.</p>
          </div>
          {activeTab === 'catalog' && (
            <button onClick={() => { setEditingId(null); setForm({ code: '', size: '', price: '', totalStock: '', soldStock: '', remainingStock: '', active: true }); }} className="rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950">Add New Model</button>
          )}
        </div>

        {/* Pill Toggler for Catalog and Dispatch Ledger */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <span className="mr-2 text-xs font-bold uppercase tracking-wider text-slate-400">View Mode:</span>
          {[
            ['catalog', 'Model Master Catalog'],
            ['stock', 'Stock & Dispatch Ledger']
          ].map(([tabId, label]) => {
            const isActive = activeTab === tabId;
            return (
              <button
                key={tabId}
                type="button"
                onClick={() => setActiveTab(tabId)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-bold scale-[1.02]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {activeTab === 'catalog' ? (
          <div className="mt-6 flex flex-col xl:grid xl:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 w-full min-w-0">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-semibold">Model Master</h3>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search model code or size..." className="w-full sm:w-64 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm min-w-[700px] border-collapse">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Model Code</th>
                      <th className="px-3 py-2">Size</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Total Stock</th>
                      <th className="px-3 py-2">Sold Stock</th>
                      <th className="px-3 py-2">Remaining</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.map((item) => {
                      const isEditing = editingId === item.id;
                      if (isEditing) {
                        return (
                          <tr key={item.id} className="border-t border-slate-200 text-slate-800 bg-amber-500/10">
                            <td className="px-2 py-2">
                              <input
                                value={form.code}
                                onChange={(e) => setForm({ ...form, code: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                value={form.size}
                                onChange={(e) => setForm({ ...form, size: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="w-full rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number"
                                value={form.totalStock}
                                onChange={(e) => {
                                  const total = Number(e.target.value || 0);
                                  const sold = Number(form.soldStock || 0);
                                  setForm({ ...form, totalStock: e.target.value, remainingStock: total - sold });
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-2 py-2">
                              <input
                                type="number"
                                value={form.soldStock}
                                onChange={(e) => {
                                  const sold = Number(e.target.value || 0);
                                  const total = Number(form.totalStock || 0);
                                  setForm({ ...form, soldStock: e.target.value, remainingStock: total - sold });
                                }}
                                className="w-full rounded-xl border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
                              />
                            </td>
                            <td className="px-2 py-2 text-xs font-semibold text-slate-600 px-3">
                              {Number(form.totalStock || 0) - Number(form.soldStock || 0)}
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={submitInlineEdit}
                                  className="rounded-xl bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-500"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setEditingId(null); setForm({ code: '', size: '', price: '', totalStock: '', soldStock: '', remainingStock: '', active: true }); }}
                                  className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                      return (
                        <tr key={item.id} className="border-t border-slate-100 text-slate-800 hover:bg-slate-50/30 transition-colors">
                          <td className="px-3 py-3 font-medium">{item.code}</td>
                          <td className="px-3 py-3">{item.size}</td>
                          <td className="px-3 py-3 text-slate-500">{item.price ?? '—'}</td>
                          <td className="px-3 py-3">{item.totalStock ?? 0}</td>
                          <td className="px-3 py-3">{item.soldStock ?? 0}</td>
                          <td className="px-3 py-3">{item.remainingStock ?? 0}</td>
                          <td className="px-3 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => startEdit(item)} className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800">Edit</button>
                              <button onClick={() => deleteModel(item.id)} className="rounded-xl border border-rose-200 bg-rose-100 px-3 py-1.5 text-xs text-rose-700">Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <form onSubmit={submitModel} className="rounded-3xl border border-slate-200 bg-white p-5 w-full min-w-0">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Model' : 'Add Model'}</h3>
              <p className="mt-1 text-sm text-slate-500">Enter model code, size, price, and stock. Remaining is auto-calculated.</p>
              <div className="mt-4 grid gap-4">

                <label className="text-sm text-slate-700">
                  <span className="mb-1 block font-medium">Model Code</span>
                  <input
                    required
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="e.g. A65"
                  />
                </label>

                <label className="text-sm text-slate-700">
                  <span className="mb-1 block font-medium">Size</span>
                  <input
                    type="text"
                    value={form.size}
                    onChange={(e) => setForm({ ...form, size: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="e.g. 6 inch"
                  />
                </label>

                <label className="text-sm text-slate-700">
                  <span className="mb-1 block font-medium">Price (₹)</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="e.g. 95"
                  />
                </label>

                <label className="text-sm text-slate-700">
                  <span className="mb-1 block font-medium">Total Stock</span>
                  <input
                    type="number"
                    value={form.totalStock}
                    onChange={(e) => {
                      const total = Number(e.target.value || 0);
                      const sold = Number(form.soldStock || 0);
                      setForm({ ...form, totalStock: e.target.value, remainingStock: total - sold });
                    }}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="e.g. 80"
                  />
                </label>

                <label className="text-sm text-slate-700">
                  <span className="mb-1 block font-medium">Sold Stock</span>
                  <input
                    type="number"
                    value={form.soldStock}
                    onChange={(e) => {
                      const sold = Number(e.target.value || 0);
                      const total = Number(form.totalStock || 0);
                      setForm({ ...form, soldStock: e.target.value, remainingStock: total - sold });
                    }}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                    placeholder="e.g. 3"
                  />
                </label>

                {/* READ-ONLY: auto-computed from Total - Sold */}
                <label className="text-sm text-slate-700">
                  <span className="mb-1 block font-medium text-emerald-700">Remaining Stock <span className="text-[10px] font-normal text-slate-400">(auto-calculated)</span></span>
                  <input
                    type="number"
                    readOnly
                    value={Number(form.totalStock || 0) - Number(form.soldStock || 0)}
                    className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-800 font-bold cursor-not-allowed"
                  />
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
                  Active Status
                </label>

                <div className="flex gap-3">
                  <button type="submit" className="flex-1 rounded-2xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-500 transition-colors">
                    {editingId ? '✓ Update Model' : '+ Save Model'}
                  </button>
                  <button type="button" onClick={() => { setEditingId(null); setForm({ code: '', size: '', price: '', totalStock: '', soldStock: '', remainingStock: '', active: true }); }} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:border-amber-400 hover:bg-amber-50">
                    Reset
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 w-full min-w-0">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-bold text-slate-900">Stock & Dispatch Ledger</h3>
              <input
                value={stockSearch}
                onChange={(e) => setStockSearch(e.target.value)}
                placeholder="Search model or customer..."
                className="w-72 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
            
            {/* Horizontal Scrollable Spreadsheet Wrapper */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm border-collapse min-w-[850px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {/* Frozen headers with inline sticky positioning */}
                    <th 
                      style={{ position: 'sticky', left: 0, zIndex: 10, minWidth: '120px', width: '120px' }}
                      className="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-r border-slate-200 shadow-[1px_0_0_0_rgba(226,232,240,1)]"
                    >
                      Model Code
                    </th>
                    <th 
                      style={{ position: 'sticky', left: '120px', zIndex: 10, minWidth: '100px', width: '100px' }}
                      className="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-r border-slate-200 shadow-[1px_0_0_0_rgba(226,232,240,1)]"
                    >
                      Total Stock
                    </th>
                    <th 
                      style={{ position: 'sticky', left: '220px', zIndex: 10, minWidth: '130px', width: '130px' }}
                      className="bg-slate-50 px-4 py-3 font-bold text-slate-700 border-r-2 border-slate-300 shadow-[2px_0_0_0_rgba(203,213,225,1)]"
                    >
                      Remaining
                    </th>

                    {/* Scrollable customer columns headers */}
                    {Array.from({ length: numCustomerCols }).map((_, i) => (
                      <th 
                        key={i} 
                        className="px-4 py-3 font-semibold text-slate-500 border-r border-slate-200 min-w-[200px]"
                      >
                        Customer {i + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredModelsForStock.map((model) => {
                    const bookings = modelBookingsMap[model.id] || [];
                    return (
                      <tr key={model.id} className="border-b border-slate-100 text-slate-800 hover:bg-slate-50/40 transition-colors">
                        {/* Frozen left pane cells */}
                        <td 
                          style={{ position: 'sticky', left: 0, zIndex: 5, backgroundColor: 'white', minWidth: '120px', width: '120px' }}
                          className="px-4 py-4 font-extrabold text-slate-900 border-r border-slate-200 shadow-[1px_0_0_0_rgba(226,232,240,1)]"
                        >
                          {model.code}
                        </td>
                        <td 
                          style={{ position: 'sticky', left: '120px', zIndex: 5, backgroundColor: 'white', minWidth: '100px', width: '100px' }}
                          className="px-4 py-4 font-semibold text-slate-600 border-r border-slate-200 shadow-[1px_0_0_0_rgba(226,232,240,1)]"
                        >
                          {model.totalStock} units
                        </td>
                        <td 
                          style={{ position: 'sticky', left: '220px', zIndex: 5, backgroundColor: 'white', minWidth: '130px', width: '130px' }}
                          className="px-4 py-4 border-r-2 border-slate-300 shadow-[2px_0_0_0_rgba(203,213,225,1)]"
                        >
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            model.remainingStock === 0 ? 'bg-rose-100 text-rose-800' :
                            model.remainingStock <= 5 ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {model.remainingStock} left
                          </span>
                        </td>

                        {/* Customer entries */}
                        {Array.from({ length: numCustomerCols }).map((_, i) => {
                          const booking = bookings[i];
                          if (booking) {
                            return (
                              <td key={i} className="px-4 py-4 border-r border-slate-100 min-w-[200px]">
                                <div className="flex flex-col gap-1">
                                  <span className="font-bold text-slate-900 truncate max-w-[180px]" title={booking.customerName}>
                                    {booking.customerName}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-xs">
                                    <span className="inline-flex rounded-xl bg-amber-50 border border-amber-200 px-2 py-0.5 font-extrabold text-amber-800">
                                      {booking.qtyGiven} units
                                    </span>
                                    <span className="text-slate-400 font-semibold">{booking.orderNumber}</span>
                                  </div>
                                </div>
                              </td>
                            );
                          }
                          return (
                            <td key={i} className="px-4 py-4 border-r border-slate-100 text-slate-400 text-xs text-center min-w-[200px]">
                              —
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {filteredModelsForStock.length === 0 && (
                    <tr>
                      <td colSpan={3 + numCustomerCols} className="text-center text-slate-500 py-8">
                        No matching models or customer bookings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function Orders() {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [form, setForm] = useState({ customerName: '', mobile: '', address: '', city: '', deliveryDate: '', advance: 0, paymentMode: 'Cash', items: [{ modelId: '', quantity: 1, size: '', price: 0 }] });
  
  const [rowSearch, setRowSearch] = useState({});
  const [activeRow, setActiveRow] = useState(null);
  const [activeOpt, setActiveOpt] = useState({});
  const [successModal, setSuccessModal] = useState(null);

  const loadData = async () => {
    try {
      await ensureSession();
      const { data } = await api.get('/models');
      setModels(data);
      setForm((prev) => ({ ...prev, items: prev.items.length ? prev.items : [{ modelId: '', quantity: 1, size: '', price: 0 }] }));
    } catch (err) {
      console.error('Models load failed', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const updateLineItem = (index, key, value) => {
    if (key === 'modelId') {
      if (value !== '') {
        const isDuplicate = form.items.some((item, itemIndex) => itemIndex !== index && String(item.modelId) === String(value));
        if (isDuplicate) {
          alert('This model is already selected in another row.');
          return;
        }
      }
      const selectedModel = models.find((m) => String(m.id) === String(value));
      setForm((prev) => ({
        ...prev,
        items: prev.items.map((item, itemIndex) => itemIndex === index ? { ...item, modelId: value, size: selectedModel?.size || '', price: selectedModel?.price || 0 } : item)
      }));
    } else if (key === 'quantity') {
      const cleanVal = String(value).replace(/\D/g, '');
      setForm((prev) => ({
        ...prev,
        items: prev.items.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: cleanVal === '' ? '' : Number(cleanVal) } : item)
      }));
    }
  };

  const addLineItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, { modelId: '', quantity: 1, size: '', price: 0 }] }));

  const submitOrder = async (e) => {
    e.preventDefault();
    
    // Strict Validation: ensure all items match a valid stock model ID
    const invalidItem = form.items.find(item => !item.modelId || !models.some(m => String(m.id) === String(item.modelId)));
    if (invalidItem) {
      alert("Invalid Model! Please search and select a valid model from our stock list for all rows.");
      return;
    }

    try {
      await ensureSession();
      const response = await api.post('/orders', form);
      const createdOrder = response.data;
      
      // Open success options modal
      setSuccessModal(createdOrder);
      
      // Reset form fields
      setForm({ customerName: '', mobile: '', address: '', city: '', deliveryDate: '', advance: 0, paymentMode: 'Cash', items: [{ modelId: '', quantity: 1, size: '', price: 0 }] });
      setRowSearch({});
    } catch (err) {
      console.error('Create order failed', err);
      alert(err.response?.data?.error || 'Unable to create order');
    }
  };

  const getFilteredOptions = (searchText) => {
    const query = String(searchText || '').toLowerCase().trim();
    if (!query) return [];
    return models.filter((m) =>
      m.code.toLowerCase().includes(query) ||
      m.size.toLowerCase().includes(query)
    );
  };

  const handleKeyDown = (e, index, field) => {
    const totalItems = form.items.length;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevEl = document.getElementById(`model-search-input-${index}`);
      if (prevEl) prevEl.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (index < totalItems - 1) {
        const nextRowEl = document.getElementById(`quantity-input-${index + 1}`);
        if (nextRowEl) nextRowEl.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) {
        const prevRowEl = document.getElementById(`quantity-input-${index - 1}`);
        if (prevRowEl) prevRowEl.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      addLineItem();
      setTimeout(() => {
        const nextEl = document.getElementById(`model-search-input-${totalItems}`);
        if (nextEl) nextEl.focus();
      }, 50);
    }
  };

  const totalQuantity = form.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = form.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0);
  const totalModels = form.items.length;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Create New Order</h2>
            <p className="mt-1 text-sm text-slate-600">Select models from the catalog, fill quantity, and auto-calculated fields will populate.</p>
          </div>
          <div>
            <Link to="/orders/history" className="rounded-2xl border border-slate-700 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-amber-400 hover:text-amber-600 transition-colors block text-center">
              Order History
            </Link>
          </div>
        </div>
      </div>
      <form onSubmit={submitOrder} className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Customer Details</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <input value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="Customer name" className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" required />
              <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} placeholder="Mobile" className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" required />
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              <input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              <input type="number" min="0" value={form.advance || ''} onChange={(e) => setForm({ ...form, advance: Number(e.target.value || 0) })} placeholder="Advance Paid (₹)" className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
              <select value={form.paymentMode} onChange={(e) => setForm({ ...form, paymentMode: e.target.value })} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank">Bank</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2 mb-4">Order Items</h3>
            
            {/* Header row for large screens (PhonePe style) */}
            <div className="hidden md:grid md:grid-cols-[40px_2.2fr_1fr_1.1fr_1.1fr_1.5fr_80px] gap-3 px-4 py-2.5 text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-150 rounded-2xl uppercase tracking-wider mb-3">
              <div className="pl-1">#</div>
              <div>Model (Search & Select)</div>
              <div>Qty</div>
              <div>Size</div>
              <div>Price</div>
              <div>Net Total</div>
              <div className="text-center">Action</div>
            </div>

            <div className="space-y-2.5 md:space-y-1 bg-white">
              {form.items.map((item, index) => {
                const selectedModel = models.find((m) => String(m.id) === String(item.modelId));
                const currentSearchText = rowSearch[index] !== undefined 
                  ? rowSearch[index] 
                  : (selectedModel?.code || '');
                const filteredOpts = getFilteredOptions(currentSearchText);

                return (
                  <div 
                    key={index} 
                    className="grid grid-cols-1 md:grid-cols-[40px_2.2fr_1fr_1.1fr_1.1fr_1.5fr_80px] gap-3 items-center bg-white border border-slate-200 md:border-transparent md:border-b md:border-slate-100 p-4 md:p-1.5 rounded-3xl md:rounded-none hover:bg-slate-50/40 transition-colors shadow-sm md:shadow-none"
                  >
                    {/* Index (No) */}
                    <div className="hidden md:block text-slate-400 font-extrabold text-xs pl-2">{index + 1}</div>

                    {/* Model Search Input */}
                    <div>
                      <label className="block md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Model (Search & Select)</label>
                      <div className="relative">
                        <input
                          type="text"
                          id={`model-search-input-${index}`}
                          value={currentSearchText}
                          placeholder="Search GA-001..."
                          onChange={(e) => {
                            const val = e.target.value;
                            setRowSearch((prev) => ({ ...prev, [index]: val }));
                            setActiveRow(index);
                            setActiveOpt((prev) => ({ ...prev, [index]: 0 }));
                          }}
                          onFocus={() => {
                            setActiveRow(index);
                            setActiveOpt((prev) => ({ ...prev, [index]: 0 }));
                          }}
                          onBlur={() => {
                            setTimeout(() => {
                              if (activeRow === index) {
                                setActiveRow(null);
                              }
                              // Strict Auto-Correction / Reversion on Blur
                              const query = rowSearch[index];
                              if (query !== undefined) {
                                const text = String(query).trim().toLowerCase();
                                const exactMatch = models.find(m => m.code.toLowerCase() === text);
                                if (exactMatch) {
                                  const isDup = form.items.some((line, lineIdx) => lineIdx !== index && String(line.modelId) === String(exactMatch.id));
                                  if (isDup) {
                                    alert('This model is already selected in another row.');
                                    updateLineItem(index, 'modelId', '');
                                  } else {
                                    updateLineItem(index, 'modelId', exactMatch.id);
                                  }
                                } else {
                                  const prevModel = models.find(m => String(m.id) === String(item.modelId));
                                  if (!prevModel) {
                                    updateLineItem(index, 'modelId', '');
                                  }
                                }
                                setRowSearch(prev => {
                                  const next = { ...prev };
                                  delete next[index];
                                  return next;
                                });
                              }
                            }, 250);
                          }}
                          onKeyDown={(e) => {
                            const options = getFilteredOptions(currentSearchText);
                            const currentOptIdx = activeOpt[index] || 0;

                            if (e.key === 'ArrowDown') {
                              if (options.length > 0) {
                                e.preventDefault();
                                const nextIdx = (currentOptIdx + 1) % options.length;
                                setActiveOpt(prev => ({ ...prev, [index]: nextIdx }));
                              } else {
                                e.preventDefault();
                                if (index < form.items.length - 1) {
                                  const nextEl = document.getElementById(`model-search-input-${index + 1}`);
                                  if (nextEl) nextEl.focus();
                                }
                              }
                            } else if (e.key === 'ArrowUp') {
                              if (options.length > 0) {
                                e.preventDefault();
                                const prevIdx = (currentOptIdx - 1 + options.length) % options.length;
                                setActiveOpt(prev => ({ ...prev, [index]: prevIdx }));
                              } else {
                                e.preventDefault();
                                if (index > 0) {
                                  const prevEl = document.getElementById(`model-search-input-${index - 1}`);
                                  if (prevEl) prevEl.focus();
                                }
                              }
                            } else if (e.key === 'Enter') {
                              e.preventDefault();
                              if (options.length > 0 && options[currentOptIdx]) {
                                const selected = options[currentOptIdx];
                                updateLineItem(index, 'modelId', selected.id);
                                setRowSearch(prev => ({ ...prev, [index]: undefined }));
                                setActiveRow(null);
                                setTimeout(() => {
                                  const qtyEl = document.getElementById(`quantity-input-${index}`);
                                  if (qtyEl) qtyEl.focus();
                                }, 50);
                              } else {
                                addLineItem();
                                const totalItems = form.items.length;
                                setTimeout(() => {
                                  const nextEl = document.getElementById(`model-search-input-${totalItems}`);
                                  if (nextEl) nextEl.focus();
                                }, 50);
                              }
                            } else if (e.key === 'ArrowRight') {
                              e.preventDefault();
                              const qtyEl = document.getElementById(`quantity-input-${index}`);
                              if (qtyEl) qtyEl.focus();
                            } else if (e.key === 'Escape') {
                              e.preventDefault();
                              setActiveRow(null);
                            }
                          }}
                          className="w-full rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                        />

                        {/* Dropdown Floating Suggestions */}
                        {activeRow === index && filteredOpts.length > 0 && (
                          <ul className="absolute z-50 w-full max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl mt-1 text-slate-800 text-sm">
                            {filteredOpts.map((model, optIdx) => {
                              const isSelected = (activeOpt[index] || 0) === optIdx;
                              const isAlreadyChosen = form.items.some((line, lineIdx) => lineIdx !== index && String(line.modelId) === String(model.id));
                              
                              return (
                                <li
                                  key={model.id}
                                  onMouseDown={() => {
                                    if (isAlreadyChosen) {
                                      alert('This model is already selected in another row.');
                                      return;
                                    }
                                    updateLineItem(index, 'modelId', model.id);
                                    setRowSearch(prev => ({ ...prev, [index]: undefined }));
                                    setActiveRow(null);
                                    setTimeout(() => {
                                      const qtyEl = document.getElementById(`quantity-input-${index}`);
                                      if (qtyEl) qtyEl.focus();
                                    }, 50);
                                  }}
                                  className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-none ${
                                    isSelected ? 'bg-amber-100 text-slate-900 font-bold' : 'hover:bg-slate-50'
                                  } ${isAlreadyChosen ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                  <span>{model.code} {isAlreadyChosen ? '(Already Selected)' : ''}</span>
                                  <span className="text-xs text-slate-400 font-normal">
                                    {model.size} · ₹{Number(model.price || 0).toFixed(2)} · Stock: {model.remainingStock}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Quantity</label>
                      <input
                        id={`quantity-input-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, index, 'quantity')}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none"
                      />
                    </div>

                    {/* Size Badge */}
                    <div className="flex justify-between md:block items-center">
                      <label className="block md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Size</label>
                      <span className="inline-flex rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 md:min-w-[80px] text-center justify-center">
                        {selectedModel?.size || '—'}
                      </span>
                    </div>

                    {/* Unit Price Badge */}
                    <div className="flex justify-between md:block items-center">
                      <label className="block md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Unit Price</label>
                      <span className="inline-flex rounded-xl bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 md:min-w-[80px] text-center justify-center">
                        {selectedModel?.price ? `₹${selectedModel.price}` : '—'}
                      </span>
                    </div>

                    {/* Net Total Badge */}
                    <div className="flex justify-between md:block items-center">
                      <label className="block md:hidden text-[9px] font-black text-slate-400 uppercase tracking-widest">Net Price</label>
                      <span className="inline-flex rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-700 md:min-w-[100px] text-center justify-center">
                        ₹{Number((item.quantity || 0) * (selectedModel?.price || 0)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Remove Action Button */}
                    <div className="flex justify-end md:justify-center pt-2 md:pt-0">
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }))}
                        className="w-full md:w-auto rounded-2xl border border-rose-250 bg-rose-50/50 hover:bg-rose-100/50 px-3 py-2 text-xs font-black text-rose-700 uppercase tracking-widest transition-colors active:scale-95 duration-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              type="button" 
              onClick={addLineItem} 
              className="mt-4 rounded-2xl border border-amber-300 bg-white px-5 py-2.5 text-xs font-black text-amber-600 hover:bg-amber-50 active:scale-95 transition-all shadow-sm flex items-center gap-1"
            >
              <span className="text-sm font-bold">+</span> Add Line Item
            </button>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-slate-600">Total Models Selected</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{totalModels}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600">Total Quantity</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">{totalQuantity}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600">Total Price</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">₹{Number(totalPrice).toFixed(2)}</p>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-500">Create Order</button>
        </div>
      </form>

      {/* Premium Success Modal */}
      {successModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Success Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h3 className="text-center text-xl font-bold text-slate-900">Order Booked Successfully!</h3>
            <p className="mt-1 text-center text-sm text-slate-500">Order Reference: <span className="font-semibold text-amber-600">{successModal.orderNumber}</span></p>
            
            {/* Order Summary Snapshot */}
            <div className="mt-5 rounded-2xl bg-slate-50 border border-slate-100 p-4 text-sm text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold text-slate-900">{successModal.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Bill:</span>
                <span className="font-semibold text-slate-900">₹{Number(successModal.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Amount Paid:</span>
                <span className={`font-semibold ${successModal.balance === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  ₹{Number(successModal.advance).toFixed(2)} {successModal.balance === 0 ? '(Fully Paid)' : '(Advance)'}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Balance Due:</span>
                <span className={successModal.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                  ₹{Number(successModal.balance).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await ensureSession();
                    const res = await api.post(`/billing/generate/${successModal.id}`);
                    const invoice = res.data.data;
                    setSuccessModal(null);
                    // Navigate to invoice page
                    navigate(`/billing/${invoice.id}`);
                  } catch (err) {
                    console.error('Invoice generation failed', err);
                    alert(err.response?.data?.message || 'Failed to generate invoice');
                  }
                }}
                className="w-full rounded-2xl bg-emerald-400 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-500 shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Yes, Print Invoice
              </button>
              
              <button
                type="button"
                onClick={() => setSuccessModal(null)}
                className="w-full rounded-2xl border border-slate-300 bg-white py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                No, Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersHistory() {
  const [orders, setOrders] = useState([]);
  const [models, setModels] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [filter, setFilter] = useState('All');

  const [rowSearch, setRowSearch] = useState({});
  const [activeRow, setActiveRow] = useState(null);
  const [activeOpt, setActiveOpt] = useState({});

  const loadData = async () => {
    try {
      await ensureSession();
      const [ordersRes, modelsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/models')
      ]);
      setOrders(ordersRes.data);
      setModels(modelsRes.data);
    } catch (err) {
      console.error('Order history load failed', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'All') return true;
    if (filter === 'Pending') return order.status === 'Booked' || order.status === 'Packed';
    if (filter === 'Completed') return order.status === 'Delivered';
    if (filter === 'Cancelled') return order.status === 'Cancelled';
    return true;
  });

  const deleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order? This will restore all model stock levels.')) return;
    try {
      await ensureSession();
      await api.delete(`/orders/${orderId}`);
      alert('Order deleted successfully');
      loadData();
    } catch (err) {
      console.error('Delete order failed', err);
      alert(err.response?.data?.error || 'Unable to delete order');
    }
  };

  const startEdit = (order) => {
    setEditingOrder(order);
    setRowSearch({});
    setEditForm({
      customerName: order.customerName,
      mobile: order.mobile,
      address: order.address,
      city: order.city,
      deliveryDate: order.deliveryDate || '',
      status: order.status || 'Booked',
      items: order.items.map(item => ({
        modelId: item.modelId,
        quantity: item.quantity,
        size: item.size,
        price: item.price
      }))
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    
    // Strict Validation: ensure all items match a valid stock model ID
    const invalidItem = editForm.items.find(item => !item.modelId || !models.some(m => String(m.id) === String(item.modelId)));
    if (invalidItem) {
      alert("Invalid Model! Please search and select a valid model from our stock list for all rows.");
      return;
    }

    try {
      await ensureSession();
      await api.put(`/orders/${editingOrder.id}`, editForm);
      setEditingOrder(null);
      setEditForm(null);
      setRowSearch({});
      alert('Order updated successfully');
      loadData();
    } catch (err) {
      console.error('Update order failed', err);
      alert(err.response?.data?.error || 'Unable to update order');
    }
  };

  const handleEditKeyDown = (e, index, field) => {
    const totalItems = editForm.items.length;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevEl = document.getElementById(`edit-model-search-input-${index}`);
      if (prevEl) prevEl.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (index < totalItems - 1) {
        const nextRowEl = document.getElementById(`edit-quantity-input-${index + 1}`);
        if (nextRowEl) nextRowEl.focus();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (index > 0) {
        const prevRowEl = document.getElementById(`edit-quantity-input-${index - 1}`);
        if (prevRowEl) prevRowEl.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setEditForm(prev => ({
        ...prev,
        items: [...prev.items, { modelId: '', quantity: 1, size: '', price: 0 }]
      }));
      setTimeout(() => {
        const nextEl = document.getElementById(`edit-model-search-input-${totalItems}`);
        if (nextEl) nextEl.focus();
      }, 50);
    }
  };

  const getFilteredOptions = (searchText) => {
    const query = String(searchText || '').toLowerCase().trim();
    if (!query) return [];
    return models.filter((m) =>
      m.code.toLowerCase().includes(query) ||
      m.size.toLowerCase().includes(query)
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Order History</h2>
            <p className="mt-1 text-sm text-slate-600">A customer-friendly summary with personal contact details omitted.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/orders" className="rounded-2xl border border-amber-200 bg-amber-100 px-5 py-2.5 text-sm font-semibold text-amber-800 hover:bg-amber-200 transition-colors block text-center">New Order</Link>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="space-y-6">
          {/* Gorgeous Pill Filter Section */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
            <span className="mr-2 text-xs font-bold uppercase tracking-wider text-slate-400">Filter Orders:</span>
            {['All', 'Pending', 'Completed', 'Cancelled'].map((tab) => {
              const count = orders.filter(order => {
                if (tab === 'All') return true;
                if (tab === 'Pending') return order.status === 'Booked' || order.status === 'Packed';
                if (tab === 'Completed') return order.status === 'Delivered';
                if (tab === 'Cancelled') return order.status === 'Cancelled';
                return false;
              }).length;

              const isActive = filter === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm font-bold scale-[1.02]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  }`}
                >
                  <span>{tab}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] transition-colors duration-200 ${
                    isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-6">No orders found. Use the "New Order" page to create one!</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-6">No {filter.toLowerCase()} orders found.</p>
            ) : (
              filteredOrders.map((order) => (
                <article key={order.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      {/* Display Customer Name prominently as the header! */}
                      <h3 className="text-lg font-bold text-slate-900">{order.customerName || 'Walk-in Customer'}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-amber-600">{order.orderNumber}</span>
                        <span>·</span>
                        <span>Date: {order.orderDate}</span>
                        <span>·</span>
                        <span>Delivery: {order.deliveryDate || 'N/A'}</span>
                      </div>
                    </div>
                    
                    {/* Clean Status Badge & Simple Button Controls */}
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                        order.status === 'Packed' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {order.status}
                      </span>
                      <button onClick={() => startEdit(order)} className="rounded-2xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-amber-400 hover:text-amber-600 transition-colors">Edit</button>
                      <button onClick={() => deleteOrder(order.id)} className="rounded-2xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors">Delete</button>
                    </div>
                  </div>

                  {/* Ordered Items Chips */}
                  <div className="mt-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ordered Models</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {order.items?.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center rounded-xl bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-800 border border-slate-100">
                          {String(item.name || '').replace(/^ganesh\s+mod+el\s*[-:\s]\s*/i, '').replace(/^ganesh\s+mod+el\s*/i, '')} <strong className="ml-1 text-amber-600">x{item.quantity}</strong>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 border-t border-slate-50 pt-4 text-center">
                    <div className="rounded-2xl bg-slate-50 p-2.5">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Total Bill</p>
                      <p className="mt-1 text-sm font-bold text-slate-800">₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50/50 p-2.5">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Advance</p>
                      <p className="mt-1 text-sm font-bold text-amber-700">₹{Number(order.advance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`rounded-2xl p-2.5 ${Number(order.balance || 0) > 0 ? 'bg-rose-50/50' : 'bg-emerald-50/50'}`}>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Balance Due</p>
                      <p className={`mt-1 text-sm font-bold ${Number(order.balance || 0) > 0 ? 'text-rose-700' : 'text-emerald-700'}`}>
                        ₹{Number(order.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modify/Edit Order Modal */}
      {editingOrder && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-xl font-semibold text-slate-900">Modify Order {editingOrder.orderNumber}</h3>
              <button onClick={() => { setEditingOrder(null); setEditForm(null); }} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={submitEdit} className="mt-4 space-y-6">
              {/* Customer Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Customer Details</h4>
                <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
                    <input value={editForm.customerName} onChange={(e) => setEditForm({ ...editForm, customerName: e.target.value })} placeholder="Customer name" className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile</label>
                    <input value={editForm.mobile} onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} placeholder="Mobile" className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" required />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                    <input value={editForm.address} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} placeholder="Address" className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                    <input value={editForm.city} onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} placeholder="City" className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Delivery Date</label>
                    <input type="date" value={editForm.deliveryDate} onChange={(e) => setEditForm({ ...editForm, deliveryDate: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
                    <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
                      <option value="Booked">Booked</option>
                      <option value="Packed">Packed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-wider">Order Items</h4>
                <div className="mt-3 space-y-3 max-h-60 overflow-y-auto p-1">
                  {editForm.items.map((item, index) => {
                    const selectedModel = models.find((m) => String(m.id) === String(item.modelId));
                    const currentSearchText = rowSearch[index] !== undefined 
                      ? rowSearch[index] 
                      : (selectedModel?.code || '');
                    const filteredOpts = getFilteredOptions(currentSearchText);

                    return (
                      <div key={index} className="grid gap-2 md:grid-cols-[1.5fr_0.6fr_0.8fr_0.8fr_auto] items-center rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div>
                          <div className="relative">
                            <input
                              type="text"
                              id={`edit-model-search-input-${index}`}
                              value={currentSearchText}
                              placeholder="Type model code (e.g. A60)..."
                              onChange={(e) => {
                                const val = e.target.value;
                                setRowSearch((prev) => ({ ...prev, [index]: val }));
                                setActiveRow(index);
                                setActiveOpt((prev) => ({ ...prev, [index]: 0 }));
                              }}
                              onFocus={() => {
                                setActiveRow(index);
                                setActiveOpt((prev) => ({ ...prev, [index]: 0 }));
                              }}
                              onBlur={() => {
                                setTimeout(() => {
                                  if (activeRow === index) {
                                    setActiveRow(null);
                                  }
                                  // Strict Auto-Correction / Reversion on Blur
                                  const query = rowSearch[index];
                                  if (query !== undefined) {
                                    const text = String(query).trim().toLowerCase();
                                    const exactMatch = models.find(m => m.code.toLowerCase() === text);
                                    if (exactMatch) {
                                      const isDup = editForm.items.some((line, lineIdx) => lineIdx !== index && String(line.modelId) === String(exactMatch.id));
                                      if (isDup) {
                                        alert('This model is already selected in another row.');
                                        setEditForm({
                                          ...editForm,
                                          items: editForm.items.map((line, lineIdx) => lineIdx === index ? { ...line, modelId: '' } : line)
                                        });
                                      } else {
                                        setEditForm({
                                          ...editForm,
                                          items: editForm.items.map((line, lineIdx) => lineIdx === index ? { ...line, modelId: exactMatch.id, size: exactMatch.size || '', price: exactMatch.price || 0 } : line)
                                        });
                                      }
                                    } else {
                                      const prevModel = models.find(m => String(m.id) === String(item.modelId));
                                      if (!prevModel) {
                                        setEditForm({
                                          ...editForm,
                                          items: editForm.items.map((line, lineIdx) => lineIdx === index ? { ...line, modelId: '' } : line)
                                        });
                                      }
                                    }
                                    setRowSearch(prev => {
                                      const next = { ...prev };
                                      delete next[index];
                                      return next;
                                    });
                                  }
                                }, 250);
                              }}
                              onKeyDown={(e) => {
                                const options = getFilteredOptions(currentSearchText);
                                const currentOptIdx = activeOpt[index] || 0;

                                if (e.key === 'ArrowDown') {
                                  if (options.length > 0) {
                                    e.preventDefault();
                                    const nextIdx = (currentOptIdx + 1) % options.length;
                                    setActiveOpt(prev => ({ ...prev, [index]: nextIdx }));
                                  } else {
                                    e.preventDefault();
                                    if (index < editForm.items.length - 1) {
                                      const nextEl = document.getElementById(`edit-model-search-input-${index + 1}`);
                                      if (nextEl) nextEl.focus();
                                    }
                                  }
                                } else if (e.key === 'ArrowUp') {
                                  if (options.length > 0) {
                                    e.preventDefault();
                                    const prevIdx = (currentOptIdx - 1 + options.length) % options.length;
                                    setActiveOpt(prev => ({ ...prev, [index]: prevIdx }));
                                  } else {
                                    e.preventDefault();
                                    if (index > 0) {
                                      const prevEl = document.getElementById(`edit-model-search-input-${index - 1}`);
                                      if (prevEl) prevEl.focus();
                                    }
                                  }
                                } else if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (options.length > 0 && options[currentOptIdx]) {
                                    const selected = options[currentOptIdx];
                                    
                                    const isDup = editForm.items.some((line, lineIdx) => lineIdx !== index && String(line.modelId) === String(selected.id));
                                    if (isDup) {
                                      alert('This model is already selected.');
                                      return;
                                    }

                                    setEditForm({
                                      ...editForm,
                                      items: editForm.items.map((line, lineIdx) => lineIdx === index ? { ...line, modelId: selected.id, size: selected.size || '', price: selected.price || 0 } : line)
                                    });
                                    setRowSearch(prev => ({ ...prev, [index]: undefined }));
                                    setActiveRow(null);
                                    
                                    setTimeout(() => {
                                      const qtyEl = document.getElementById(`edit-quantity-input-${index}`);
                                      if (qtyEl) qtyEl.focus();
                                    }, 50);
                                  } else {
                                    setEditForm(prev => ({
                                      ...prev,
                                      items: [...prev.items, { modelId: '', quantity: 1, size: '', price: 0 }]
                                    }));
                                    const totalItems = editForm.items.length;
                                    setTimeout(() => {
                                      const nextEl = document.getElementById(`edit-model-search-input-${totalItems}`);
                                      if (nextEl) nextEl.focus();
                                    }, 50);
                                  }
                                } else if (e.key === 'ArrowRight') {
                                  e.preventDefault();
                                  const qtyEl = document.getElementById(`edit-quantity-input-${index}`);
                                  if (qtyEl) qtyEl.focus();
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  setActiveRow(null);
                                }
                              }}
                              className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                            />

                            {/* Dropdown Suggestions */}
                            {activeRow === index && filteredOpts.length > 0 && (
                              <ul className="absolute z-50 w-full max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl mt-1 text-slate-800 text-sm">
                                {filteredOpts.map((model, optIdx) => {
                                  const isSelected = (activeOpt[index] || 0) === optIdx;
                                  const isAlreadyChosen = editForm.items.some((line, lineIdx) => lineIdx !== index && String(line.modelId) === String(model.id));
                                  
                                  return (
                                    <li
                                      key={model.id}
                                      onMouseDown={() => {
                                        if (isAlreadyChosen) {
                                          alert('This model is already selected in another row.');
                                          return;
                                        }
                                        setEditForm({
                                          ...editForm,
                                          items: editForm.items.map((line, lineIdx) => lineIdx === index ? { ...line, modelId: model.id, size: model.size || '', price: model.price || 0 } : line)
                                        });
                                        setRowSearch(prev => ({ ...prev, [index]: undefined }));
                                        setActiveRow(null);
                                        setTimeout(() => {
                                          const qtyEl = document.getElementById(`edit-quantity-input-${index}`);
                                          if (qtyEl) qtyEl.focus();
                                        }, 50);
                                      }}
                                      className={`px-4 py-3 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-50 last:border-none ${
                                        isSelected ? 'bg-amber-100 text-slate-900 font-bold' : 'hover:bg-slate-50'
                                      } ${isAlreadyChosen ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                      <span>{model.code} {isAlreadyChosen ? '(Already Selected)' : ''}</span>
                                      <span className="text-xs text-slate-400 font-normal">
                                        {model.size} · ₹{Number(model.price || 0).toFixed(2)} · Stock: {model.remainingStock}
                                      </span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                        <div>
                          <input
                            id={`edit-quantity-input-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={item.quantity}
                            onChange={(e) => {
                              const cleanVal = e.target.value.replace(/\D/g, '');
                              setEditForm({
                                ...editForm,
                                items: editForm.items.map((line, lineIdx) => lineIdx === index ? { ...line, quantity: cleanVal === '' ? '' : Number(cleanVal) } : line)
                              });
                            }}
                            onKeyDown={(e) => handleEditKeyDown(e, index, 'quantity')}
                            className="w-full rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
                          />
                        </div>
                        <div className="text-xs text-slate-500 px-2 font-medium">Size: {item.size || '—'}</div>
                        <div className="text-xs text-slate-500 px-2 font-medium">Price: ₹{Number(item.price || 0).toFixed(2)}</div>
                        <div>
                          <button type="button" onClick={() => setEditForm({
                            ...editForm,
                            items: editForm.items.filter((_, lineIdx) => lineIdx !== index)
                          })} className="rounded-2xl border border-rose-200 bg-rose-100 px-3 py-1.5 text-xs text-rose-700">Remove</button>
                        </div>
                      </div>
                    );
                  })}
                  <button type="button" onClick={() => setEditForm({
                    ...editForm,
                    items: [...editForm.items, { modelId: '', quantity: 1, size: '', price: 0 }]
                  })} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 hover:border-amber-400 hover:bg-amber-50">+ Add Item</button>
                </div>
              </div>

              {/* Summary & Save */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200 pt-4">
                <p className="text-sm font-semibold text-slate-800">
                  Total Items: <span className="text-amber-600 font-bold">{editForm.items.reduce((sum, item) => sum + (item.quantity || 0), 0)}</span> · Total Price: <span className="text-emerald-600 font-bold">₹{Number(editForm.items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.price || 0)), 0)).toFixed(2)}</span>
                </p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => { setEditingOrder(null); setEditForm(null); }} className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="rounded-2xl bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-500">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Payments() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ orderId: '', amount: '', mode: 'Cash', notes: '' });

  const loadData = async () => {
    try {
      await ensureSession();
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Orders load failed', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const submitPayment = async (e) => {
    e.preventDefault();
    try {
      await ensureSession();
      await api.post('/payments', form);
      alert('Payment recorded successfully');
      setForm({ orderId: '', amount: '', mode: 'Cash', notes: '' });
      loadData();
    } catch (err) {
      console.error('Payment failed', err);
      alert(err.response?.data?.error || 'Unable to record payment');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Payments</h2>
            <p className="mt-1 text-sm text-slate-600">Record booking advances and final balance payments dynamically.</p>
          </div>
          <div>
            <Link to="/payments/history" className="rounded-2xl border border-slate-700 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-amber-400 hover:text-amber-600 transition-colors block text-center">
              Payment History
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200 bg-white p-8 shadow-sm w-full min-w-0">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Record Payment</h3>
        <form onSubmit={submitPayment} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Order</label>
            <select value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" required>
              <option value="">-- Select Order --</option>
              {orders.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.customerName} ({order.orderNumber}) · Balance: ₹{Number(order.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Amount (₹)</label>
            <input type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Enter payment amount" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" required />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Mode</label>
            <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Bank">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
            <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add any payment remarks..." className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
          </div>
          <button type="submit" className="w-full mt-2 rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-950 hover:bg-amber-500 shadow-sm transition-colors">
            Save Payment Record
          </button>
        </form>
      </div>
    </div>
  );
}

function PaymentsHistory() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isAnalysisUnlocked, setIsAnalysisUnlocked] = useState(
    sessionStorage.getItem('payments_analysis_unlocked') === 'true'
  );
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [dashData, setDashData] = useState(null);

  const loadData = async () => {
    try {
      await ensureSession();
      const [ordersRes, paymentsRes] = await Promise.all([
        api.get('/orders'),
        api.get('/payments')
      ]);
      setOrders(ordersRes.data);
      setPayments(paymentsRes.data);

      if (isAnalysisUnlocked) {
        try {
          const dashRes = await api.get('/dashboard');
          setDashData(dashRes.data);
        } catch (dashErr) {
          console.error('Failed to load dashboard analytics data:', dashErr);
        }
      }
    } catch (err) {
      console.error('Ledger data load failed', err);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAnalysisUnlocked]);

  const handleUnlock = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setIsVerifying(true);
    setErrorMsg('');
    try {
      await ensureSession();
      // Call secure POST /api/auth/verify-password
      const res = await api.post('/auth/verify-password', { password: passwordInput });
      if (res.data && res.data.ok) {
        sessionStorage.setItem('payments_analysis_unlocked', 'true');
        setIsAnalysisUnlocked(true);
        setPasswordInput('');
      } else {
        setErrorMsg('Invalid password.');
      }
    } catch (err) {
      console.error('Verification failed', err);
      setErrorMsg(err.response?.data?.error || 'Incorrect password. Access denied.');
    } finally {
      setIsVerifying(false);
    }
  };

  const cleanNotes = (notes) => {
    if (!notes) return '';
    const s = String(notes).trim();
    if (s === 'null' || s === 'NULL' || s === 'undefined' || s === 'None' || s === '-') return '';
    return s;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Payment History</h2>
            <p className="mt-1 text-sm text-slate-655">A comprehensive chronological record of all booking advances and transactions.</p>
          </div>
          <div>
            <Link to="/payments" className="rounded-2xl border border-slate-700 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-amber-400 hover:text-amber-600 transition-colors block text-center">
              Record Payment
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic welcome quick stats summary or Lock Overlay */}
      {!isAnalysisUnlocked ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 w-full min-w-0">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm shrink-0 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Payments Analysis Locked</h3>
              <p className="text-xs text-slate-500 font-medium">Verify your administrator login password to view analytics & stock metrics.</p>
            </div>
          </div>
          <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow sm:w-64">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter login password"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none"
                required
              />
              {errorMsg && (
                <p className="absolute left-1 -bottom-5 text-[10px] font-bold text-rose-600">{errorMsg}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isVerifying}
              className="rounded-2xl bg-amber-400 text-slate-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-amber-500 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              {isVerifying ? 'Verifying...' : 'Unlock'}
            </button>
          </form>
        </div>
      ) : (
        dashData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full min-w-0">
            {[
              { label: 'Pending Orders', value: dashData.cards[0].value, color: 'border-amber-100 text-amber-600 bg-white hover:border-amber-300 shadow-sm' },
              { label: 'Payments Pending', value: dashData.cards[1].value, color: 'border-emerald-100 text-emerald-600 bg-white hover:border-emerald-300 shadow-sm' },
              { label: 'Revenue Recorded', value: dashData.cards[2].value, color: 'border-indigo-100 text-indigo-600 bg-white hover:border-indigo-300 shadow-sm' },
              { label: 'Total Available Stock', value: dashData.cards[3].value, color: 'border-sky-100 text-sky-600 bg-white hover:border-sky-300 shadow-sm' }
            ].map((card, i) => (
              <div key={i} className={`rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${card.color}`}>
                <p className="text-[10px] uppercase font-black tracking-wider opacity-60">{card.label}</p>
                <p className="text-lg md:text-xl font-black mt-1 leading-none">{card.value}</p>
              </div>
            ))}
          </div>
        )
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm w-full min-w-0">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-6">Chronological Ledger</h3>
          <div className="space-y-4">
            {payments.length === 0 ? (
              <p className="text-center text-sm text-slate-500 py-6">No payments recorded yet.</p>
            ) : (
              [...payments].reverse().map((payment) => {
                const order = orders.find((item) => String(item.id) === String(payment.orderId));
                const notes = cleanNotes(payment.notes);
                
                return (
                  <article key={payment.id} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        {/* Customer Name and Order Reference */}
                        <h4 className="text-base font-bold text-slate-900">
                          {order?.customerName || 'Walk-in Customer'}
                        </h4>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-amber-600">{order?.orderNumber || `Order #${payment.orderId}`}</span>
                          <span>·</span>
                          <span>Date: {payment.paymentDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Payment Mode Badge */}
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                          payment.mode === 'UPI' ? 'bg-indigo-100 text-indigo-800' :
                          payment.mode === 'Cash' ? 'bg-amber-100 text-amber-800' :
                          payment.mode === 'Bank' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {payment.mode}
                        </span>
                        
                        {/* Payment Amount */}
                        <span className="inline-flex rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-1.5 text-sm font-extrabold text-emerald-700">
                          ₹{Number(payment.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                    
                    {/* Clean Remarks */}
                    {notes && (
                      <div className="mt-3 border-t border-slate-50 pt-2.5">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Remarks</p>
                        <p className="mt-1 text-sm text-slate-650 italic">"{notes}"</p>
                      </div>
                    )}
                  </article>
                );
              })
            )}
          </div>
      </div>
    </div>
  );
}

function Delivery() {
  const [orders, setOrders] = useState([]);

  const loadData = async () => {
    try {
      await ensureSession();
      const { data } = await api.get('/deliveries');
      setOrders(data);
    } catch (err) {
      console.error('Delivery load failed', err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const setStatus = async (orderId, status) => {
    try {
      await ensureSession();
      await api.patch(`/deliveries/${orderId}`, { status });
      await loadData();
    } catch (err) {
      console.error('Delivery update failed', err);
      alert(err.response?.data?.error || 'Unable to update delivery status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <h2 className="text-2xl font-semibold">Delivery</h2>
        <p className="mt-1 text-sm text-slate-600">Manage dispatched, delivered, and cancelled orders from one view.</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 w-full min-w-0">
        <div className="space-y-3">
          {orders.map((order) => (
            <article key={order.id} className="rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-700 w-full min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{order.orderNumber}</p>
                  <p className="text-slate-500">{order.customerName} · {order.mobile}</p>
                </div>
                <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700">{order.status}</span>
              </div>
              <p className="mt-2 text-slate-600">Delivery: {order.deliveryDate} · Balance ₹{Number(order.balance || 0).toFixed(2)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => setStatus(order.id, 'Packed')} className="rounded-2xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 hover:border-amber-400 hover:bg-amber-50">Mark Packed</button>
                <button onClick={() => setStatus(order.id, 'Delivered')} className="rounded-2xl border border-emerald-200 bg-emerald-100 px-3 py-2 text-xs text-emerald-800">Mark Delivered</button>
                <button onClick={() => setStatus(order.id, 'Cancelled')} className="rounded-2xl border border-rose-200 bg-rose-100 px-3 py-2 text-xs text-rose-700">Cancel</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function Page({ title, body }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-6"><h2 className="text-2xl font-semibold">{title}</h2><p className="mt-4 max-w-3xl text-slate-600">{body}</p></div>;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('ganesha_user'));

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ApiLoader>
      <Layout>
        <Routes>
          <Route path="/" element={<WelcomePortal />} />
          <Route path="/models" element={<Models />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/new" element={<Navigate to="/orders" replace />} />
          <Route path="/orders/history" element={<OrdersHistory />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/payments/history" element={<PaymentsHistory />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/billing/:id" element={<InvoicePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ApiLoader>
  );
}
