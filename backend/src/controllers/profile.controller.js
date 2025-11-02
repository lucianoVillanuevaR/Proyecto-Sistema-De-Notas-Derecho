import { manejarExito, manejarErrorCliente, manejarErrorServidor } from "../Handlers/responseHandlers.js";
import { encontrarUsuarioPorId, actualizarUsuarioPorId, eliminarUsuarioPorId } from "../services/user.service.js";

export async function obtenerPerfilPublico(req, res) {
  try {
    // Para el perfil público devolvemos un mensaje sencillo
    manejarExito(res, 200, "Endpoint de perfil público", null);
  } catch (error) {
    manejarErrorServidor(res, 500, "Error al obtener perfil público", error.message);
  }
}

export async function obtenerPerfilPrivado(req, res) {
  try {
  const userId = req.user?.id;
  if (!userId) return manejarErrorCliente(res, 401, "Usuario no autenticado");
    const user = await encontrarUsuarioPorId(userId);
    if (!user) return manejarErrorCliente(res, 404, "Usuario no encontrado");
    manejarExito(res, 200, "Perfil privado obtenido", user);
  } catch (error) {
    manejarErrorServidor(res, 500, "Error al obtener perfil privado", error.message);
  }
}

export async function actualizarPerfilPrivado(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return manejarErrorCliente(res, 401, "Usuario no autenticado");
    const changes = req.body;
    const updated = await actualizarUsuarioPorId(userId, changes);
    manejarExito(res, 200, "Perfil actualizado", updated);
  } catch (error) {
    manejarErrorServidor(res, 500, "Error al actualizar perfil", error.message);
  }
}

export async function eliminarPerfilPrivado(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return manejarErrorCliente(res, 401, "Usuario no autenticado");
    const deleted = await eliminarUsuarioPorId(userId);
    manejarExito(res, 200, "Perfil eliminado", deleted);
  } catch (error) {
    manejarErrorServidor(res, 500, "Error al eliminar perfil", error.message);
  }
}

export default { obtenerPerfilPublico, obtenerPerfilPrivado, actualizarPerfilPrivado, eliminarPerfilPrivado };
