import { useEffect, useState } from 'react';
import { getMyNotifications, markNotificationRead } from '../services/notification.service.js';

export default function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      setLoading(true);
      const res = await getMyNotifications();
      if (!mounted) return;
      if (res?.message && !res.data) {
        setNotifications([]);
      } else {
        setNotifications(res.data ?? res);
      }
      setLoading(false);
    }
    fetch();
    // Refrescar cada 30 segundos
    const t = setInterval(fetch, 30000);
    return () => { mounted = false; clearInterval(t); };
  }, []);

  async function marcarLeida(id) {
    const res = await markNotificationRead(id);
    if (res?.data) {
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
      // Notificar al sidebar que se actualizó
      window.dispatchEvent(new CustomEvent('notifications:updated'));
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3">Notificaciones</h1>
      {loading && <p>Cargando notificaciones...</p>}
      {!loading && notifications.length === 0 && <p>No tienes notificaciones.</p>}

      <div className="flex flex-col gap-3 mt-3">
        {notifications.map(n => (
          <div key={n.id} className={`border p-4 rounded-lg flex justify-between items-center ${n.read ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200'} animate-fade-up`}>
            <div>
              <div className="font-semibold">{n.title}</div>
              <div className="text-sm text-slate-500">{n.message}</div>
              <div className="text-xs text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</div>
            </div>
            <div>
              {!n.read && (
                <button onClick={() => marcarLeida(n.id)} className="px-3 py-1 rounded-md bg-law-primary text-white font-semibold btn-smooth">Marcar leída</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
