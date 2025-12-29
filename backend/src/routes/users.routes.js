import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { UserController } from "../controllers/user.controller.js";

const router = Router();
const userController = new UserController();

// Obtener todos los usuarios
router.get("/", authMiddleware, checkRole("admin", "administrador"), (req, res) =>
  userController.obtenerTodosLosUsuarios(req, res)
);

// Actualizar usuario
router.put("/:id", authMiddleware, checkRole("admin", "administrador"), (req, res) =>
  userController.actualizarUsuario(req, res)
);

// Eliminar usuario
router.delete("/:id", authMiddleware, checkRole("admin", "administrador"), (req, res) =>
  userController.eliminarUsuario(req, res)
);

export default router;
