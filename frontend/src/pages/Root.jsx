import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx'; 
import Sidebar from '../components/Sidebar.jsx';
import { useState, useEffect } from 'react';

function AppLayout() {
  const { user } = useAuth();
  const [open, setOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    function onResize() {
      const desk = window.innerWidth >= 768;
      setIsDesktop(desk);
      if (!desk) setOpen(false);
    }
    function onSidebarChange(e) {
      if (e && e.detail && typeof e.detail.abierto === 'boolean') setOpen(!!e.detail.abierto);
    }
    window.addEventListener('resize', onResize);
    window.addEventListener('sidebar:change', onSidebarChange);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('sidebar:change', onSidebarChange);
    };
  }, []);

  const mainStyle = {
    flex: 1,
    padding: 20,
    transition: 'margin-left 260ms ease-in-out',
    marginLeft: user && open && isDesktop ? 260 : 0
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}

      {/* interfaz movil*/}
      {user && !isDesktop && open && (
        <div onClick={() => window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: false } }))} style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 900 }} />
      )}

      {/* botón flotante para abrir el menú cuando está cerrado */}
      {user && !open && (
        <button onClick={() => window.dispatchEvent(new CustomEvent('sidebar:change', { detail: { abierto: true } }))} aria-label="Abrir menú" style={{ position: 'fixed', left: 12, top: 12, zIndex: 1100, background: '#0f172a', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8 }}>
          ☰
        </button>
      )}

      <main style={mainStyle} className="page-bg">
        <Outlet />
      </main>
    </div>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
