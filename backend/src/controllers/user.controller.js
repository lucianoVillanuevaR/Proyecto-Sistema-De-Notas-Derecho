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
  // permisos: solo profesores o admins pueden actualizar 
  if (actor.role === "profesor" || actor.role === "admin") {
  }

  const notaActualizada = await actualizarNota(id, changes);
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
