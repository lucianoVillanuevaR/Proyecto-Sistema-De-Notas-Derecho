import { AppDataSource } from "../config/configDb.js";
import Asistencia from "../entities/asistenciaEv.entity.js";
import Evaluacion from "../entities/evaluacion.entity.js";
import { Grade } from "../entities/grade.entity.js";

const repo = () => AppDataSource.getRepository(Asistencia);

function mapRawRow(r) {
  const evaluation = r.evaluation !== null && r.evaluation !== undefined ? r.evaluation : (r.evaluacionId ? `Evaluación #${r.evaluacionId}` : null);
  return {
    id: r.id,
    studentId: r.studentId,
    professorId: r.professorId,
    evaluation,
    type: r.type || "escrita",
    score: r.score !== null && r.score !== undefined ? Number(r.score) : null,
    observation: r.observation || null,
    created_at: r.created_at,
  };
}

function mapGradeRow(r) {
  return {
    id: r.id,
    studentId: r.studentId,
    professorId: r.professorId,
    evaluation: r.evaluation,
    type: r.type || 'escrita',
    score: r.score !== null && r.score !== undefined ? Number(r.score) : null,
    observation: r.observation || null,
    created_at: r.created_at,
  };
}

export async function obtenerNotas() {
  // Obtener notas desde la tabla 'grades' y también desde 'asistencias_evaluaciones'
  const gradeRepo = AppDataSource.getRepository(Grade);
  const gqb = gradeRepo.createQueryBuilder('g');
  gqb.select([
    'g.id AS id',
    'g.studentId AS "studentId"',
    'g.professorId AS "professorId"',
    'g.evaluation AS evaluation',
    'g.type AS type',
    'g.score AS score',
    'g.observation AS observation',
    'g.created_at AS created_at',
  ]);
  gqb.orderBy('g.created_at', 'DESC');
  const gradeRows = await gqb.getRawMany();

  const qb = repo().createQueryBuilder("a");
  qb.leftJoin(Evaluacion, "e", "e.id = a.evaluacionId");
  qb.select([
    "a.id AS id",
    "a.estudianteId AS \"studentId\"",
    "a.calificadoPor AS \"professorId\"",
    "e.nombreEv AS evaluation",
    "e.tipoEv AS type",
    "a.nota AS score",
    "a.comentarios AS observation",
    "a.evaluacionId AS evaluacionId",
    "a.createdAt AS created_at",
  ]);
  qb.orderBy("a.createdAt", "DESC");
  const asistenciaRows = await qb.getRawMany();

  const mappedGrades = gradeRows.map(mapGradeRow);
  const mappedAsist = asistenciaRows.map(mapRawRow);
  // Combinar y ordenar por fecha (desc)
  const combined = [...mappedGrades, ...mappedAsist].sort((a, b) => {
    const ta = new Date(a.created_at).getTime() || 0;
    const tb = new Date(b.created_at).getTime() || 0;
    return tb - ta;
  });
  return combined;
}

export async function obtenerNotaPorId(id) {
  const qb = repo().createQueryBuilder("a");
  qb.leftJoin(Evaluacion, "e", "e.id = a.evaluacionId");
  qb.select([
    "a.id AS id",
    "a.estudianteId AS \"studentId\"",
    "a.calificadoPor AS \"professorId\"",
    "e.nombreEv AS evaluation",
    "e.tipoEv AS type",
    "a.nota AS score",
    "a.comentarios AS observation",
    "a.evaluacionId AS evaluacionId",
    "a.createdAt AS created_at",
  ]);
  qb.where("a.id = :id", { id: Number(id) });
  qb.limit(1);

  const r = await qb.getRawOne();
  if (!r) throw new Error("Nota no encontrada");
  return mapRawRow(r);
}

export async function obtenerNotasPorEstudiante(studentId) {
  // Obtener notas desde la tabla 'grades' y también desde 'asistencias_evaluaciones'
  const gradeRepo = AppDataSource.getRepository(Grade);
  const gqb = gradeRepo.createQueryBuilder('g');
  gqb.select([
    'g.id AS id',
    'g.studentId AS "studentId"',
    'g.professorId AS "professorId"',
    'g.evaluation AS evaluation',
    'g.type AS type',
    'g.score AS score',
    'g.observation AS observation',
    'g.created_at AS created_at',
  ]);
  gqb.where('g.studentId = :studentId', { studentId: Number(studentId) });
  gqb.orderBy('g.created_at', 'DESC');
  const gradeRows = await gqb.getRawMany();

  const qb = repo().createQueryBuilder("a");
  qb.leftJoin(Evaluacion, "e", "e.id = a.evaluacionId");
  qb.select([
    "a.id AS id",
    "a.estudianteId AS \"studentId\"",
    "a.calificadoPor AS \"professorId\"",
    "e.nombreEv AS evaluation",
    "e.tipoEv AS type",
    "a.nota AS score",
    "a.comentarios AS observation",
    "a.evaluacionId AS evaluacionId",
    "a.createdAt AS created_at",
  ]);
  qb.where("a.estudianteId = :studentId", { studentId: Number(studentId) });
  qb.orderBy("a.createdAt", "DESC");

  const asistenciaRows = await qb.getRawMany();

  const mappedGrades = gradeRows.map(mapGradeRow);
  const mappedAsist = asistenciaRows.map(mapRawRow);

  // Combinar y ordenar por fecha (desc)
  const combined = [...mappedGrades, ...mappedAsist].sort((a, b) => {
    const ta = new Date(a.created_at).getTime() || 0;
    const tb = new Date(b.created_at).getTime() || 0;
    return tb - ta;
  });

  return combined;
}

export async function crearNota(data) {
  // Crea una entrada en asistencias_evaluaciones como una entrega con nota opcional
  const repository = repo();
  const nueva = repository.create({
    estudianteId: Number(data.studentId),
    evaluacionId: data.evaluacionId ? Number(data.evaluacionId) : null,
    asistio: data.asistio !== undefined ? Boolean(data.asistio) : true,
    nota: data.score !== undefined ? Number(data.score) : null,
    calificadoPor: data.professorId ? Number(data.professorId) : null,
    comentarios: data.observation || null,
    estado: data.score !== undefined ? "calificado" : "pendiente",
  });
  const saved = await repository.save(nueva);
  return await obtenerNotaPorId(saved.id);
}

export async function actualizarNota(id, changes) {
  const repository = repo();
  const registro = await repository.findOne({ where: { id: Number(id) } });
  if (!registro) throw new Error("Nota no encontrada");

  if (changes.evaluation) {
    // cambiar el nombre de la evaluación no se realiza aquí (se requeriría actualizar la tabla evaluaciones)
  }
  if (changes.score !== undefined) registro.nota = Number(changes.score);
  if (changes.observation !== undefined) registro.comentarios = changes.observation;
  if (changes.type !== undefined) {
    // type se toma desde la evaluación asociada; no se modifica aquí
  }

  await repository.save(registro);
  return await obtenerNotaPorId(registro.id);
}

export async function eliminarNota(id) {
  const repository = repo();
  const registro = await repository.findOne({ where: { id: Number(id) } });
  if (!registro) throw new Error("Nota no encontrada");
  await repository.remove(registro);
  return { id: Number(id) };
}
