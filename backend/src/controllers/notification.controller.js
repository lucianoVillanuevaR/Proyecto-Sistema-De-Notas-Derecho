import { crearNotificacion, obtenerNotificacionesPorUsuario, marcarNotificacionLeida } from "../services/notification.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export const notificationController = {
  async getMisNotificaciones(req, res) {
    try {
      const usuario = req.user;
      if (!usuario || !usuario.id) return handleErrorClient(res, 401, "Usuario no autenticado");
      const notificaciones = await obtenerNotificacionesPorUsuario(usuario.id);
      return handleSuccess(res, 200, "Notificaciones obtenidas", notificaciones);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener notificaciones", error.message);
    }
  },

  async marcarLeida(req, res) {
    try {
      const { id } = req.params;
      if (!id || isNaN(id)) return handleErrorClient(res, 400, "ID de notificación inválido");
      const notificacion = await marcarNotificacionLeida(id);
      return handleSuccess(res, 200, "Notificación marcada como leída", notificacion);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al marcar notificación", error.message);
    }
  },

  // utilidad: crear notificación manual (protegido para uso interno si se requiere)
  async crear(req, res) {
    try {
      const { userId, type, title, message, data } = req.body;
      if (!userId || !type || !title || !message) return handleErrorClient(res, 400, "Campos requeridos faltantes");
      const n = await crearNotificacion(userId, type, title, message, data || null);
      return handleSuccess(res, 201, "Notificación creada", n);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al crear notificación", error.message);
    }
  }
};

export default notificationController;
