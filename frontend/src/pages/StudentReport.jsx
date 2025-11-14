import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInformeEstudiante, descargarInformeEstudiantePdf } from '../services/report.service.js';
import { updateGrade } from '../services/grades.service.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentReport() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editableNotas, setEditableNotas] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchReport();
  }, [id]);

  async function fetchReport() {
    setLoading(true);
    setError(null);
    try {
      const res = await getInformeEstudiante(id);
      const payload = res?.data ?? res;
      if (payload?.data) setReport(payload.data);
      else setReport(payload);
    } catch (e) {
      setError(e.message || 'Error al obtener informe');
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    try {
      const resp = await descargarInformeEstudiantePdf(id);
      if (!resp || resp.status >= 400) throw new Error('Error al descargar PDF');
      const contentType = resp.headers['content-type'] || '';
      if (!contentType.includes('application/pdf')) throw new Error('Respuesta no es PDF');
      const blob = resp.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `informe_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert(e.message || 'Error al descargar PDF');
    }
  }

  if (!user) return <div className="p-6">Necesitas iniciar sesión.</div>;
  if (user.role !== 'profesor' && user.role !== 'admin') return <div className="p-6">Acceso denegado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white card-elevated p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Informe del estudiante {id}</h1>
          <div className="flex items-center gap-2">
            <button onClick={() => {
              const next = !editMode;
              setEditMode(next);
              if (next && report?.notas) {
                // create editable copy
                setEditableNotas(report.notas.map(n => ({ ...n })));
              }
            }} className="px-3 py-2 bg-yellow-500 text-white rounded">{editMode ? 'Salir edición' : 'Editar notas'}</button>
            <button onClick={downloadPdf} className="px-4 py-2 bg-law-primary text-white rounded">Descargar PDF</button>
          </div>
        </div>

        {loading && <div className="mt-4">Cargando...</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}

        {report && (
          <div className="mt-4">
            <h3 className="font-semibold">Promedio general: {report.promedioGeneral ?? 'N/A'}</h3>
            <div className="mt-4">
              <h4 className="font-semibold">Notas</h4>
              <ul className="mt-2 list-inside">
                {Array.isArray(report.notas) && report.notas.map((n, idx) => (
                  <li key={n.id ?? idx} className="mb-2 border-b pb-2">
                    {!editMode && (
                      <>
                        <div>{n.evaluation} — {n.type} — <strong>{n.score}</strong></div>
                        {n.observation && <div className="text-sm text-slate-600">Observación: {n.observation}</div>}
                      </>
                    )}
                    {editMode && (
                      <div className="flex flex-col md:flex-row md:items-center md:gap-3">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{n.evaluation} — {n.type}</div>
                          <div className="mt-1 flex items-center gap-2">
                            <label className="text-xs">Puntaje:</label>
                            <input type="number" step="0.1" value={editableNotas[idx]?.score ?? ''} className="w-24 px-2 py-1 border rounded" onChange={(e) => {
                              const v = e.target.value;
                              setEditableNotas(prev => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], score: v };
                                return copy;
                              });
                            }} />
                            <label className="text-xs">Observación:</label>
                            <input type="text" value={editableNotas[idx]?.observation ?? ''} className="px-2 py-1 border rounded" onChange={(e) => {
                              const v = e.target.value;
                              setEditableNotas(prev => {
                                const copy = [...prev];
                                copy[idx] = { ...copy[idx], observation: v };
                                return copy;
                              });
                            }} />
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0">
                          <button disabled={savingId === n.id} onClick={async () => {
                            try {
                              setSavingId(n.id);
                              const edited = editableNotas[idx];
                              const changes = {};
                              if (edited.score !== undefined) changes.score = Number(edited.score);
                              if (edited.observation !== undefined) changes.observation = edited.observation;
                              const res = await updateGrade(n.id, changes);
                              if (res?.message && !res.data) {
                                console.error('Error actualizando nota:', res);
                                alert(res.message || 'Error actualizando');
                              } else {
                                await fetchReport();
                                window.dispatchEvent(new CustomEvent('notifications:updated'));
                              }
                            } catch (err) {
                              console.error('Error guardando nota:', err);
                              // err may be a structured server object or an Error
                              const serverMsg = err?.message || (err?.error || null);
                              const details = err?.errorDetails ? `\nDetalles: ${err.errorDetails}` : '';
                              alert((serverMsg || 'Error al guardar') + details);
                            } finally {
                              setSavingId(null);
                            }
                          }} className="px-3 py-1 bg-green-600 text-white rounded">{savingId === n.id ? 'Guardando...' : 'Guardar'}</button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
