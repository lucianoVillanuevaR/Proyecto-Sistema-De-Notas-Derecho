import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const repo = () => AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashed = await bcrypt.hash(String(data.password), 10);
  const newUser = repo().create({ email: data.email, password: hashed });
  const saved = await repo().save(newUser);
  const { password, ...safe } = saved;
  return safe;
}

export async function findUserByEmail(email) {
  return await repo().findOne({ where: { email } });
}

export async function findUserById(id) {
  return await repo().findOne({ where: { id: Number(id) } });
}

export async function updateUserById(id, changes) {
  const user = await findUserById(id);
  if (!user) throw new Error("Usuario no encontrado");
  if (changes.email) user.email = changes.email;
  if (changes.password) user.password = await bcrypt.hash(String(changes.password), 10);
  const updated = await repo().save(user);
  const { password, ...safe } = updated;
  return safe;
}

export async function deleteUserById(id) {
  const user = await findUserById(id);
  if (!user) throw new Error("Usuario no encontrado");
  await repo().remove(user);
  return { id: Number(id) };
}