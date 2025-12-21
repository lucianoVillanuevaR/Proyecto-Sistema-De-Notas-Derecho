import { handleErrorClient } from "../Handlers/responseHandlers.js";

export function checkRole(...allowedRoles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role) return handleErrorClient(res, 403, "Acceso denegado. Role no encontrado.");
    if (!allowedRoles.includes(role)) return handleErrorClient(res, 403, "Acceso denegado. Permisos insuficientes.");
    next();
  };
}
