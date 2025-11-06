import { AppDataSource } from "../config/configDb.js";
import { History } from "../entities/history.entity.js";

const repo = () => AppDataSource.getRepository(History);

export async function crearEntradaHistorial(studentId, userId, action, details = null) {
  const entry = repo().create({
    studentId: Number(studentId),
    userId: Number(userId),
    action,
    details,
  });
  return await repo().save(entry);
}

export async function obtenerHistorialPorEstudiante(studentId) {
  return await repo().find({ where: { studentId: Number(studentId) }, order: { created_at: "DESC" } });
}
