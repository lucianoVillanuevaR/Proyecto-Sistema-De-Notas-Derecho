import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import evaluationRoutes from "./evaluacion.routes.js";
import reportRoutes from "./reporte.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);

  router.use("/evaluations", evaluationRoutes);
  router.use("/reports", reportRoutes);

  router.get("/health", (_req, res) => res.json({ ok: true }));
}
