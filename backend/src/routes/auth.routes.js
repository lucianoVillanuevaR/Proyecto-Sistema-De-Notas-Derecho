import { Router } from "express";
import { iniciarSesionControlador, registrarUsuario, cerrarSesion } from "../controllers/auth.controller.js";
import { validarCrearUsuario } from "../validations/usuario.validation.js";

const router = Router();

router.post("/login", iniciarSesionControlador);
router.post("/register", validarCrearUsuario, registrarUsuario);
router.post("/logout", cerrarSesion);

export default router;