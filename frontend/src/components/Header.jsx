import { useAuth } from '../context/AuthContext.jsx';
import { useState, useEffect } from 'react';
import { getMyNotifications } from '../services/notification.service.js';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      try {
        const res = await getMyNotifications();
        const list = res.data ?? res;
        if (!mounted) return;
        const u = Array.isArray(list) ? list.filter(n => !n.read).length : 0;
        setUnread(u);
      } catch (e) {
        // ignore
      }
    }
    fetchCount();
    const t = setInterval(fetchCount, 30000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3">
          <img src="/src/assets/logo.svg" alt="logo" className="w-10 h-10" />
          <div>
            <div className="text-lg font-bold text-law-primary">Intranet Facultad de Derecho</div>
            <div className="text-xs text-slate-500">Sistema de Gestión Académica</div>
          </div>
        </div>

        {/* search removed as requested */}
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/notifications/me')} className="relative p-2 rounded hover:bg-slate-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && <span className="absolute -top-1 -right-1 bg-law-accent text-slate-900 text-xs font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-law-primary text-white flex items-center justify-center font-bold">{(user?.email || 'U').charAt(0).toUpperCase()}</div>
          <div className="text-sm">
            <div className="font-semibold">{user?.email ? user.email.split('@')[0] : 'Usuario'}</div>
            <div className="text-xs text-slate-500">{user?.role || ''}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
