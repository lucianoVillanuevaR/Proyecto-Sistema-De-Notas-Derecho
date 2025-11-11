import { Router } from "express";
import appealRoutes from "./appeal.routes.js";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import reportsRoutes from "./reports.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/appeal", appealRoutes);
  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/reports", reportsRoutes);
}