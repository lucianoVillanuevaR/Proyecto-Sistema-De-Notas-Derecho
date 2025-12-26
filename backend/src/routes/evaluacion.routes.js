"use strict"
import { Router } from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {checkRole} from "../middleware/role.middleware.js";
import {
    createEvaluacion,
    deleteEvaluacion,
    getEvaluaciones,
    getEvaluacionById,
    updateEvaluacion,
} from "../controllers/evaluacion.controller.js";

const router = Router();
router.get("/", authMiddleware, getEvaluaciones);
router.get("/:id", authMiddleware, getEvaluacionById);

router.post("/", authMiddleware, checkRole("profesor", "admin"), createEvaluacion);
router.put("/:id", authMiddleware, checkRole("profesor", "admin"), updateEvaluacion);
router.delete("/:id", authMiddleware, checkRole("profesor", "admin"), deleteEvaluacion);


export default router;
