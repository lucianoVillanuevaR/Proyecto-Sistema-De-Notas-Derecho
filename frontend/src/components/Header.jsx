import { useAuth } from '../context/AuthContext.jsx';
import { useState, useEffect, useRef } from 'react';
import { getMyNotifications } from '../services/notification.service.js';
import { useNavigate } from 'react-router-dom';
import NotificationPopover from './NotificationPopover.jsx';

export default function Header({ onMenuToggle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0);
  const [popOpen, setPopOpen] = useState(false);
  const btnRef = useRef();

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
    <header className="w-full bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* mobile menu button */}
        <button onClick={onMenuToggle} className="md:hidden px-3 py-2 text-sm font-semibold tracking-wide hover:bg-slate-50 transition-colors">
          MENÚ
        </button>

        <div className="hidden md:block">
          <div className="text-lg font-bold text-law-primary tracking-wide">Intranet Facultad de Derecho</div>
          <div className="text-xs text-slate-600 mt-0.5">Sistema de Gestión Académica</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button ref={btnRef} onClick={() => setPopOpen(v => !v)} aria-haspopup="dialog" aria-expanded={popOpen} className="text-sm font-semibold tracking-wide px-3 py-2 hover:bg-slate-50 transition-colors relative">
            Notificaciones
            {unread > 0 && <span className="ml-2 bg-law-accent text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">{unread}</span>}
          </button>

          {popOpen && (
            <div className="absolute right-0 mt-2 z-50">
              <NotificationPopover onClose={() => setPopOpen(false)} />
            </div>
          )}
        </div>

        <div className="text-sm">
          <div className="font-semibold text-slate-800">{user?.email ? user.email.split('@')[0] : 'Usuario'}</div>
          <div className="text-xs text-slate-600">{user?.role || ''}</div>
        </div>
      </div>
    </header>
  );
}
