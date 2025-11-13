import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import cookies from 'js-cookie';
import { useEffect, useState, useCallback } from 'react';
import { getMyNotifications } from '../services/notification.service.js';

export default function Sidebar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));
  const [unread, setUnread] = useState(0);

  const updateViewport = useCallback(() => {
    const desk = window.innerWidth >= 768;
    setIsDesktop(desk);
    setOpen(desk);
    window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: desk } }));
  }, []);

  useEffect(() => {
    const inicial = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
    setOpen(inicial);
    setIsDesktop(inicial);
    window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: inicial } }));
    function onResize() { updateViewport(); }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateViewport]);

  const fetchCount = useCallback(async () => {
    try {
      const res = await getMyNotifications();
      const list = res?.data ?? res;
      const u = Array.isArray(list) ? list.filter(n => !n.read).length : 0;
      setUnread(u);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    async function wrapper() {
      if (!mounted) return;
      await fetchCount();
    }
    wrapper();
    const t = setInterval(fetchCount, 30000);
    function onUpdated() { fetchCount(); }
    window.addEventListener('notifications:updated', onUpdated);
    return () => { mounted = false; clearInterval(t); window.removeEventListener('notifications:updated', onUpdated); };
  }, [fetchCount]);

  function toggle() {
    const next = !open;
    setOpen(next);
    window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: next } }));
  }

  function logout() {
    cookies.remove('jwt-auth', { path: '/' });
    sessionStorage.removeItem('usuario');
    setUser(null);
    navigate('/auth');
  }

  const avatar = (user?.email || 'U').split('@')[0].substring(0,2).toUpperCase();

  return (
    <>
      <aside
        className={`sidebar fixed left-0 top-0 bottom-0 w-[260px] max-w-[92%] text-white p-5 z-50 flex flex-col box-border shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!open}
        role="navigation"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-md bg-law-primary flex items-center justify-center font-bold text-white">{avatar}</div>
          <div className="flex-1">
            <div className="text-lg font-bold">Sistema de Notas</div>
            <div className="text-sm text-slate-300 truncate max-w-[150px]">{user?.email || `Usuario ${user?.id || ''}`}</div>
          </div>
          <button onClick={toggle} aria-label={open ? 'Cerrar menú' : 'Abrir menú'} className="ml-2 p-1 rounded hover:bg-slate-800" title={open ? 'Cerrar menú' : 'Abrir menú'}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/home" end className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Inicio</NavLink>
          <NavLink to="/request-report" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Solicitar reporte académico</NavLink>
          <NavLink to="/reports/me/report" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Mi informe (JSON)</NavLink>
          <NavLink to="/reports/me/history" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Historial</NavLink>

          <div className="flex items-center gap-2">
            <NavLink to="/notifications/me" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>
              Notificaciones
            </NavLink>
            {unread > 0 && (
              <span className="nav-badge">{unread}</span>
            )}
          </div>

          <NavLink to="/profile" className={({isActive}) => `nav-btn ${isActive ? 'active' : ''}`}>Perfil</NavLink>
        </nav>

        <div className="mt-auto">
          <button onClick={logout} className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg font-semibold">Cerrar sesión</button>
        </div>
      </aside>

      {!open && (
        <button onClick={toggle} aria-label="Abrir menú" className="fixed left-3 top-3 z-50 bg-law-primary text-white px-3 py-2 rounded-lg shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {!isDesktop && open && (
        <div onClick={toggle} className="fixed left-0 top-0 right-0 bottom-0 bg-black/40 z-40" />
      )}
    </>
  );
}
