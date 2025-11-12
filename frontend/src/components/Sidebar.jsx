import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { getMyNotifications } from '../services/notification.service.js';
export default function Sidebar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const inicial = typeof window !== 'undefined' ? window.innerWidth >= 768 : true;
    setAbierto(inicial);
    setIsDesktop(inicial);
    window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: inicial } }));

    function onResize() {
      const desk = window.innerWidth >= 768;
      setIsDesktop(desk);
      if (!desk) {
        setAbierto(false);
        window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: false } }));
      }
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function cerrarSesion() {
    cookies.remove('jwt-auth', { path: '/' });
    sessionStorage.removeItem('usuario');
    setUser(null);
    navigate('/auth');
  }

  function alternar() {
    const nuevo = !abierto;
    setAbierto(nuevo);
    window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: nuevo } }));
  }

  const ancho = 280;

  const avatar = (user?.email || 'U').split('@')[0].substring(0,2).toUpperCase();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      const res = await getMyNotifications();
      if (!mounted) return;
      const list = res.data ?? res;
      const u = Array.isArray(list) ? list.filter(n => !n.read).length : 0;
      setUnread(u);
    }
    fetchCount();
    const t = setInterval(fetchCount, 30000);
    function onUpdated() { fetchCount(); }
    window.addEventListener('notifications:updated', onUpdated);
    return () => { mounted = false; clearInterval(t); window.removeEventListener('notifications:updated', onUpdated); };
  }, []);

  return (
    <>
      <aside
          className={`fixed left-0 top-0 bottom-0 w-[260px] max-w-[92%] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white p-5 z-50 flex flex-col box-border shadow-2xl transform transition-transform duration-300 ${abierto ? 'translate-x-0' : '-translate-x-full'}`}
        aria-hidden={!abierto}
        role="navigation"
      >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-md bg-law-primary flex items-center justify-center font-bold text-white">{avatar}</div>
          <div>
            <div className="text-lg font-bold">Sistema de Notas</div>
            <div className="text-sm text-slate-300">{user?.email || `Usuario ${user?.id || ''}`}</div>
          </div>
            <button onClick={alternar} aria-label="Cerrar menú" className="ml-auto p-1 rounded hover:bg-slate-800" title="Cerrar menú">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/home" end className={({isActive}) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-law-accent text-slate-900' : 'text-slate-100 hover:bg-slate-800 hover:text-white'}`}>Inicio</NavLink>
          <NavLink to="/request-report" className={({isActive}) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-law-accent text-slate-900' : 'text-slate-100 hover:bg-slate-800 hover:text-white'}`}>Solicitar reporte académico</NavLink>
          <NavLink to="/reports/me/report" className={({isActive}) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-law-accent text-slate-900' : 'text-slate-100 hover:bg-slate-800 hover:text-white'}`}>Mi informe (JSON)</NavLink>
          <NavLink to="/reports/me/history" className={({isActive}) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-law-accent text-slate-900' : 'text-slate-100 hover:bg-slate-800 hover:text-white'}`}>Historial</NavLink>
          <div className="flex items-center gap-2">
            <NavLink to="/notifications/me" className={({isActive}) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-teal-300 text-slate-900' : 'text-slate-100 hover:bg-slate-800 hover:text-white'}`}>Notificaciones</NavLink>
            {unread > 0 && (
              <span className="bg-law-accent text-slate-900 px-2 py-0.5 rounded-full text-xs font-bold badge-pulse">{unread}</span>
            )}
          </div>
          <NavLink to="/profile" className={({isActive}) => `block px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-teal-300 text-slate-900' : 'text-slate-100 hover:bg-slate-800 hover:text-white'}`}>Perfil</NavLink>
        </nav>

        <div className="mt-auto">
          <button onClick={cerrarSesion} className="mt-4 w-full py-2 bg-red-600 text-white rounded-lg font-semibold">Cerrar sesión</button>
        </div>
      </aside>

      {/* boton */}
      {!abierto && (
        <button
          onClick={alternar}
          aria-label="Abrir menú"
          className="fixed left-3 top-3 z-50 bg-law-primary text-white border-none px-3 py-2 rounded-lg shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
          </svg>
        </button>
      )}

      {/* esto es para el overlay */}
      {!isDesktop && abierto && (
        <div onClick={alternar} className="fixed left-0 top-0 right-0 bottom-0 bg-black/40 z-40" />
      )}
    </>
  );
}

const navLinkStyle = ({ isActive }) => ({
  display: 'block',
  padding: '10px 12px',
  color: isActive ? '#061826' : '#e6eef6',
  background: isActive ? '#a7f3d0' : 'transparent',
  textDecoration: 'none',
  borderRadius: 8,
  fontWeight: 600
});
