import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { encontrarUsuarioPorEmail } from "./user.service.js";
import { JWT_SECRET } from "../config/configEnv.js";

export async function iniciarSesion(email, password) {
  const user = await encontrarUsuarioPorEmail(email);
  if (!user) throw new Error("Credenciales incorrectas");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Credenciales incorrectas");

  // Incluimos id para usarlo en req.user.id desde el token
  const payload = { id: user.id, email: user.email };
  // Incluir role en el payload para controlar permisos desde el token
  const payloadWithRole = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payloadWithRole, JWT_SECRET || process.env.JWT_SECRET, { expiresIn: "1h" });

  const { password: _omit, ...safeUser } = user;
  return { user: safeUser, token };
}