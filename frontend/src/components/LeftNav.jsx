import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import cookies from 'js-cookie';
import logo from '../assets/logo-facultad.svg';

export default function LeftNav({ mobileOpen, onClose }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  function logout() {
    try {
      cookies.remove('jwt-auth', { path: '/' });
    } catch (e) {
      
    }
    try { sessionStorage.removeItem('usuario'); } catch (e) {}
    try { setUser(null); } catch (e) {}
    navigate('/auth');
  }

  if (!user) return null;
  const role = String(user.role || '').toLowerCase();
  const isProfOrAdmin = role.includes('prof') || role.includes('admin');

  return (
    <>
      {/* Desktop static nav */}
      <aside className="left-nav-rail hidden md:block fixed left-0 top-0 bottom-0 z-40">
        <div className="h-full flex flex-col py-4 px-3">
          <div className="mb-8 px-3">
            <div className="flex flex-col items-center">
              <img src={logo} alt="Logo Facultad de Derecho" className="w-16 h-16 mb-3 rounded-lg shadow-lg" />
              <div className="text-center">
                <div className="text-lg font-bold tracking-wide">Facultad de Derecho</div>
                <div className="text-xs mt-1 opacity-90">Intranet Académica</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-1">
            <ul className="space-y-1">
              <li>
                <NavLink to="/home" end className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                  Inicio
                </NavLink>
              </li>

              {isProfOrAdmin && (
                <li>
                  <NavLink to="/students" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                    Buscar informe
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="/request-report" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                  Solicitar reporte
                </NavLink>
              </li>

              {isProfOrAdmin && (
                <li>
                  <NavLink to="/reports/me/history" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                    Historial
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink to="/notifications/me" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                  Notificaciones
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                  Perfil
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile/edit" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                  Editar perfil
                </NavLink>
              </li>
              {isProfOrAdmin && (
                <li>
                  <NavLink to="/grades/manage" className={({isActive}) => `block w-full px-4 py-3 mx-2 my-1 text-sm font-semibold tracking-wide transition-all duration-200 rounded-lg border ${isActive ? 'bg-white bg-opacity-25 border-white border-opacity-40 shadow-lg transform scale-105' : 'border-transparent hover:bg-white hover:bg-opacity-15 hover:border-white hover:border-opacity-20 hover:shadow-md'}`}>
                    Gestionar notas
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-auto px-3 w-full">
            <div className="text-xs opacity-75 mb-2">Usuario</div>
            <div className="text-sm font-semibold mb-4">{user.email || `Usuario ${user.id || ''}`}</div>
            <button onClick={logout} className="w-full py-3 bg-white bg-opacity-20 hover:bg-opacity-30 hover:shadow-lg text-white font-semibold tracking-wide transition-all duration-200 border border-white border-opacity-30 rounded-lg hover:scale-105">Cerrar sesión</button>
          </div>
        </div>
      </aside>

      {/* Mobile slide-over nav */}
      <div className={`left-nav-mobile ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 bottom-0 w-[260px] bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out md:hidden will-change-transform`}> 
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Logo Facultad de Derecho" className="w-10 h-10 rounded-md shadow-md" />
              <div className="text-base font-bold tracking-wide">Facultad de Derecho</div>
            </div>
            <button onClick={onClose} className="text-2xl leading-none px-2 py-1 rounded hover:bg-slate-100">
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
              {isProfOrAdmin && (
                <NavLink onClick={onClose} to="/grades/manage" className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
                  Gestionar notas
                </NavLink>
              )}
            <NavLink onClick={onClose} to="/notifications/me" className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
              Notificaciones
            </NavLink>
            <NavLink onClick={onClose} to="/profile" className={({isActive}) => `px-3 py-2 rounded-md hover:bg-slate-50 ${isActive ? 'bg-slate-100 font-semibold' : ''}`}>
              Perfil
            </NavLink>
            <div className="px-3 py-2">
              <button onClick={() => { onClose && onClose(); logout(); }} className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold tracking-wide transition-colors">Cerrar sesión</button>
            </div>
          </nav>
        </div>
      </div>

      {/* overlay when mobile nav open */}
      {/* overlay removed to avoid covering main content; mobile close button is present inside the slide-over */}
      {/* Fixed fallback logout button (inline styles) to ensure visibility even if CSS/utilities fail */}
      {/* fixed fallback removed; logout is inside the sidebar */}
    </>
  );
}
