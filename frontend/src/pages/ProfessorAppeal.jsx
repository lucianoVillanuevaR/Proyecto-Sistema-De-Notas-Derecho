import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAppeals,
  updateAppeal
} from "../services/appeal.service";

export default function ProfessorAppeals() {
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarApelaciones();
  }, []);

  const cargarApelaciones = async () => {
    try {
      setLoading(true);

      const response = await getAppeals();

      // 👇 IMPORTANTE: el backend devuelve { status, message, data }
      const data = response?.data;

      console.log("📦 Apelaciones recibidas:", data);

      setAppeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error cargando apelaciones:", error);
      Swal.fire(
        "Error",
        "No se pudieron cargar las apelaciones",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResolver = (appeal) => {
    Swal.fire({
      title: `Resolver apelación #${appeal.id}`,
      html: `
        <p><strong>Motivo del estudiante:</strong></p>
        <p style="margin-bottom:10px;">${appeal.reason}</p>

        <textarea
          id="comment"
          class="swal2-textarea"
          placeholder="Comentario del profesor"
        ></textarea>

        <select id="status" class="swal2-input">
          <option value="">Seleccione decisión</option>
          <option value="aceptada">Aceptar</option>
          <option value="rechazada">Rechazar</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar decisión",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const comment = document.getElementById("comment").value;
        const status = document.getElementById("status").value;

        if (!comment || comment.trim().length < 3 || !status) {
          Swal.showValidationMessage(
            "Debes escribir un comentario y seleccionar una decisión"
          );
          return false;
        }

        return { comment, status };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateAppeal(appeal.id, result.value);

          await Swal.fire(
            "Listo",
            "La apelación fue resuelta correctamente",
            "success"
          );

          cargarApelaciones();
        } catch (error) {
          console.error("❌ Error resolviendo apelación:", error);
          Swal.fire(
            "Error",
            error.response?.data?.message ||
              "No se pudo resolver la apelación",
            "error"
          );
        }
      }
    });
  };

  if (loading) return <p>Cargando apelaciones...</p>;

  return (
    <div>
      <h1>Apelaciones Pendientes</h1>

      {appeals.length === 0 ? (
        <p>No hay apelaciones pendientes</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Estado</th>
              <th>Motivo</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {appeals.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.status}</td>
                <td>{a.reason}</td>
                <td>
                  {a.status === "pendiente" && (
                    <button onClick={() => handleResolver(a)}>
                      Gestionar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
