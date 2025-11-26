import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LeftNav({ mobileOpen, onClose }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Desktop static nav */}
      <aside className="left-nav hidden md:block fixed left-0 top-0 bottom-0 bg-white z-40">
        <div className="h-full flex flex-col py-4 px-2">
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3">
              <img src="/src/assets/logo.svg" alt="logo" className="w-10 h-10" />
              <div className="hidden lg:block">
                <div className="text-lg font-semibold text-slate-800">Facultad de Derecho</div>
                <div className="text-xs text-slate-500">Sistema de Gestión Académica</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-1">
            <ul className="space-y-1">
              <li>
                <NavLink to="/home" end className={({isActive}) => `flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                  <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5z" /></svg>
                  </span>
                  <span className="hidden lg:inline-block text-sm font-semibold">Inicio</span>
                </NavLink>
              </li>

              {(user.role === 'profesor' || user.role === 'admin') && (
                <li>
                  <NavLink to="/students" className={({isActive}) => `flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                    <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="6"></circle><path d="M21 21l-4.35-4.35" /></svg>
                    </span>
                    <span className="hidden lg:inline-block text-sm font-semibold">Buscar informe</span>
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="/request-report" className={({isActive}) => `flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                  <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 5 17 10" /><line x1="12" y1="5" x2="12" y2="19" /></svg>
                  </span>
                  <span className="hidden lg:inline-block text-sm font-semibold">Solicitar reporte</span>
                </NavLink>
              </li>

              {(user.role === 'profesor' || user.role === 'admin') && (
                <li>
                  <NavLink to="/reports/me/history" className={({isActive}) => `flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                    <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 10 6 7 10 11 14 6 21 13" /></svg>
                    </span>
                    <span className="hidden lg:inline-block text-sm font-semibold">Historial</span>
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="/notifications/me" className={({isActive}) => `relative flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                  <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                  </span>
                  <span className="hidden lg:inline-block text-sm font-semibold">Notificaciones</span>
                  <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-law-accent text-slate-900 text-xs font-bold flex items-center justify-center">{/*badge*/}</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile" className={({isActive}) => `flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                  <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-3-3.87" /><path d="M4 21v-2a4 4 0 0 1 3-3.87" /><circle cx="12" cy="7" r="4" /></svg>
                  </span>
                  <span className="hidden lg:inline-block text-sm font-semibold">Perfil</span>
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile/edit" className={({isActive}) => `flex items-center w-full gap-3 rounded-md px-3 py-2 hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-700'}`}>
                  <span className="w-10 h-10 flex items-center justify-center text-law-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4h9" /><path d="M21 4v6" /><path d="M10 20H5a2 2 0 0 1-2-2v-5" /><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  </span>
                  <span className="hidden lg:inline-block text-sm font-semibold">Editar perfil</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className="mt-6">
            <div className="text-xs text-slate-500">Usuario</div>
            <div className="text-sm font-medium text-slate-800">{user.email || `Usuario ${user.id || ''}`}</div>
          </div>
        </div>
      </aside>

      {/* Mobile slide-over nav */}
      <div className={`left-nav ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 md:hidden`}> 
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img src="/src/assets/logo.svg" alt="logo" className="w-9 h-9" />
              <div className="text-sm font-semibold">Facultad de Derecho</div>
            </div>
            <button onClick={onClose} className="p-2 rounded hover:bg-slate-100">
              ×
            </button>
          </div>
          <nav className="flex-1 flex flex-col gap-2">
            <NavLink onClick={onClose} to="/home" end className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
              Inicio
            </NavLink>
            <NavLink onClick={onClose} to="/request-report" className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
              Solicitar reporte
            </NavLink>
            <NavLink onClick={onClose} to="/notifications/me" className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
              Notificaciones
            </NavLink>
            <NavLink onClick={onClose} to="/profile" className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
              Perfil
            </NavLink>
          </nav>
        </div>
      </div>

      {/* overlay when mobile nav open */}
      {mobileOpen && <div onClick={onClose} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}
    </>
  );
}
