import { Router } from "express";
import reportController from "../controllers/report.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

// Obtener mi informe (usuario autenticado)
router.get("/me/report", authMiddleware, reportController.getMiInforme.bind(reportController));
// Obtener mi historial (usuario autenticado)
router.get("/me/history", authMiddleware, reportController.getMiHistorial.bind(reportController));

// Obtener informe de rendimiento por estudiante (protegido)
router.get("/student/:studentId/report", authMiddleware, reportController.getInformeEstudiante.bind(reportController));

// Obtener historial de acciones del estudiante (protegido)
router.get("/student/:studentId/history", authMiddleware, reportController.getHistorialEstudiante.bind(reportController));

export default router;
