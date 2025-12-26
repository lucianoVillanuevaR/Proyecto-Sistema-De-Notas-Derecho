import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    crearApelaciones,
    obtenerApelaciones,
    obtenerNotasParaApelar,
    actualizarApelaciones,
    obtenerApelacionporId,
}   from "../controllers/appeal.controller.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.post("/crear", authMiddleware,checkRole("admin", "estudiante"), crearApelaciones);
router.get("/obtener", authMiddleware, obtenerApelaciones);
router.get("/obtener/id/:id", authMiddleware, obtenerApelacionporId);
router.get("/obtener/notas", authMiddleware, obtenerNotasParaApelar);
router.patch("/actualizar/:id", authMiddleware, checkRole("admin", "profesor"), actualizarApelaciones);

export default router;