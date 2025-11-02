import { Router } from "express";
import { autenticacionMiddleware } from "../middleware/auth.middleware.js";
import {
  obtenerPerfilPublico,
  obtenerPerfilPrivado,
  actualizarPerfilPrivado,
  eliminarPerfilPrivado,
} from "../controllers/profile.controller.js";
import { validarUpdateProfile } from "../validations/usuario.validation.js"; 
const router = Router();
router.get("/public", obtenerPerfilPublico);
router.get("/private", autenticacionMiddleware, obtenerPerfilPrivado);
router.patch("/private", autenticacionMiddleware, validarUpdateProfile, actualizarPerfilPrivado);
router.delete("/private", autenticacionMiddleware, eliminarPerfilPrivado);
export default router;

export { router };