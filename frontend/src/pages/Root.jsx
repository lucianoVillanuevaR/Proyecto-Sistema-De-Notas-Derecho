import { Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext.jsx';
import Header from '../components/Header.jsx';
import LeftNav from '../components/LeftNav.jsx';
import { useEffect, useState } from 'react';

function AppLayout() {
  const { user } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar width in px (kept in a variable so it's easy to change)
  const SIDEBAR_WIDTH = 260;

  // Track whether viewport is desktop (md breakpoint ~768px)
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia && window.matchMedia('(min-width: 768px)').matches);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(min-width: 768px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener ? mq.addEventListener('change', handler) : mq.addListener(handler);
    return () => mq.removeEventListener ? mq.removeEventListener('change', handler) : mq.removeListener(handler);
  }, []);

  // Inline style fallback margin-left so the main content is pushed even if Tailwind isn't applied.
  let marginLeft = 0;
  if (user) {
    if (isDesktop) marginLeft = SIDEBAR_WIDTH; // desktop: always push
    else if (mobileOpen) marginLeft = SIDEBAR_WIDTH; // mobile: push only when menu open
  }

  const mainClass = `page-bg flex-1 min-h-screen p-5 transition-all duration-200 ${user ? 'md:ml-[260px]' : ''}`;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <LeftNav mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className={mainClass}>
        {user && <Header onMenuToggle={() => setMobileOpen(v => !v)} />}
        {/* contentViewport occupies the visible width (viewport minus sidebar) and is shifted right by sidebar width when applicable */}
        <div style={{ marginLeft: marginLeft ? `${marginLeft}px` : undefined, width: marginLeft ? `calc(100% - ${marginLeft}px)` : '100%' }}>
          <div className="max-w-5xl mx-auto mt-6 px-2">
            <div className="bg-white shadow-sm rounded-lg p-6 main-card">
              <Outlet />
            </div>
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
