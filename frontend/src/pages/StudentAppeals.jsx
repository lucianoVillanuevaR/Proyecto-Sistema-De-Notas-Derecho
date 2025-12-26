import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
  getAppeals,
  getAppealableGrades,
  createAppeal
} from '../services/appeal.service';
import "@styles/appeals.css";
import "@styles/evaluaciones.css";

export default function StudentAppeals() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    cargarApelaciones();
  }, []);

  const cargarApelaciones = async () => {
    try {
      setLoading(true);
      const data = await getAppeals();
      setAppeals(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar las apelaciones', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearApelacion = async () => {
    try {
      const notas = await getAppealableGrades();

      if (!Array.isArray(notas) || notas.length === 0) {
        Swal.fire(
          'Sin notas',
          'No tienes notas disponibles para apelar',
          'info'
        );
        return;
      }

      const { value } = await Swal.fire({
        title: 'Crear Apelación',
        html: `
          <select id="gradeId" class="swal2-input">
            <option value="">Seleccione una nota</option>
            ${notas
              .map(
                n => `
                  <option
                    value="${n.id}"
                    data-profesor="${n.professorId ?? 'N/A'}"
                    data-evaluation="${n.evaluation ?? 'Sin nombre'}"
                    data-score="${n.score ?? 'N/A'}"
                  >
                    ${n.evaluation ?? 'Evaluación'} – Nota ${n.score ?? 'N/A'}
                  </option>
                `
              )
              .join('')}
          </select>

          <div
            id="infoNota"
            style="margin-top:10px; font-size:14px; color:#555;"
          ></div>

          <textarea
            id="reason"
            class="swal2-textarea"
            placeholder="Motivo de la apelación"
          ></textarea>
        `,
        didOpen: () => {
          const select = document.getElementById('gradeId');
          const info = document.getElementById('infoNota');

          select.addEventListener('change', () => {
            const option = select.options[select.selectedIndex];

            if (!option.value) {
              info.innerHTML = '';
              return;
            }

            const evaluation = option.getAttribute('data-evaluation');
            const score = option.getAttribute('data-score');
            const professor = option.getAttribute('data-profesor');

            info.innerHTML = `
              <table class="note-info-table">
                <tbody>
                  <tr>
                    <td class="note-info-label">Evaluación</td>
                    <td class="note-info-value">${evaluation}</td>
                  </tr>
                  <tr>
                    <td class="note-info-label">Calificación</td>
                    <td class="note-info-value">${score}</td>
                  </tr>
                  <tr>
                    <td class="note-info-label">Profesor</td>
                    <td class="note-info-value">${professor}</td>
                  </tr> 
                </tbody>
              </table>
            `;
          });
        },
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
          const gradeId = document.getElementById('gradeId').value;
          const reason = document.getElementById('reason').value;

          if (!gradeId || !reason || reason.trim().length < 5) {
            Swal.showValidationMessage(
              'Debes seleccionar una nota y escribir un motivo válido'
            );
            return false;
          }

          return { gradeId, reason };
        }
      });

      if (value) {
        await createAppeal(value);
        await Swal.fire(
          '¡Enviada!',
          'Tu apelación fue creada correctamente',
          'success'
        );
        cargarApelaciones();
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        'Error',
        error.response?.data?.message || 'No se pudo crear la apelación',
        'error'
      );
    }
  };

  // Paginación
  const totalPages = Math.max(1, Math.ceil(appeals.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const appealsPaginadas = appeals.slice(startIndex, endIndex);

  return (
    <div className="appeals-container">
      <div className="appeals-wrapper">
        <div className="appeals-header">
          <h1>Mis Apelaciones</h1>
          <button className="btn-crear" onClick={handleCrearApelacion}>
            + Crear Apelación
          </button>
        </div>

        <div className="appeals-table">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Cargando apelaciones...</p>
            </div>
          ) : appeals.length === 0 ? (
            <div className="appeals-empty" style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No tienes apelaciones registradas</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Comentario</th>
                  <th>Fecha cita</th>
                </tr>
              </thead>
              <tbody>
                {appealsPaginadas.map((a) => (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>
                      <span className={`status-badge ${
                        a.status === 'pendiente' ? 'status-pendiente' :
                        a.status === 'aceptada' ? 'status-aceptada' :
                        'status-rechazada'
                      }`}>
                        {a.status === 'pendiente' ? 'Pendiente' : a.status === 'aceptada' ? 'Aceptada' : 'Rechazada'}
                      </span>
                    </td>
                    <td>{a.reason}</td>
                    <td>{a.comment || '-'}</td>
                    <td>{a.meetingDate ? new Date(a.meetingDate).toLocaleString() : '—'}</td> 
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && appeals.length > 0 && (
          <div className="pagination">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}