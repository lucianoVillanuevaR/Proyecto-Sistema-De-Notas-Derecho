import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import reportsRoutes from "./reports.routes.js";
import evaluacionesRoutes from "./evaluacion.routes.js";
import asistenciaRoutes from "./asistenciaEv.routes.js";
import gradesRoutes from "./grades.routes.js";
import notificationsRoutes from "./notifications.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/reports", reportsRoutes);
  router.use("/evaluaciones", evaluacionesRoutes);
  router.use("/asistencias", asistenciaRoutes);
  router.use("/grades", gradesRoutes);
  router.use("/notifications", notificationsRoutes);
}