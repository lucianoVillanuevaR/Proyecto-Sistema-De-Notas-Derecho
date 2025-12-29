import { Router } from "express";
import appealRoutes from "./appeal.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import reportsRoutes from "./reports.routes.js";
import evaluacionesRoutes from "./evaluacion.routes.js";
import asistenciaRoutes from "./asistenciaEv.routes.js";
import gradesRoutes from "./grades.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import usersRoutes from "./users.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/appeal", appealRoutes);
  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/reports", reportsRoutes);
  router.use("/evaluaciones", evaluacionesRoutes);
  router.use("/asistencias", asistenciaRoutes);
  router.use("/grades", gradesRoutes);
  router.use("/notifications", notificationsRoutes);
  router.use("/users", usersRoutes);
}