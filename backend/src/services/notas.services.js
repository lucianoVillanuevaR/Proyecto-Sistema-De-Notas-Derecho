import { AppDataSource } from "../config/configDb.js";
import { Grade } from "../entities/grade.entity.js";

const repo = () => AppDataSource.getRepository(Grade);

export async function obtenerNotas() {
  return await repo().find();
}

export async function obtenerNotaPorId(id) {
  const nota = await repo().findOne({ where: { id: Number(id) } });
  if (!nota) throw new Error("Nota no encontrada");
  return nota;
}

export async function obtenerNotasPorEstudiante(studentId) {
  return await repo().find({ where: { studentId: Number(studentId) } });
}

export async function crearNota(data) {
  const nueva = repo().create({
    studentId: Number(data.studentId),
    professorId: Number(data.professorId),
    evaluation: data.evaluation,
    score: Number(data.score),
    observation: data.observation || null,
    // type: 'escrita' o 'oral'
    type: data.type || "escrita",
  });
  return await repo().save(nueva);
}

export async function actualizarNota(id, changes) {
  const nota = await obtenerNotaPorId(id);
  if (changes.evaluation) nota.evaluation = changes.evaluation;
  if (changes.score !== undefined) nota.score = Number(changes.score);
  if (changes.observation !== undefined) nota.observation = changes.observation;
  if (changes.type !== undefined) nota.type = changes.type;
  return await repo().save(nota);
}

export async function eliminarNota(id) {
  const nota = await obtenerNotaPorId(id);
  await repo().remove(nota);
  return { id: Number(id) };
}
