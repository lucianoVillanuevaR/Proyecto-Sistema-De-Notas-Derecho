"use strict"
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { marcarAsistencia } from "../controllers/asistenciaEv.controller.js";

const router = Router();


router.post("/marcarAsistencia", authMiddleware, marcarAsistencia);

export default router;
