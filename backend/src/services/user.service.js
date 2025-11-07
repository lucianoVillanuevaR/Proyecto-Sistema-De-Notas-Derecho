import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const repositorio = () => AppDataSource.getRepository(User);
export async function crearUsuario(data) {
  const hashed = await bcrypt.hash(String(data.password), 10);
  const role = data.role || "estudiante";
  const nuevoUsuario = repositorio().create({ email: data.email, password: hashed, role });
  const guardado = await repositorio().save(nuevoUsuario);
  const { password, ...seguro } = guardado;
  return seguro;
}

export async function encontrarUsuarioPorEmail(email) {
  return await repositorio().findOne({ where: { email } });
}

export async function encontrarUsuarioPorId(id) {
  return await repositorio().findOne({ where: { id: Number(id) } });
}

export async function actualizarUsuarioPorId(id, cambios) {
  const usuario = await encontrarUsuarioPorId(id);
  if (!usuario) throw new Error("Usuario no encontrado");
  if (cambios.email) usuario.email = cambios.email;
  if (cambios.password) usuario.password = await bcrypt.hash(String(cambios.password), 10);
  const actualizado = await repositorio().save(usuario);
  const { password, ...seguro } = actualizado;
  return seguro;
}

export async function eliminarUsuarioPorId(id) {
  const usuario = await encontrarUsuarioPorId(id);
  if (!usuario) throw new Error("Usuario no encontrado");
  await repositorio().remove(usuario);
  return { id: Number(id) };
}
