import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import LeftNav from '../components/LeftNav.jsx';
import { useEffect, useState } from 'react';

function AppLayout() {
  const { user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Use Tailwind classes for responsive margin when sidebar is present.
  // On medium+ screens the sidebar is fixed at 260px, so apply left margin to main.
  const mainClass = `page-bg flex-1 min-h-screen p-5 transition-all duration-200 ${user ? 'md:ml-[260px]' : ''}`;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <LeftNav mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className={mainClass}>
        {user && <Header onMenuToggle={() => setMobileOpen(v => !v)} />}
        <div className="max-w-5xl mx-auto mt-6 px-2">
          <div className="bg-white shadow-sm rounded-lg p-6 main-card">
            <Outlet />
          </div>
        </div>
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
