import { Router } from "express";
import { iniciarSesion, registrarUsuario } from "../controllers/auth.controller.js";
import { validarCrearUsuario } from "../validations/usuario.validation.js";

const router = Router();

router.post("/login", iniciarSesion);             
router.post("/register", validarCrearUsuario, registrarUsuario);

export default router;

export { router };