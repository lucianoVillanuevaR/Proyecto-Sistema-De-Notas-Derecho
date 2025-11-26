import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LeftNav({ mobileOpen, onClose }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      {/* Desktop static nav */}
      <aside className="left-nav hidden md:block fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-slate-200 z-40">
        <div className="h-full flex flex-col p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <img src="/src/assets/logo.svg" alt="logo" className="w-10 h-10" />
              <div>
                <div className="text-lg font-semibold text-slate-800">Facultad de Derecho</div>
                <div className="text-xs text-slate-500">Sistema de Gestión Académica</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 flex flex-col gap-2 text-slate-700">
            <NavLink to="/home" end className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
              <span className="text-sm">Inicio</span>
            </NavLink>

            {(user.role === 'profesor' || user.role === 'admin') && (
              <NavLink to="/students" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
                <span className="text-sm">Buscar informe</span>
              </NavLink>
            )}

            <NavLink to="/request-report" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
              <span className="text-sm">Solicitar reporte</span>
            </NavLink>

            {(user.role === 'profesor' || user.role === 'admin') && (
              <NavLink to="/reports/me/history" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
                <span className="text-sm">Historial</span>
              </NavLink>
            )}

            <NavLink to="/notifications/me" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
              <span className="text-sm">Notificaciones</span>
            </NavLink>

            <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
              <span className="text-sm">Perfil</span>
            </NavLink>

            <NavLink to="/profile/edit" className={({isActive}) => `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold text-slate-900' : ''}`}>
              <span className="text-sm">Editar perfil</span>
            </NavLink>
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
