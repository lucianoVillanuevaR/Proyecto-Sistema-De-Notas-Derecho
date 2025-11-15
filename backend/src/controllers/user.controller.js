import {
  obtenerNotas,
  obtenerNotaPorId,
  actualizarNota,
  eliminarNota,
} from "../services/notas.services.js";
import { crearEntradaHistorial } from "../services/history.service.js";
import { crearNotificacion } from "../services/notification.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export class NotasController {
  async getAllNotas(req, res) {
    try {
      const actor = req.user;
      if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
        return handleErrorClient(res, 403, "Acceso denegado: permisos insuficientes");
      }
      const notas = await obtenerNotas();
      handleSuccess(res, 200, "Notas obtenidas exitosamente", notas);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las notas", error.message);
    }
  }

  async getNotaById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return handleErrorClient(res, 400, "ID de nota inválido");
      }
      
  const nota = await obtenerNotaPorId(id);
      const actor = req.user;
      if (!actor) return handleErrorClient(res, 401, "Usuario no autenticado");
      if (actor.role === "estudiante") {
        if (Number(actor.id) !== Number(nota.studentId)) return handleErrorClient(res, 403, "Acceso denegado: no puedes ver esta nota");
      } else if (actor.role === "profesor") {
        if (Number(actor.id) !== Number(nota.professorId)) return handleErrorClient(res, 403, "Acceso denegado: no eres el profesor responsable de esta nota");
      }
      handleSuccess(res, 200, "Nota obtenida exitosamente", nota);
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }

  async createNota(req, res) {
    try {
      const data = req.body;
      
      if (!data || Object.keys(data).length === 0) {
        return handleErrorClient(res, 400, "Datos de la nota son requeridos");
      }
      
  const nuevaNota = await crearNota(data);
      handleSuccess(res, 201, "Nota creada exitosamente", nuevaNota);
    } catch (error) {
      handleErrorServer(res, 500, "Error al crear la nota", error.message);
    }
  }

  async updateNota(req, res) {
    try {
      const { id } = req.params;
      const changes = req.body;
      
      if (!id || isNaN(id)) {
        return handleErrorClient(res, 400, "ID de nota inválido");
      }
      
      if (!changes || Object.keys(changes).length === 0) {
        return handleErrorClient(res, 400, "Datos para actualizar son requeridos");
      }
      
  // verificar permisos: solo profesor responsable o admin puede actualizar
  const notaAntes = await obtenerNotaPorId(id);
  const actor = req.user;
  if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
    return handleErrorClient(res, 403, "Acceso denegado: permisos insuficientes para actualizar notas");
  }
  // permisos: solo profesores o admins pueden actualizar (no se requiere ser el profesor responsable)
  if (actor.role === "profesor" || actor.role === "admin") {
    // ok
  }

  const notaActualizada = await actualizarNota(id, changes);
      try {
        if (req.user) {
          const details = JSON.stringify({
            actor: { id: req.user.id, email: req.user.email },
            action: 'actualizar_nota',
            before: notaAntes,
            after: notaActualizada,
          });
          await crearEntradaHistorial(notaActualizada.studentId, req.user.id, "actualizar_nota", details);
          // crear notificación in-app para el estudiante con resumen antes/después
          try {
            const diffs = [];
            if ((notaAntes.score ?? null) !== (notaActualizada.score ?? null)) diffs.push(`puntaje: ${notaAntes.score} → ${notaActualizada.score}`);
            if ((notaAntes.evaluation ?? '') !== (notaActualizada.evaluation ?? '')) diffs.push(`evaluación: "${notaAntes.evaluation}" → "${notaActualizada.evaluation}"`);
            if ((notaAntes.type ?? '') !== (notaActualizada.type ?? '')) diffs.push(`tipo: ${notaAntes.type} → ${notaActualizada.type}`);
            if ((notaAntes.observation ?? '') !== (notaActualizada.observation ?? '')) diffs.push('observación actualizada');

            const message = diffs.length > 0 ? `Se actualizaron los siguientes campos: ${diffs.join(', ')}` : `Se actualizó una nota (${notaActualizada.evaluation}).`;

            await crearNotificacion(
              notaActualizada.studentId,
              "nota_actualizada",
              "Se actualizó una nota",
              message,
              { gradeId: notaActualizada.id, before: notaAntes, after: notaActualizada, url: `/reports/student/${notaActualizada.studentId}/report` }
            );
          } catch (notifErr) {
            console.error("Error creando notificación:", notifErr.message || notifErr);
          }
        }
      } catch (logErr) {
        console.error("Error creando entrada de historial:", logErr.message || logErr);
      }
      handleSuccess(res, 200, "Nota actualizada exitosamente", notaActualizada);
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }

  async deleteNota(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return handleErrorClient(res, 400, "ID de nota inválido");
      }
      
  await eliminarNota(id);
      handleSuccess(res, 200, "Nota eliminada exitosamente", { id });
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }
}
