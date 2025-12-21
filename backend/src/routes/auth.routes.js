import { Router } from "express";
import { iniciarSesionControlador, registrarUsuario } from "../controllers/auth.controller.js";
import { validarCrearUsuario } from "../validations/usuario.validation.js";

const router = Router();

router.post("/login", iniciarSesionControlador);
router.post("/register", validarCrearUsuario, registrarUsuario);

export default router;