"use strict"
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { marcarAsistencia, asignarNota } from "../controllers/asistenciaEv.controller.js";

const router = Router();


router.post("/marcarAsistencia", authMiddleware, marcarAsistencia);
router.put("/:id/nota", authMiddleware, checkRole("profesor"), asignarNota);

export default router;
