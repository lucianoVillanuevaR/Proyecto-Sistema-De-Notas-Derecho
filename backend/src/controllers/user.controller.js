import {
  findNotas,
  findNotaById,
  createNota,
  updateNota,
  deleteNota,
} from "../services/notas.services.js";
import { manejarExito, manejarErrorCliente, manejarErrorServidor } from "../Handlers/responseHandlers.js";

export class NotasController {
  async getAllNotas(req, res) {
    try {
      const notas = await findNotas();
      manejarExito(res, 200, "Notas obtenidas exitosamente", notas);
    } catch (error) {
      manejarErrorServidor(res, 500, "Error al obtener las notas", error.message);
    }
  }

  async getNotaById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
          return manejarErrorCliente(res, 400, "ID de nota inválido");
      }
      
      const nota = await findNotaById(id);
      manejarExito(res, 200, "Nota obtenida exitosamente", nota);
    } catch (error) {
      manejarErrorCliente(res, 404, error.message);
    }
  }

  async createNota(req, res) {
    try {
      const data = req.body;
      
      if (!data || Object.keys(data).length === 0) {
          return manejarErrorCliente(res, 400, "Datos de la nota son requeridos");
      }
      
      const nuevaNota = await createNota(data);
      manejarExito(res, 201, "Nota creada exitosamente", nuevaNota);
    } catch (error) {
      manejarErrorServidor(res, 500, "Error al crear la nota", error.message);
    }
  }

  async updateNota(req, res) {
    try {
      const { id } = req.params;
      const changes = req.body;
      
      if (!id || isNaN(id)) {
  return manejarErrorCliente(res, 400, "ID de nota inválido");
      }
      
      if (!changes || Object.keys(changes).length === 0) {
  return manejarErrorCliente(res, 400, "Datos para actualizar son requeridos");
      }
      
      const notaActualizada = await updateNota(id, changes);
      manejarExito(res, 200, "Nota actualizada exitosamente", notaActualizada);
    } catch (error) {
      manejarErrorCliente(res, 404, error.message);
    }
  }

  async deleteNota(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
  return manejarErrorCliente(res, 400, "ID de nota inválido");
      }
      
      await deleteNota(id);
      manejarExito(res, 200, "Nota eliminada exitosamente", { id });
    } catch (error) {
      manejarErrorCliente(res, 404, error.message);
    }
  }
}