import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import {
  perfilPublico,
  perfilPrivado,
  actualizarPerfilPrivado,
  eliminarPerfilPrivado,
  actualizarPerfilPorIdAdmin,
  eliminarPerfilPorIdAdmin,
} from "../controllers/profile.controller.js";
import { validarUpdateProfile } from "../validations/usuario.validation.js";

const router = Router();
router.get("/public", perfilPublico);
router.get("/private", authMiddleware, perfilPrivado);
router.patch("/private", authMiddleware, validarUpdateProfile, actualizarPerfilPrivado);
router.delete("/private", authMiddleware, eliminarPerfilPrivado);
// Admin routes to manage other users
router.patch("/:id", authMiddleware, checkRole("admin"), validarUpdateProfile, actualizarPerfilPorIdAdmin);
router.delete("/:id", authMiddleware, checkRole("admin"), eliminarPerfilPorIdAdmin);
export default router;