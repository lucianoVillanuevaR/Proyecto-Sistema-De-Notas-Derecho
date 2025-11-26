import { useEffect, useRef, useState } from 'react';
import { getMyNotifications, markNotificationRead } from '../services/notification.service.js';
import { useNavigate } from 'react-router-dom';

export default function NotificationPopover({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchList() {
      setLoading(true);
      try {
        const res = await getMyNotifications();
        if (!mounted) return;
        const list = res.data ?? res;
        setItems(Array.isArray(list) ? list.slice(0,6) : []);
      } catch (e) {
        // ignore
      }
      setLoading(false);
    }
    fetchList();

    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose && onClose();
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => { mounted = false; document.removeEventListener('mousedown', onDoc); };
  }, []);

  async function handleMark(id) {
    const res = await markNotificationRead(id);
    if (res?.data) {
      setItems(prev => prev.map(it => it.id === id ? { ...it, read: true } : it));
      window.dispatchEvent(new CustomEvent('notifications:updated'));
    }
  }

  return (
    <div ref={ref} className="w-80 bg-white rounded-lg shadow-lg border border-slate-100 overflow-hidden">
      <div className="p-3 border-b border-slate-100 flex items-center justify-between">
        <div className="font-semibold">Notificaciones</div>
        <button onClick={() => navigate('/notifications/me')} className="text-sm text-slate-500 hover:underline">Ver todas</button>
      </div>

      <div className="max-h-64 overflow-auto">
        {loading && <div className="p-4 text-sm text-slate-500">Cargando...</div>}
        {!loading && items.length === 0 && <div className="p-4 text-sm text-slate-500">No hay notificaciones.</div>}
        {!loading && items.map(n => (
          <div key={n.id} className={`p-3 flex items-start gap-3 border-b border-slate-100 ${n.read ? 'bg-slate-50' : 'bg-white'}`}>
            <div className="w-3 h-3 rounded-full mt-1" style={{background: n.read ? '#d1d5db' : 'var(--law-accent)'}} />
            <div className="flex-1">
              <div className="text-sm font-semibold">{n.title}</div>
              <div className="text-xs text-slate-500">{n.message}</div>
              <div className="text-2xs text-slate-400 mt-2 text-[11px]">{new Date(n.created_at).toLocaleString()}</div>
            </div>
            <div className="ml-2">
              {!n.read ? (
                <button onClick={() => handleMark(n.id)} className="px-2 py-1 rounded text-sm bg-law-primary text-white">OK</button>
              ) : (
                <div className="text-xs text-slate-400">Leída</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
