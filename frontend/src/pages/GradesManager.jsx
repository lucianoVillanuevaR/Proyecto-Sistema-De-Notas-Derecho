import { useEffect, useState } from 'react';
import { getAllGrades, updateGrade } from '../services/grades.service.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaFilePdf } from 'react-icons/fa';
import ubbLogo from '@assets/Escudo_Universidad_del_Bío-Bío.png';
import '@styles/gradesManager.css';

export default function GradesManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const role = String(user?.role || user?.rol || '').toLowerCase();
    if (!user || (!role.includes('prof') && !role.includes('admin'))) {
      navigate('/home');
      return;
    }
    fetchAll();
  }, [user, navigate]);

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
    
    // Confirmación de seguridad
    const confirmMsg = `¿Guardar ${toSave.length} cambio(s) para el estudiante #${studentId}?\n\nEsta acción actualizará las calificaciones definitivamente.`;
    if (!confirm(confirmMsg)) return;
    
    // Validar todas las notas antes de guardar
    for (const g of toSave) {
      const row = editable[g.id] ?? {};
      if (row.score !== undefined) {
        const score = Number(row.score);
        if (isNaN(score) || score < 10 || score > 70) {
          return alert(`Error: La nota debe estar entre 10 y 70. Nota inválida: ${row.score}`);
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
      alert('✅ Cambios guardados exitosamente.');
      window.dispatchEvent(new CustomEvent('notifications:updated'));
    } catch (err) {
      console.error('Error guardando:', err);
      alert(err?.message || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  }

  async function saveRow(g, idx) {
    // Confirmación de seguridad
    if (!confirm(`¿Guardar cambios en la evaluación "${g.evaluation}"?`)) {
      return;
    }

    try {
      setSavingId(g.id);
      const row = editable[g.id] ?? {};
      const changes = {};
      
      // Validar la nota antes de guardar
      if (row.score !== undefined) {
        const score = Number(row.score);
        if (isNaN(score) || score < 10 || score > 70) {
          alert('❌ Error: La nota debe estar entre 10 y 70');
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
      alert('✅ Cambio guardado correctamente');
      window.dispatchEvent(new CustomEvent('notifications:updated'));
    } catch (err) {
      console.error('Error guardando nota:', err);
      alert('❌ ' + (err?.message || 'Error al guardar'));
    } finally {
      setSavingId(null);
    }
  }

  function exportToPDF() {
    if (!selectedStudent) {
      alert('Selecciona un estudiante primero');
      return;
    }

    const studentData = students.find(s => String(s.id) === String(selectedStudent));
    const studentGrades = gradesForStudent(selectedStudent);
    
    if (studentGrades.length === 0) {
      alert('No hay calificaciones para exportar');
      return;
    }

    // Convertir logo a base64 para incluir en el PDF
    const img = new Image();
    img.src = ubbLogo;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const logoBase64 = canvas.toDataURL('image/png');
      
      generatePDFWithLogo(studentData, studentGrades, logoBase64);
    };
  }

  function generatePDFWithLogo(studentData, studentGrades, logoBase64) {
    // Crear contenido HTML para el PDF
    const printWindow = window.open('', '', 'height=600,width=800');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Reporte de Calificaciones</title>
        <style>
          @page { margin: 2cm; }
          body { 
            font-family: Arial, sans-serif; 
            margin: 0;
            padding: 20px;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #3498db;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2c3e50;
            margin: 10px 0;
          }
          .logo {
            width: 100px;
            margin-bottom: 15px;
          }
          .student-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .student-info p {
            margin: 5px 0;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background-color: #f8f9fa;
          }
          .nota-aprobado {
            color: #27ae60;
            font-weight: bold;
          }
          .nota-reprobado {
            color: #e74c3c;
            font-weight: bold;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .promedio {
            background: #e8f4f8;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            text-align: center;
          }
          .promedio strong {
            font-size: 18px;
            color: #2980b9;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${logoBase64}" alt="Logo UBB" class="logo" />
          <h1>Universidad del Bío-Bío</h1>
          <h2>Reporte de Calificaciones</h2>
          <p>Facultad de Ciencias Jurídicas y Sociales</p>
        </div>

        <div class="student-info">
          <p><strong>Estudiante:</strong> ${studentData?.name || 'N/A'}</p>
          <p><strong>Email:</strong> ${studentData?.email || 'N/A'}</p>
          <p><strong>ID:</strong> ${selectedStudent}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Evaluación</th>
              <th>Tipo</th>
              <th>Nota</th>
              <th>Observación</th>
            </tr>
          </thead>
          <tbody>
            ${studentGrades.map(g => {
              const score = g.score ? Number(g.score) : null;
              const scoreClass = score !== null ? (score >= 40 ? 'nota-aprobado' : 'nota-reprobado') : '';
              return `
                <tr>
                  <td>${g.evaluation || 'Sin nombre'}</td>
                  <td>${g.type || 'N/A'}</td>
                  <td class="${scoreClass}">${score !== null ? score.toFixed(0) : 'Pendiente'}</td>
                  <td>${g.observation || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div class="promedio">
          <strong>Promedio General: ${(() => {
            console.log('Todas las notas:', studentGrades.map(g => ({eval: g.evaluation, score: g.score})));
            const validScores = studentGrades.filter(g => {
              const score = Number(g.score);
              const isValid = g.score !== null && g.score !== undefined && !isNaN(score) && score >= 10 && score <= 70;
              return isValid;
            }).map(g => Number(g.score));
            console.log('Notas válidas para promedio:', validScores);
            if (validScores.length === 0) return 'N/A';
            const sum = validScores.reduce((a, b) => a + b, 0);
            const avg = sum / validScores.length;
            console.log('Suma:', sum, 'Cantidad:', validScores.length, 'Promedio:', avg.toFixed(2));
            return Math.min(Math.max(avg, 10), 70).toFixed(2);
          })()}</strong>
        </div>

        <div class="footer">
          <p>Sistema de Gestión de Evaluaciones - Universidad del Bío-Bío</p>
          <p>Documento generado el ${new Date().toLocaleString('es-CL')}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
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
              <div className="grades-actions">
                <button disabled={!selectedStudent} onClick={exportToPDF} className="btn-export-pdf">
                  <FaFilePdf /> Exportar PDF
                </button>
                <button disabled={!selectedStudent} onClick={() => saveAllForStudent(selectedStudent)} className="btn-save-all">Guardar todo</button>
              </div>
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
                    <th>Nota</th>
                    <th>Observación</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesForStudent(selectedStudent).map((g, idx) => {
                    const uniqueKey = `${g.source || 'unknown'}-${g.id}`;
                    return (
                    <tr key={uniqueKey}>
                      <td>{g.id}</td>
                      <td>{g.evaluation}</td>
                      <td>{g.type}</td>
                      <td>
                        <input 
                          type="number" 
                          step="1" 
                          min="10" 
                          max="70"
                          defaultValue={g.score ?? ''} 
                          className="input-score" 
                          placeholder="10 - 70"
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
                  );})}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
