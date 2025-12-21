import { useEffect, useState } from 'react';
import { getAllGrades, updateGrade } from '../services/grades.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import '@styles/gradesManager.css';

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
      // Construir lista única de estudiantes
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
    
    // Validar todas las notas antes de guardar
    for (const g of toSave) {
      const row = editable[g.id] ?? {};
      if (row.score !== undefined) {
        const score = Number(row.score);
        if (isNaN(score) || score < 1.0 || score > 7.0) {
          return alert(`Error: La nota debe estar entre 1.0 y 7.0. Nota inválida: ${row.score}`);
        }
      }
    }
    
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
      alert('Cambios guardados exitosamente.');
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
      
      // Validar la nota antes de guardar
      if (row.score !== undefined) {
        const score = Number(row.score);
        if (isNaN(score) || score < 1.0 || score > 7.0) {
          alert('Error: La nota debe estar entre 1.0 y 7.0');
          setSavingId(null);
          return;
        }
        changes.score = score;
      }
      
      if (row.observation !== undefined) changes.observation = row.observation;
      // Si existe source, enviarlo para que el backend sepa qué tabla actualizar
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
  if (!user) return <div className="needs-login">Necesitas iniciar sesión.</div>;
  if (!role.includes('prof') && !role.includes('admin')) return <div className="access-denied">Acceso denegado.</div>;

  return (
    <div className="grades-manager-container">
      <div className="grades-card">
        <div className="grades-layout">
          <div className="students-panel">
            <div className="panel-header">
              <h2 className="panel-title">Estudiantes</h2>
              <button onClick={fetchAll} className="btn-refresh">Refrescar</button>
            </div>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar estudiante" className="search-input" />
            <div className="students-list">
              <ul>
                {students.filter(s => !q || (s.name || '').toLowerCase().includes(q.toLowerCase()) || (s.email||'').toLowerCase().includes(q.toLowerCase())).map(s => (
                  <li key={s.id} className={`student-item ${String(selectedStudent) === String(s.id) ? 'selected' : ''}`} onClick={() => setSelectedStudent(s.id)}>
                    <div className="student-name">{s.name}</div>
                    <div className="student-email">{s.email}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grades-panel">
            <div className="grades-header">
              <h1 className="grades-title">Notas del estudiante {selectedStudent ? `#${selectedStudent}` : ''}</h1>
              <button disabled={!selectedStudent} onClick={() => saveAllForStudent(selectedStudent)} className="btn-save-all">Guardar todo</button>
            </div>

            {loading && <div className="loading-message">Cargando notas...</div>}
            {error && <div className="error-message">{error}</div>}

            <div className="grades-table-container">
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Evaluación</th>
                    <th>Tipo</th>
                    <th>Puntaje</th>
                    <th>Observación</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesForStudent(selectedStudent).map((g, idx) => (
                    <tr key={g.id}>
                      <td>{g.id}</td>
                      <td>{g.evaluation}</td>
                      <td>{g.type}</td>
                      <td>
                        <input 
                          type="number" 
                          step="0.1" 
                          min="1.0" 
                          max="7.0"
                          defaultValue={g.score ?? ''} 
                          className="input-score" 
                          placeholder="1.0 - 7.0"
                          onChange={e => setEditable(prev => ({ ...prev, [g.id]: { ...(prev[g.id]||{}), score: e.target.value } }))} 
                        />
                      </td>
                      <td>
                        <input type="text" defaultValue={g.observation ?? ''} className="input-observation" onChange={e => setEditable(prev => ({ ...prev, [g.id]: { ...(prev[g.id]||{}), observation: e.target.value } }))} />
                      </td>
                      <td>
                        <button disabled={savingId === g.id} onClick={() => saveRow(g, idx)} className="btn-save-row">{savingId === g.id ? 'Guardando...' : 'Guardar'}</button>
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
