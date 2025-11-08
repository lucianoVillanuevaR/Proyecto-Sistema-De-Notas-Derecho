"use strict"
import { Router } from "express";
import {authMiddleware} from "../middleware/auth.middleware.js";
import {
    createEvaluacion,
    deleteEvaluacion,
    getEvaluaciones,
    getEvaluacionById,
    updateEvaluacion,
    addNota,
} from "../controllers/evaluacion.controller.js";

const router = Router();
router.get("/", getEvaluaciones);
router.get("/:id", getEvaluacionById);

router.post("/", authMiddleware, createEvaluacion);
router.patch("/:id/nota", authMiddleware, addNota);
router.put("/:id", authMiddleware, updateEvaluacion);
router.delete("/:id", authMiddleware, deleteEvaluacion);


export default router;
