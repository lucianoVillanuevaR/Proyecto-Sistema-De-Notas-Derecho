import { useEffect, useState } from 'react';
import { getProfile, getMyCourses } from '../services/profile.service.js';
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
    // fetch courses for this profile
    async function fetchCourses() {
      try {
        const r = await getMyCourses();
        const list = r?.data ?? r;
        if (!mounted) return;
        if (Array.isArray(list)) setCourses(list);
      } catch (e) {
        // ignore
      }
    }
    fetchCourses();
    return () => { mounted = false; };
  }, []);

  function cerrarSesion() {
    cookies.remove('jwt-auth', { path: '/' });
    sessionStorage.removeItem('usuario');
    setUser(null);
    navigate('/auth');
  }

  const initials = (profile?.email || 'U').split('@')[0].substring(0,2).toUpperCase();
  const [courses, setCourses] = useState([]);

  return (
    <div className="max-w-5xl mx-auto my-6 px-4">
      <h1 className="text-3xl font-bold mb-4">Mi perfil</h1>

      {loading && <p>Cargando perfil...</p>}

      {!loading && !profile && (
        <div className="bg-white p-4 rounded-lg">
          <p>No se pudo obtener el perfil.</p>
        </div>
      )}

      {!loading && profile && (
        <div className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 card-elevated animate-fade-up">
          <div className="md:col-span-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-2xl font-extrabold">{profile?.name || profile?.fullName || profile?.email}</div>
                <div className="text-sm text-slate-500 mt-1">{profile?.role || 'Usuario'}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate('/profile/edit')} className="px-4 py-2 rounded-md border border-law-primary text-law-primary btn-smooth">Editar perfil</button>
                <button onClick={cerrarSesion} className="px-4 py-2 rounded-md bg-law-primary text-white font-bold btn-smooth">Cerrar sesión</button>
              </div>
            </div>

            <div className="mt-6 bg-slate-50 p-4 rounded-lg">
              <div className="mb-3 text-sm text-slate-600">Correo</div>
              <div className="font-semibold">{profile?.email}</div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile?.studentId && <div><div className="text-sm text-slate-500">Matrícula</div><div className="font-semibold">{profile.studentId}</div></div>}
                {profile?.faculty && <div><div className="text-sm text-slate-500">Facultad</div><div className="font-semibold">{profile.faculty}</div></div>}
                {profile?.created_at && <div><div className="text-sm text-slate-500">Miembro desde</div><div className="font-semibold">{new Date(profile.created_at).toLocaleDateString()}</div></div>}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold">Participa este periodo en:</h3>
              <ul className="list-disc list-inside mt-3 text-slate-700">
                {courses.length === 0 && (
                  <li className="text-sm text-slate-500">No se han registrado cursos para este usuario.</li>
                )}
                {courses.map((c) => (
                  <li key={c.id || c.code} className="text-sm">
                    {c.code ? <strong className="mr-2">{c.code}</strong> : null}
                    {c.name || c.title || c.subject}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="flex flex-col items-center md:items-end md:justify-start">
            <div className="w-56 h-56 rounded-lg bg-law-primary flex items-center justify-center text-white font-extrabold text-4xl">{initials}</div>
          </aside>
        </div>
      )}
    </div>
  );
}
