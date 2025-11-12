import { useEffect, useState } from 'react';
import { getProfile } from '../services/profile.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setLoading(true);
      const res = await getProfile();
      if (!mounted) return;
      if (res?.message && !res.data) {
        setProfile(null);
      } else {
        const perfil = res?.data ?? res;
        setProfile(perfil);
      }
      setLoading(false);
    }
    fetchProfile();
    return () => { mounted = false; };
  }, []);

  function cerrarSesion() {
    cookies.remove('jwt-auth', { path: '/' });
    sessionStorage.removeItem('usuario');
    setUser(null);
    navigate('/auth');
  }

  const initials = (profile?.email || 'U').split('@')[0].substring(0,2).toUpperCase();

  return (
    <div className="max-w-3xl mx-auto my-4 px-4">
      <h1 className="text-2xl font-bold mb-3">Mi perfil</h1>

      {loading && <p>Cargando perfil...</p>}

      {!loading && !profile && (
        <div className="bg-white p-4 rounded-lg">
          <p>No se pudo obtener el perfil.</p>
        </div>
      )}

      {!loading && profile && (
        <div className="bg-white p-6 rounded-xl shadow-md flex gap-5 items-center flex-wrap card-elevated animate-fade-up">
          <div className="w-24 h-24 rounded-lg bg-law-primary flex items-center justify-center text-white font-extrabold text-2xl">{initials}</div>

          <div className="flex-1 min-w-[220px]">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-extrabold">{profile?.name || profile?.fullName || profile?.email}</div>
                <div className="text-sm text-slate-500 mt-1">{profile?.role || 'Usuario'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/profile/edit')} className="px-4 py-2 rounded-md border border-law-primary text-law-primary btn-smooth">Editar perfil</button>
                <button onClick={cerrarSesion} className="px-4 py-2 rounded-md bg-law-primary text-white font-bold btn-smooth">Cerrar sesión</button>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex gap-3 items-center mb-2"><div className="text-sm text-slate-500 min-w-[100px]">Correo</div><div className="font-semibold text-slate-900">{profile?.email}</div></div>
              {profile?.studentId && <div className="flex gap-3 items-center mb-2"><div className="text-sm text-slate-500 min-w-[100px]">Matrícula</div><div className="font-semibold text-slate-900">{profile.studentId}</div></div>}
              {profile?.faculty && <div className="flex gap-3 items-center mb-2"><div className="text-sm text-slate-500 min-w-[100px]">Facultad</div><div className="font-semibold text-slate-900">{profile.faculty}</div></div>}
              {profile?.created_at && <div className="flex gap-3 items-center mb-2"><div className="text-sm text-slate-500 min-w-[100px]">Miembro desde</div><div className="font-semibold text-slate-900">{new Date(profile.created_at).toLocaleDateString()}</div></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
