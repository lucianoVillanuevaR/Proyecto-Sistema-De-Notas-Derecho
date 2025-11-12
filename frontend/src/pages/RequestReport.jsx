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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Solicitar reporte académico</h1>
      <p className="text-slate-600 mt-2">Esta página te permite solicitar tu informe académico. Pulsa el botón para obtenerlo.</p>

      <div className="mt-4">
        <button onClick={manejarSolicitud} disabled={cargando} className="px-4 py-2 rounded-md bg-law-primary text-white font-semibold btn-smooth">
          {cargando ? 'Solicitando...' : 'Solicitar informe'}
        </button>
      </div>

      {user && (
        <p className="mt-3 text-slate-600">Usuario: {user.email || user.id}</p>
      )}

      {resultado && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Resultado</h3>
          <pre className="whitespace-pre-wrap bg-slate-50 p-4 rounded-md">{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
