import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { encontrarUsuarioPorId, actualizarUsuarioPorId, eliminarUsuarioPorId } from "../services/user.service.js";

export async function perfilPublico(req, res) {
  try {
    // Endpoint público de perfil (ejemplo)
    handleSuccess(res, 200, "Endpoint de perfil público", null);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener el perfil público", error.message);
  }
}

export async function perfilPrivado(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Usuario no autenticado");
    const user = await encontrarUsuarioPorId(userId);
    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado");
    handleSuccess(res, 200, "Perfil privado encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener el perfil privado", error.message);
  }
}

export async function actualizarPerfilPrivado(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Usuario no autenticado");
    const cambios = req.body;
    const actualizado = await actualizarUsuarioPorId(userId, cambios);
    handleSuccess(res, 200, "Perfil actualizado", actualizado);
  } catch (error) {
    handleErrorServer(res, 500, "Error al actualizar el perfil", error.message);
  }
}

export async function eliminarPerfilPrivado(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Usuario no autenticado");
    const eliminado = await eliminarUsuarioPorId(userId);
    handleSuccess(res, 200, "Perfil eliminado", eliminado);
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar el perfil", error.message);
  }
}

export async function actualizarPerfilPorIdAdmin(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return handleErrorClient(res, 400, "ID inválido");
    const cambios = req.body;
    const actualizado = await actualizarUsuarioPorId(id, cambios);
    handleSuccess(res, 200, "Perfil actualizado (admin)", actualizado);
  } catch (error) {
    handleErrorServer(res, 500, "Error al actualizar el perfil (admin)", error.message);
  }
}

export async function eliminarPerfilPorIdAdmin(req, res) {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) return handleErrorClient(res, 400, "ID inválido");
    const eliminado = await eliminarUsuarioPorId(id);
    handleSuccess(res, 200, "Perfil eliminado (admin)", eliminado);
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar el perfil (admin)", error.message);
  }
}

export default { perfilPublico, perfilPrivado, actualizarPerfilPrivado, eliminarPerfilPrivado };
