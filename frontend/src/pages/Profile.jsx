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
    async function fetchCourses() {
      try {
        const r = await getMyCourses();
        const list = r?.data ?? r;
        if (!mounted) return;
        if (Array.isArray(list)) {
          const filtered = list.filter((c) => {
            if (!c) return false;
            if (typeof c === 'string') {
              // filter out strings that look like emails
              return !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c);
            }
            if (typeof c === 'object') {
              return Boolean(c.name || c.title || c.subject || c.code);
            }
            return false;
          });
          setCourses(filtered);
        }
      } catch (e) {
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
  const displayName = profile?.name || profile?.fullName || (profile?.email ? profile.email.split('@')[0] : 'Usuario');
  const [courses, setCourses] = useState([]);

  return (
    <div className="max-w-5xl mx-auto my-6 px-4">
      <h1 className="text-3xl font-bold mb-4">Mi perfil</h1>

      {loading && <p className="text-slate-600">Cargando perfil...</p>}

      {!loading && !profile && (
        <div className="card p-4 rounded-lg">
          <p className="text-slate-700">No se pudo obtener el perfil.</p>
        </div>
      )}

      {!loading && profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up">
          <div className="md:col-span-2">
            <div className="card-elevated p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-extrabold text-slate-900">{displayName}</div>
                    <span className="px-2 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">{profile?.role || 'Usuario'}</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-2 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0z"/></svg>
                    <span>{profile?.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="mb-3 text-sm text-slate-600">Detalles de contacto</div>
                  <div className="flex flex-col gap-3 text-slate-700">
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="w-5 h-5 text-law-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12v1a4 4 0 01-4 4H8l-4 2V7a4 4 0 014-4h6a4 4 0 014 4v5z"/></svg>
                      <div>
                        <div className="text-sm text-slate-500">Correo</div>
                        <div className="font-semibold">{profile?.email}</div>
                      </div>
                    </div>

                    {profile?.studentId && (
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"/></svg>
                        <div>
                          <div className="text-sm text-slate-500">Matrícula</div>
                          <div className="font-semibold">{profile.studentId}</div>
                        </div>
                      </div>
                    )}

                    {profile?.faculty && (
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"/></svg>
                        <div>
                          <div className="text-sm text-slate-500">Facultad</div>
                          <div className="font-semibold">{profile.faculty}</div>
                        </div>
                      </div>
                    )}

                    {profile?.created_at && (
                      <div className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"/></svg>
                        <div>
                          <div className="text-sm text-slate-500">Miembro desde</div>
                          <div className="font-semibold">{new Date(profile.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 'Participa este periodo en' section removed per request */}
            </div>
          </div>

          {/* aside (avatar + actions) removed per request */}
        </div>
      )}
    </div>
  );
}
