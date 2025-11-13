import { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/profile.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function ProfileEdit() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      const res = await getProfile();
      if (!mounted) return;
      const perfil = res?.data ?? res;
      setProfile({
        name: perfil?.name || perfil?.fullName || '',
        email: perfil?.email || '',
        faculty: perfil?.faculty || '',
        studentId: perfil?.studentId || perfil?.student_id || '',
        phone: perfil?.phone || perfil?.telefono || '',
        website: perfil?.website || perfil?.site || '',
        description: perfil?.description || perfil?.bio || ''
      });
      setLoading(false);
    }
    load();
    return () => { mounted = false; };
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: profile.name,
        faculty: profile.faculty,
        phone: profile.phone,
        website: profile.website,
        description: profile.description
      };
      const res = await updateProfile(payload);
      const result = res?.data ?? res;
      if (result?.error || result?.message && !result?.ok) {
        setError(result.error?.message || result.message || 'Error al guardar');
        setSaving(false);
        return;
      }
      // update auth context and sessionStorage if available
      const updated = result?.data ?? result;
      const current = JSON.parse(sessionStorage.getItem('usuario') || 'null');
      const merged = { ...(current || {}), ...(updated || {}) };
      sessionStorage.setItem('usuario', JSON.stringify(merged));
      setUser(merged);
      navigate('/profile');
    } catch (e) {
      setError(e.message || 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  }

  function onChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  if (loading) return <div className="p-6">Cargando editor de perfil...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar perfil</h1>
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl card-elevated">
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Nombre completo</span>
            <input name="name" value={profile.name} onChange={onChange} className="mt-1 p-2 border rounded-md" />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Correo (no editable)</span>
            <input name="email" value={profile.email} disabled className="mt-1 p-2 border rounded-md bg-slate-50" />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm text-slate-600">Facultad</span>
              <input name="faculty" value={profile.faculty} onChange={onChange} className="mt-1 p-2 border rounded-md" />
            </label>
            <label className="flex flex-col">
              <span className="text-sm text-slate-600">Teléfono</span>
              <input name="phone" value={profile.phone} onChange={onChange} className="mt-1 p-2 border rounded-md" />
            </label>
          </div>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Sitio web</span>
            <input name="website" value={profile.website} onChange={onChange} className="mt-1 p-2 border rounded-md" />
          </label>

          <label className="flex flex-col">
            <span className="text-sm text-slate-600">Descripción</span>
            <textarea name="description" value={profile.description} onChange={onChange} className="mt-1 p-2 border rounded-md" rows={4} />
          </label>

          {error && <div className="text-red-600">{error}</div>}

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => navigate('/profile')} className="px-4 py-2 border rounded-md">Cancelar</button>
            <button type="submit" disabled={saving} className="law-btn px-4 py-2">{saving ? 'Guardando...' : 'Guardar cambios'}</button>
          </div>
        </div>
      </form>
    </div>
  );
}
