import { Router } from "express";
import { login, register } from "../controllers/auth.controller.js";
import { validarCrearUsuario } from "../validations/usuario.validation.js";

const router = Router();

router.post("/login", login);             
router.post("/register", validarCrearUsuario, register);

export default router;