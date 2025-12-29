import { iniciarSesion } from "../services/auth.service.js";
import { crearUsuario } from "../services/user.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function iniciarSesionControlador(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return handleErrorClient(res, 400, "Email y contraseña son requeridos");
    }

    const data = await iniciarSesion(email, password);
    handleSuccess(res, 200, "Inicio de sesión exitoso", data);
  } catch (error) {
    handleErrorClient(res, 401, error.message);
  }
}

export async function registrarUsuario(req, res) {
  try {
    const data = req.body;

    if (!data.nombre || !data.rut || !data.email || !data.password) {
      return handleErrorClient(res, 400, "Nombre, RUT, email y contraseña son requeridos");
    }

    const newUser = await crearUsuario(data);
    delete newUser.password;
    handleSuccess(res, 201, "Usuario registrado exitosamente", newUser);
  } catch (error) {
    if (error.code === "23505") {
      handleErrorClient(res, 409, "El email o RUT ya está registrado");
    } else {
      handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}