import { Router } from "express";
import authRoutes from "./auth.routes.js";
import profileRoutes from "./profile.routes.js";
import reportsRoutes from "./reports.routes.js";
<<<<<<< HEAD
import evaluacionesRoutes from "./evaluacion.routes.js";
=======
>>>>>>> origin/Dev

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);

  router.use("/auth", authRoutes);
  router.use("/profile", profileRoutes);
  router.use("/reports", reportsRoutes);
<<<<<<< HEAD
  router.use("/evaluaciones", evaluacionesRoutes);
=======
>>>>>>> origin/Dev
}