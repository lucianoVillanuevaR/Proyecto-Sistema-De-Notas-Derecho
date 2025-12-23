import { useState } from 'react';
import { solicitarMiInforme, descargarMiInformePdf } from '../services/report.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import '@styles/requestReport.css';

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
  function getScoreClass(score) {
    const nota = parseFloat(score);
    if (nota >= 6.0) return 'excellent';
    if (nota >= 4.0) return 'good';
    return 'poor';
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
    <div className="request-report-container">
      <div className="report-card">
        <div className="report-header">
          <h1 className="report-title">Informe Académico</h1>
          <p className="report-subtitle">Solicita y visualiza tu informe académico completo.</p>
        </div>

        <div className="report-actions">
          <button 
            onClick={handleRequest} 
            disabled={loading} 
            className="btn-primary"
          >
            {loading ? 'Cargando...' : 'Consultar Notas'}
          </button>

          <button 
            onClick={downloadPdf} 
            disabled={loading} 
            className="btn-outline"
          >
            Descargar PDF
          </button>
        </div>

        {user && (
          <div className="user-info-box">
            <span className="user-info-label">Estudiante:</span>
            <span className="user-info-value">{user.email || user.name || user.id}</span>
          </div>
        )}

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error.message}
          </div>
        )}

        {result && (
          <div className="report-section">
            {result.data && (
              <>
                <h2 className="section-title">Registro Académico</h2>
                
                <div className="stats-grid">
                  <div className="stat-card blue">
                    <div className="stat-label">ID Estudiante</div>
                    <div className="stat-value">#{result.data.studentId || 'N/A'}</div>
                  </div>
                  
                  <div className="stat-card purple">
                    <div className="stat-label">Total de Evaluaciones</div>
                    <div className="stat-value">
                      {result.data.notas ? result.data.notas.length : 0}
                    </div>
                  </div>
                  
                  <div className="stat-card green">
                    <div className="stat-label">Promedio General</div>
                    <div className="stat-value">
                      {result.data.notas ? calcularPromedio(result.data.notas) : '0.00'}
                    </div>
                  </div>
                </div>

                {result.data.notas && result.data.notas.length > 0 ? (
                  <div className="grades-table-wrapper">
                    <table className="grades-table">
                      <thead>
                        <tr>
                          <th>Evaluación</th>
                          <th>Tipo</th>
                          <th className="center">Calificación</th>
                          <th>Observaciones</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.notas.map((nota, idx) => (
                          <tr key={nota.id || idx}>
                            <td>
                              <div className="evaluation-name">
                                {nota.evaluation || 'Sin nombre'}
                              </div>
                              <div className="evaluation-id">ID: {nota.id}</div>
                            </td>
                            <td>
                              <span className="type-badge">
                                {nota.type || 'N/A'}
                              </span>
                            </td>
                            <td className="center">
                              <span className={`score-badge ${getScoreClass(nota.score)}`}>
                                {nota.score !== null && nota.score !== undefined ? nota.score : 'N/A'}
                              </span>
                            </td>
                            <td className="observation-text">
                              {nota.observation || 'Sin observaciones'}
                            </td>
                            <td className="date-text">
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
                  <div className="empty-state">
                    <p className="empty-state-text">No hay calificaciones registradas.</p>
                  </div>
                )}
              </>
            )}

            {result.message && (
              <div className="success-box">
                <strong>✓</strong> {result.message}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
