import {
  obtenerNotas,
  obtenerNotaPorId,
  crearNota,
  actualizarNota,
  eliminarNota,
} from "../services/notas.services.js";
import { crearEntradaHistorial } from "../services/history.service.js";
import { crearNotificacion } from "../services/notification.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export class NotasController {
  async getAllNotas(req, res) {
    try {
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
      try {
        if (req.user) {
          await crearEntradaHistorial(
            nuevaNota.studentId,
            req.user.id,
            "crear_nota",
            `Usuario ${req.user.email} creó la nota ${nuevaNota.id}`
          );
          // crear notificación in-app para el estudiante
          try {
            await crearNotificacion(
              nuevaNota.studentId,
              "nota_creada",
              "Se registró una nueva nota",
              `Se ha registrado una nueva nota (${nuevaNota.evaluation}) con puntaje ${nuevaNota.score}`,
              { gradeId: nuevaNota.id }
            );
          } catch (notifErr) {
            console.error("Error creando notificación:", notifErr.message || notifErr);
          }
        }
      } catch (logErr) {
        // don't block main flow if logging fails
        console.error("Error creando entrada de historial:", logErr.message || logErr);
      }
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
      
  const notaActualizada = await actualizarNota(id, changes);
      try {
        if (req.user) {
          await crearEntradaHistorial(
            notaActualizada.studentId,
            req.user.id,
            "actualizar_nota",
            `Usuario ${req.user.email} actualizó la nota ${notaActualizada.id}`
          );
          // crear notificación in-app para el estudiante
          try {
            await crearNotificacion(
              notaActualizada.studentId,
              "nota_actualizada",
              "Se actualizó una nota",
              `La nota (${notaActualizada.evaluation}) fue actualizada a ${notaActualizada.score}`,
              { gradeId: notaActualizada.id }
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
  const notaParaEliminar = await obtenerNotaPorId(id);
  await eliminarNota(id);
      try {
        if (req.user) {
          await crearEntradaHistorial(
            notaParaEliminar.studentId,
            req.user.id,
            "eliminar_nota",
            `Usuario ${req.user.email} eliminó la nota ${id}`
          );
        }
      } catch (logErr) {
        console.error("Error creando entrada de historial:", logErr.message || logErr);
      }
      handleSuccess(res, 200, "Nota eliminada exitosamente", { id });
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }
}
