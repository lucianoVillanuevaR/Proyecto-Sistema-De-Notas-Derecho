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

  // Función para calcular el promedio de las notas (validando rango 1.0-7.0)
  function calcularPromedio(notas) {
    if (!notas || notas.length === 0) return '0.00';
    const notasValidas = notas.filter(nota => {
      const score = parseFloat(nota.score);
      return !isNaN(score) && score >= 1.0 && score <= 7.0;
    });
    if (notasValidas.length === 0) return '0.00';
    const sum = notasValidas.reduce((acc, nota) => acc + parseFloat(nota.score), 0);
    const promedio = sum / notasValidas.length;
    // Asegurar que el promedio también esté en el rango válido
    return Math.min(Math.max(promedio, 1.0), 7.0).toFixed(2);
  }

  // Función para obtener color según la nota
  function getScoreColor(score) {
    const nota = parseFloat(score);
    if (nota >= 6.0) return 'text-green-700 bg-green-50 border-green-200';
    if (nota >= 4.0) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-red-700 bg-red-50 border-red-200';
  }

  async function downloadPdf() {
    try {
      const resp = await descargarMiInformePdf();
      if (!resp || resp.status >= 400) {
        throw new Error(`Error del servidor: ${resp?.status || '??'}`);
      }
      const contentType = resp.headers['content-type'] || '';
      if (!contentType.includes('application/pdf')) {
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white card-elevated p-8 rounded-2xl animate-fade-up">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            Informe Académico
          </h1>
          <p className="text-slate-600">Solicita y visualiza tu informe académico completo.</p>
        </div>

        <div className="flex gap-4 flex-wrap mb-6">
          <button 
            onClick={handleRequest} 
            disabled={loading} 
            className="px-6 py-3 bg-law-primary text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Cargando...' : 'Consultar Notas'}
          </button>

          <button 
            onClick={downloadPdf} 
            disabled={loading} 
            className="px-6 py-3 border-2 border-law-primary text-law-primary font-semibold rounded-lg hover:bg-law-primary hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Descargar PDF
          </button>
        </div>

        {user && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Estudiante:</span> {user.email || user.name || user.id}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg mb-6 animate-fade-up">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-6 animate-fade-up">
            {/* Información del estudiante */}
            {result.data && (
              <div className="border-t border-slate-200 pt-6">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                  Registro Académico
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-sm text-blue-600 font-semibold mb-1">ID Estudiante</div>
                    <div className="text-2xl font-bold text-blue-900">#{result.data.studentId || 'N/A'}</div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="text-sm text-purple-600 font-semibold mb-1">Total de Evaluaciones</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {result.data.notas ? result.data.notas.length : 0}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-sm text-green-600 font-semibold mb-1">Promedio General</div>
                    <div className="text-2xl font-bold text-green-900">
                      {result.data.notas ? calcularPromedio(result.data.notas) : '0.00'}
                    </div>
                  </div>
                </div>

                {/* Tabla de notas */}
                {result.data.notas && result.data.notas.length > 0 ? (
                  <div className="overflow-hidden border border-slate-200 rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-50 border-b-2 border-slate-300">
                          <th className="text-left p-4 font-bold text-slate-900">Evaluación</th>
                          <th className="text-left p-4 font-bold text-slate-900">Tipo</th>
                          <th className="text-center p-4 font-bold text-slate-900">Calificación</th>
                          <th className="text-left p-4 font-bold text-slate-900">Observaciones</th>
                          <th className="text-left p-4 font-bold text-slate-900">Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.notas.map((nota, idx) => (
                          <tr 
                            key={nota.id || idx} 
                            className="border-b border-slate-200 hover:bg-slate-50 transition-colors duration-150"
                          >
                            <td className="p-4">
                              <div className="font-semibold text-slate-900">
                                {nota.evaluation || 'Sin nombre'}
                              </div>
                              <div className="text-xs text-slate-500">ID: {nota.id}</div>
                            </td>
                            <td className="p-4">
                              <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                                {nota.type || 'N/A'}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-4 py-2 rounded-lg font-bold text-lg border ${getScoreColor(nota.score)}`}>
                                {nota.score !== null && nota.score !== undefined ? nota.score : 'N/A'}
                              </span>
                            </td>
                            <td className="p-4 text-slate-600">
                              {nota.observation || 'Sin observaciones'}
                            </td>
                            <td className="p-4 text-slate-600 text-sm">
                              {nota.created_at ? new Date(nota.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-slate-600 text-lg">No hay calificaciones registradas.</p>
                  </div>
                )}
              </div>
            )}

            {/* Mensaje de éxito */}
            {result.message && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                <strong>✓</strong> {result.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
