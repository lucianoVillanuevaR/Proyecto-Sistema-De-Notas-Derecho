import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { useEffect, useState } from 'react';

function AppLayout() {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 768 : true));

  useEffect(() => {
    function onChange(e) {
      const v = e?.detail?.abierto;
      if (typeof v === 'boolean') setSidebarOpen(v);
    }
    function onResize() {
      const desk = window.innerWidth >= 768;
      setIsDesktop(desk);
      if (!desk) setSidebarOpen(false);
      else if (user) setSidebarOpen(true);
    }
    window.addEventListener('sidebar:change', onChange);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('sidebar:change', onChange); window.removeEventListener('resize', onResize); };
  }, []);

  const mainStyle = {
    flex: 1,
    padding: 20,
    transition: 'margin-left 0.2s ease',
    marginLeft: user && isDesktop && sidebarOpen ? 260 : 0
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {user && <Sidebar />}
      <main style={mainStyle} className="page-bg">
        {user && <Header />}
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
