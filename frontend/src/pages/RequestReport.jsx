import { useState } from 'react';
import { solicitarMiInforme, descargarMiInformePdf } from '../services/report.service.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequestReport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleRequest() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await solicitarMiInforme();
      setResult(res);
    } catch (e) {
      setError({ message: 'Error al solicitar informe' });
    } finally {
      setLoading(false);
    }
  }

  async function downloadPdf() {
    try {
      // Use axios-based service so request goes to configured API base URL (and not Vite)
      const resp = await descargarMiInformePdf();
      // axios returns a response; status and headers accessible
      if (!resp || resp.status >= 400) {
        throw new Error(`Error del servidor: ${resp?.status || '??'}`);
      }
      const contentType = resp.headers['content-type'] || '';
      if (!contentType.includes('application/pdf')) {
        // server returned HTML/JSON instead of PDF
        // attempt to read text from blob
        try {
          const txt = await resp.data.text();
          throw new Error('Respuesta inesperada del servidor. No es un PDF. ' + txt.substring(0, 200));
        } catch (e2) {
          throw new Error('Respuesta inesperada del servidor. No es un PDF.');
        }
      }
      const blob = resp.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const disposition = resp.headers['content-disposition'] || '';
      const filenameMatch = disposition.match(/filename\*=UTF-8''(.+)|filename="?([^";]+)"?/i);
      let filename = `informe_${user?.email ? user.email.split('@')[0] : 'mi'}.pdf`;
      if (filenameMatch) {
        filename = decodeURIComponent(filenameMatch[1] || filenameMatch[2] || filename);
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setError({ message: e.message || 'Error al descargar PDF' });
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white card-elevated p-6 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Solicitar reporte académico</h1>
            <p className="text-slate-600 mt-1">Solicita tu informe académico. Puedes descargarlo en PDF cuando esté listo.</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <button onClick={handleRequest} disabled={loading} className="law-btn px-4 py-2">
            {loading ? 'Solicitando...' : 'Solicitar informe'}
          </button>

          <button onClick={downloadPdf} disabled={loading} className="law-btn-secondary px-4 py-2">
            Descargar PDF
          </button>
        </div>

        {user && <div className="mt-4 text-sm text-slate-600">Usuario: <strong>{user.email || user.id}</strong></div>}

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 text-red-700">{error.message}</div>
        )}

        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold">Respuesta</h3>
            <div className="mt-2 bg-slate-50 p-4 rounded-md whitespace-pre-wrap text-sm">{JSON.stringify(result, null, 2)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
