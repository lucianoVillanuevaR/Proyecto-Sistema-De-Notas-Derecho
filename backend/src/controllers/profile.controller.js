import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { findUserById, updateUserById, deleteUserById } from "../services/user.service.js";

export async function getPublicProfile(req, res) {
  try {
    // For public profile we can return a simple message or a public endpoint
    handleSuccess(res, 200, "Public profile endpoint", null);
  } catch (error) {
    handleErrorServer(res, 500, "Error fetching public profile", error.message);
  }
}

export async function getPrivateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Usuario no autenticado");
    const user = await findUserById(userId);
    if (!user) return handleErrorClient(res, 404, "Usuario no encontrado");
    handleSuccess(res, 200, "Perfil privado encontrado", user);
  } catch (error) {
    handleErrorServer(res, 500, "Error fetching private profile", error.message);
  }
}

export async function updatePrivateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Usuario no autenticado");
    const changes = req.body;
    const updated = await updateUserById(userId, changes);
    handleSuccess(res, 200, "Perfil actualizado", updated);
  } catch (error) {
    handleErrorServer(res, 500, "Error updating profile", error.message);
  }
}

export async function deletePrivateProfile(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return handleErrorClient(res, 401, "Usuario no autenticado");
    const deleted = await deleteUserById(userId);
    handleSuccess(res, 200, "Perfil eliminado", deleted);
  } catch (error) {
    handleErrorServer(res, 500, "Error deleting profile", error.message);
  }
}

export default { getPublicProfile, getPrivateProfile, updatePrivateProfile, deletePrivateProfile };
