import { useState } from 'react';
import { solicitarMiInforme } from '../services/report.service.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RequestReport() {
  const { user } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);

  async function manejarSolicitud() {
    setCargando(true);
    setResultado(null);
    const res = await solicitarMiInforme();
    setResultado(res);
    setCargando(false);
  }

  return (
    <div className="container" style={{ padding: 20 }}>
      <h1>Solicitar reporte académico</h1>
      <p>Esta página te permite solicitar tu informe académico. Pulsa el botón para obtenerlo.</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={manejarSolicitud} disabled={cargando} className="btn">
          {cargando ? 'Solicitando...' : 'Solicitar informe'}
        </button>
      </div>

      {user && (
        <p style={{ marginTop: 12, color: '#555' }}>Usuario: {user.email || user.id}</p>
      )}

      {resultado && (
        <div style={{ marginTop: 16 }}>
          <h3>Resultado</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f7f7', padding: 12 }}>{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
