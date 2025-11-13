import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getInformeEstudiante, descargarInformeEstudiantePdf } from '../services/report.service.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function StudentReport() {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetchReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <button onClick={downloadPdf} className="px-4 py-2 bg-law-primary text-white rounded">Descargar PDF</button>
        </div>

        {loading && <div className="mt-4">Cargando...</div>}
        {error && <div className="mt-4 text-red-600">{error}</div>}

        {report && (
          <div className="mt-4">
            <h3 className="font-semibold">Promedio general: {report.promedioGeneral ?? 'N/A'}</h3>
            <div className="mt-4">
              <h4 className="font-semibold">Notas</h4>
              <ul className="mt-2 list-disc list-inside">
                {Array.isArray(report.notas) && report.notas.map((n, idx) => (
                  <li key={idx} className="mb-2">
                    <div>{n.evaluation} — {n.type} — <strong>{n.score}</strong></div>
                    {n.observation && <div className="text-sm text-slate-600">Observación: {n.observation}</div>}
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
