import { Router } from "express";
import notificationController from "../controllers/notification.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", authMiddleware, notificationController.getMisNotificaciones.bind(notificationController));
router.post("/mark-read/:id", authMiddleware, notificationController.marcarLeida.bind(notificationController));
router.post("/create", authMiddleware, notificationController.crear.bind(notificationController));

export default router;
