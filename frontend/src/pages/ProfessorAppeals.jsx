import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getAppeals, updateAppeal } from "../services/appeal.service";
import "@styles/appeals.css";

export default function ProfessorAppeals() {
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
      Swal.fire("Error", "No se pudieron cargar las apelaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResolver = (appeal) => {
    // Prepare initial values
    const meetingInitial = appeal.meetingDate ? new Date(appeal.meetingDate).toISOString().slice(0,16) : '';

    Swal.fire({
      title: `Resolver apelación #${appeal.id}`,
      html: `
        <p><strong>Motivo:</strong></p>
        <p>${appeal.reason}</p>

        <textarea id="comment" class="swal2-textarea"
          placeholder="Comentario del profesor">${appeal.comment || ''}</textarea>

        <select id="status" class="swal2-input">
          <option value="">Seleccione decisión</option>
          <option value="aceptada" ${appeal.status === 'aceptada' ? 'selected' : ''}>Aceptar</option>
          <option value="rechazada" ${appeal.status === 'rechazada' ? 'selected' : ''}>Rechazar</option>
        </select>

        <input id="meetingDate" type="datetime-local"
          class="swal2-input" value="${meetingInitial}" />
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      didOpen: () => {
        const statusEl = document.getElementById('status');
        const meetingEl = document.getElementById('meetingDate');

        const toggleMeeting = () => {
          if (!statusEl) return;
          if (statusEl.value === 'rechazada') {
            meetingEl.value = '';
            meetingEl.disabled = true;
            meetingEl.style.opacity = '0.6';
          } else if (statusEl.value === 'aceptada') {
            meetingEl.disabled = false;
            meetingEl.style.opacity = '1';
          } else {
            // pendiente or empty
            meetingEl.disabled = true;
            meetingEl.style.opacity = '0.6';
          }
        };

        statusEl?.addEventListener('change', toggleMeeting);
        toggleMeeting();
      },
      preConfirm: async () => {
        const comment = document.getElementById("comment").value;
        const status = document.getElementById("status").value;
        const meetingDateEl = document.getElementById("meetingDate");
        const meetingDate = meetingDateEl ? meetingDateEl.value : '';

        // Client-side validation — return false to keep modal open and keep buttons responsive
        if (!comment || !status) {
          Swal.showValidationMessage("Completa todos los campos");
          return false;
        }

        if (status === "aceptada" && !meetingDate) {
          Swal.showValidationMessage(
            "Debes ingresar una fecha de cita"
          );
          return false;
        }

        const payload = { comment, status };
        if (status === 'aceptada') {
          payload.meetingDate = meetingDate;
        } else if (meetingDate) {
          payload.meetingDate = meetingDate;
        }

        try {
          const res = await updateAppeal(appeal.id, payload);
          return res;
        } catch (err) {
          const msg = err?.response?.data?.message || err?.message || 'Error al actualizar la apelación';
          Swal.showValidationMessage(msg);
          return false;
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Listo", "Apelación actualizada", "success");
        cargarApelaciones();
      }
    });
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
          <h1>Apelaciones Pendientes</h1>
        </div>

        <div className="appeals-table">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Cargando apelaciones...</p>
            </div>
          ) : appeals.length === 0 ? (
            <div className="appeals-empty" style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No hay apelaciones registradas</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Motivo</th>
                  <th>Fecha cita</th>
                  <th>Acción</th>
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
                    <td>{a.meetingDate ? new Date(a.meetingDate).toLocaleString() : '—'}</td>
                    <td>
                      {a.status === 'pendiente' ? (
                        <button className="btn-gestionar" onClick={() => handleResolver(a)}>
                          Responder
                        </button>
                      ) : (
                        <span className="resuelto-badge">
                          Resuelto
                        </span>
                      )}
                    </td>
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
