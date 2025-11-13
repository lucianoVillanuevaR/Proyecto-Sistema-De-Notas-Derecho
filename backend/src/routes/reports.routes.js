import { Router } from "express";
import reportController from "../controllers/report.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me/report", authMiddleware, reportController.getMiInforme.bind(reportController));
router.get("/me/history", authMiddleware, reportController.getMiHistorial.bind(reportController));
router.get("/student/:studentId/report", authMiddleware, reportController.getInformeEstudiante.bind(reportController));
router.get("/student/:studentId/history", authMiddleware, reportController.getHistorialEstudiante.bind(reportController));
// PDF endpoints
router.get("/me/report/pdf", authMiddleware, reportController.getMiInformePdf.bind(reportController));
router.get("/student/:studentId/report/pdf", authMiddleware, reportController.getInformePdf.bind(reportController));

export default router;
