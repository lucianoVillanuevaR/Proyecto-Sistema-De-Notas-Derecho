import { Router } from "express";
import { autenticacionMiddleware } from "../middleware/auth.middleware.js";
import guardiaRol from "../middleware/role.middleware.js";
import { cerrarEvaluacion } from "../controllers/evaluacion.controller.js";

const router = Router();

// Cerrar evaluación (solo PROFESOR o ADMIN)
router.post("/:id/close", autenticacionMiddleware, guardiaRol("PROFESOR", "ADMIN"), cerrarEvaluacion);

export default router;

export { router };
