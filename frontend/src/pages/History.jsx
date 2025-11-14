import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getHistorialEstudiante } from '../services/report.service.js';

export default function History() {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // if non-professor, do nothing; access is checked below
  }, []);

  if (!user) return <div className="p-6">Necesitas iniciar sesión.</div>;
  if (user.role !== 'profesor' && user.role !== 'admin') return <div className="p-6">Acceso denegado.</div>;

  async function buscar() {
    if (!studentId) {
      setError('Ingresa un ID de estudiante válido');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await getHistorialEstudiante(studentId);
      const payload = res?.data ?? res;
      if (payload?.data) setHistory(payload.data);
      else setHistory(payload ?? []);
    } catch (err) {
      setError(err.message || 'Error al obtener historial');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historial de acciones (profesor/admin)</h1>

      <div className="mb-4 flex items-center gap-2">
        <input value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="ID del estudiante" className="px-3 py-2 border rounded w-48" />
        <button onClick={buscar} className="px-3 py-2 bg-law-primary text-white rounded">Buscar historial</button>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && history && history.length === 0 && <p>No hay entradas de historial para ese estudiante.</p>}

      <div className="mt-3">
        {history.map(h => (
          <div key={h.id} className="border p-3 rounded mb-3 bg-white">
            <div className="text-sm text-slate-500">{new Date(h.created_at).toLocaleString()}</div>
            <div className="font-semibold">{h.action}</div>
            <div className="text-sm mt-1">{h.details ?? h.details_text ?? JSON.stringify(h.details)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
