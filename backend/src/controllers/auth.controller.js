import { iniciarSesionUsuario } from "../services/auth.service.js";
import { crearUsuario } from "../services/user.service.js";
import { manejarExito, manejarErrorCliente, manejarErrorServidor } from "../Handlers/responseHandlers.js";

export async function iniciarSesion(req, res) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return manejarErrorCliente(res, 400, "Email y contraseña son requeridos");
    }
    
    const data = await iniciarSesionUsuario(email, password);
    manejarExito(res, 200, "Inicio de sesión exitoso", data);
  } catch (error) {
    manejarErrorCliente(res, 401, error.message);
  }
}

export async function registrarUsuario(req, res) {
  try {
    const data = req.body;
    
    if (!data.email || !data.password) {
      return manejarErrorCliente(res, 400, "Email y contraseña son requeridos");
    }
    
    const newUser = await crearUsuario(data);
    delete newUser.password;
    manejarExito(res, 201, "Usuario registrado exitosamente", newUser);
  } catch (error) {
    if (error.code === '23505') {
      manejarErrorCliente(res, 409, "El email ya está registrado");
    } else {
      manejarErrorServidor(res, 500, "Error interno del servidor", error.message);
    }
  }
}
