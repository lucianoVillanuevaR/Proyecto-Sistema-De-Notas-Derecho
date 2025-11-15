"use strict"
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { marcarAsistencia,
        asignarNota,
        getNotasPorEstudiante,
        editarNota,
        eliminarNota } from "../controllers/asistenciaEv.controller.js";

const router = Router();


router.post("/marcarAsistencia", authMiddleware, marcarAsistencia);

router.get("/student/:studentId", authMiddleware, getNotasPorEstudiante);

router.put("/:id/nota", authMiddleware, checkRole("profesor"), asignarNota);

router.put("/:id", authMiddleware, checkRole("profesor", "admin"), editarNota);

router.delete("/:id", authMiddleware, checkRole("profesor", "admin"), eliminarNota);

export default router;
