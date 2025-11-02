import jwt from "jsonwebtoken";
import { manejarErrorCliente } from "../Handlers/responseHandlers.js";

export function autenticacionMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return manejarErrorCliente(res, 401, "Acceso denegado. No se proporcionó token.");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return manejarErrorCliente(res, 401, "Acceso denegado. Token malformado.");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (error) {
    return manejarErrorCliente(res, 401, "Token inválido o expirado.", error.message);
  }
}

// default export (nombre en español)
export default autenticacionMiddleware;