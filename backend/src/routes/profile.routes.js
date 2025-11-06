import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  perfilPublico,
  perfilPrivado,
  actualizarPerfilPrivado,
  eliminarPerfilPrivado,
} from "../controllers/profile.controller.js";
import { validarUpdateProfile } from "../validations/usuario.validation.js";

const router = Router();
router.get("/public", perfilPublico);
router.get("/private", authMiddleware, perfilPrivado);
router.patch("/private", authMiddleware, validarUpdateProfile, actualizarPerfilPrivado);
router.delete("/private", authMiddleware, eliminarPerfilPrivado);
export default router;