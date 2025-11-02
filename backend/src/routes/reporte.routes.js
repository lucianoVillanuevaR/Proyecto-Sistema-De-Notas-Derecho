import { Router } from "express";
import { autenticacionMiddleware } from "../middleware/auth.middleware.js";
import guardiaRol from "../middleware/role.middleware.js";
import puedeAccederAlumno from "../middleware/access.middleware.js";
import { obtenerReporteEstudiante } from "../controllers/reporte.controller.js";

const router = Router();

// ALUMNO propio, PROFESOR responsable, o ADMIN
router.get("/:studentId", autenticacionMiddleware, guardiaRol("ALUMNO","PROFESOR","ADMIN"), puedeAccederAlumno(), obtenerReporteEstudiante);

export default router;

export { router };


