import { useEffect, useState } from 'react';
import { listStudents } from '../services/report.service.js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentsList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || (user.role !== 'profesor' && user.role !== 'admin')) return;
    fetchList('');
  }, [user]);

  async function fetchList(query) {
    setLoading(true);
    setError(null);
    try {
      const res = await listStudents(query);
      const payload = res?.data ?? res;
      if (Array.isArray(payload)) setStudents(payload);
      else if (payload?.data) setStudents(payload.data);
      else setStudents([]);
    } catch (e) {
      setError(e.message || 'Error al listar estudiantes');
    } finally {
      setLoading(false);
    }
  }

  function onSearch(e) {
    e.preventDefault();
    fetchList(q);
  }

  if (!user) return <div className="p-6">Necesitas iniciar sesión.</div>;
  if (user.role !== 'profesor' && user.role !== 'admin') return <div className="p-6">Acceso denegado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white card-elevated p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-3">Buscar estudiantes</h1>
        <form onSubmit={onSearch} className="flex gap-2 mb-4">
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por email o nombre" className="flex-1 p-2 border rounded" />
          <button className="px-4 py-2 law-btn" type="submit">Buscar</button>
        </form>

        {loading && <div>Cargando...</div>}
        {error && <div className="text-red-600">{error}</div>}

        <div className="mt-4">
          {students.length === 0 && !loading && <div className="text-sm text-slate-500">No hay estudiantes.</div>}
          <ul className="space-y-2">
            {students.map(s => (
              <li key={s.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <div className="font-semibold">{s.name || s.email}</div>
                  <div className="text-sm text-slate-500">{s.email}</div>
                </div>
                <div>
                  <button onClick={() => navigate(`/students/${s.id}/report`)} className="px-3 py-1 border rounded bg-law-primary text-white">Ver informe</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
