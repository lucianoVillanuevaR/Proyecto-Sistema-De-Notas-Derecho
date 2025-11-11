import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
    crearApelaciones,
    obtenerApelaciones,
    actualizarApelaciones,
    obtenerApelacionporId,
}   from "../controllers/appeal.controller.js";

const router = Router();

router.post("/", authMiddleware, crearApelaciones);
router.get("/", authMiddleware, obtenerApelaciones);
router.get("/:id", authMiddleware, obtenerApelacionporId);
router.patch("/:id", authMiddleware, actualizarApelaciones);

export default router;