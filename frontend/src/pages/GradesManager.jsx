import { useEffect, useState } from 'react';
import { getAllGrades, updateGrade } from '../services/grades.service.js';
import { useAuth } from '../context/AuthContext.jsx';
export default function GradesManager() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = String(user?.role || '').toLowerCase();
    if (!user || (!role.includes('prof') && !role.includes('admin'))) return;
    fetchAll();
  }, [user]);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllGrades();
      const payload = res?.data ?? res;
      const all = Array.isArray(payload) ? payload : (payload?.data ?? []);
      setGrades(all);
      // build unique students list
      const map = new Map();
      all.forEach(g => {
        const id = g.studentId ?? g.student_id ?? g.student?.id ?? (g.studentEmail ? g.studentEmail : null);
        const email = g.studentEmail ?? g.student?.email ?? null;
        const name = g.studentName ?? g.student?.name ?? email ?? `#${id}`;
        if (!id) return;
        if (!map.has(id)) map.set(id, { id, email, name });
      });
      setStudents(Array.from(map.values()));
    } catch (e) {
      setError(e.message || 'Error al obtener notas');
    } finally {
      setLoading(false);
    }
  }

  function filtered() {
    if (!q) return grades;
    const term = q.toLowerCase();
    return grades.filter(g => String(g.studentId).includes(term) || (g.evaluation || '').toLowerCase().includes(term) || (g.observation || '').toLowerCase().includes(term));
  }

  function gradesForStudent(studentId) {
    return grades.filter(g => String(g.studentId) === String(studentId) || String(g.student_id) === String(studentId) || (g.student && String(g.student.id) === String(studentId)));
  }

  async function saveAllForStudent(studentId) {
    const list = gradesForStudent(studentId);
    const toSave = list.filter(g => editable[g.id]);
    if (toSave.length === 0) return alert('No hay cambios para guardar.');
    try {
      setLoading(true);
      for (const g of toSave) {
        const row = editable[g.id] ?? {};
        const changes = {};
        if (row.score !== undefined) changes.score = Number(row.score);
        if (row.observation !== undefined) changes.observation = row.observation;
        if (g.source) changes.source = g.source;
        await updateGrade(g.id, changes);
      }
      await fetchAll();
      alert('Cambios guardados.');
      window.dispatchEvent(new CustomEvent('notifications:updated'));
    } catch (err) {
      console.error('Error guardando:', err);
      alert(err?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  async function saveRow(g, idx) {
    try {
      setSavingId(g.id);
      const row = editable[g.id] ?? {};
      const changes = {};
      if (row.score !== undefined) changes.score = Number(row.score);
      if (row.observation !== undefined) changes.observation = row.observation;
      // if source exists on the item, forward it so backend knows which table to update
      if (g.source) changes.source = g.source;

      await updateGrade(g.id, changes);
      await fetchAll();
      window.dispatchEvent(new CustomEvent('notifications:updated'));
    } catch (err) {
      console.error('Error guardando nota:', err);
      alert(err?.message || 'Error al guardar');
    } finally {
      setSavingId(null);
    }
  }

  const role = String(user?.role || '').toLowerCase();
  if (!user) return <div className="p-6">Necesitas iniciar sesión.</div>;
  if (!role.includes('prof') && !role.includes('admin')) return <div className="p-6">Acceso denegado.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white card-elevated p-6 rounded-2xl">
        <div className="flex items-start gap-6">
          <div className="w-1/3">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Estudiantes</h2>
              <button onClick={fetchAll} className="px-2 py-1 text-sm bg-law-primary text-white rounded">Refrescar</button>
            </div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar estudiante" className="px-3 py-2 border rounded w-full mb-3" />
            <div className="overflow-auto max-h-[60vh]">
              <ul className="divide-y">
                {students.filter(s => !q || (s.name || '').toLowerCase().includes(q.toLowerCase()) || (s.email||'').toLowerCase().includes(q.toLowerCase())).map(s => (
                  <li key={s.id} className={`p-3 cursor-pointer ${String(selectedStudent) === String(s.id) ? 'bg-slate-100' : 'hover:bg-slate-50'}`} onClick={() => setSelectedStudent(s.id)}>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-slate-500">{s.email}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Notas del estudiante {selectedStudent ?? ''}</h1>
              <div className="flex items-center gap-2">
                <button disabled={!selectedStudent} onClick={() => saveAllForStudent(selectedStudent)} className="px-3 py-2 bg-green-600 text-white rounded">Guardar todo</button>
              </div>
            </div>

            {loading && <div>Cargando notas...</div>}
            {error && <div className="text-red-600">{error}</div>}

            <div className="overflow-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">ID</th>
                    <th className="p-2">Evaluación</th>
                    <th className="p-2">Tipo</th>
                    <th className="p-2">Puntaje</th>
                    <th className="p-2">Observación</th>
                    <th className="p-2">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesForStudent(selectedStudent).map((g, idx) => (
                    <tr key={g.id} className="border-b hover:bg-gray-50">
                      <td className="p-2">{g.id}</td>
                      <td className="p-2">{g.evaluation}</td>
                      <td className="p-2">{g.type}</td>
                      <td className="p-2">
                        <input type="number" step="0.1" defaultValue={g.score ?? ''} className="w-24 px-2 py-1 border rounded" onChange={e => setEditable(prev => ({ ...prev, [g.id]: { ...(prev[g.id]||{}), score: e.target.value } }))} />
                      </td>
                      <td className="p-2">
                        <input type="text" defaultValue={g.observation ?? ''} className="w-full px-2 py-1 border rounded" onChange={e => setEditable(prev => ({ ...prev, [g.id]: { ...(prev[g.id]||{}), observation: e.target.value } }))} />
                      </td>
                      <td className="p-2">
                        <button disabled={savingId === g.id} onClick={() => saveRow(g, idx)} className="px-3 py-1 bg-green-600 text-white rounded">{savingId === g.id ? 'Guardando...' : 'Guardar'}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
