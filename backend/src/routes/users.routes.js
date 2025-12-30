import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { obtenerTodosLosUsuarios, actualizarUsuario, eliminarUsuario } from "../controllers/user.controller.js";

const router = Router();

router.get("/", authMiddleware, checkRole("admin", "administrador"), obtenerTodosLosUsuarios);

router.put("/:id", authMiddleware, checkRole("admin", "administrador"), actualizarUsuario);

router.delete("/:id", authMiddleware, checkRole("admin", "administrador"), eliminarUsuario);

export default router;
