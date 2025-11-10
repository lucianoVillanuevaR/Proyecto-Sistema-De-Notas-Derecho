import { AppDataSource } from "../config/configDb.js";
import { Appeal } from "../entities/appeal.entity.js";

const repo = () => AppDataSource.getRepository(Appeal);

export async function crearApelacion(data) {
    const nuevaAp = repo().create({
        studentId: Number(data.studentId),
        professorId: Number(data.professorId),
        gradeId: Number(data.gradeId),
        reason: data.reason,
    });
    return await repo().save(nuevaAp);
}

export async function obtenerApelacion() {
    return await repo().find();
}

export async function obtenerApelacionId(id) {
    const apelacion = await repo().findOne({ where: { id: Number(id) } });
    if (!apelacion) throw new Error("Apelacion no encontrada");
    return apelacion;
}

export async function obtenerApelacionEstudiante(studentId) {
    return await repo().find({ where: { studentId: Number(studentId) } });
}

export async function obtenerApelacionProfesor(professorId) {
    return await repo().find({ where: { professorId: Number(professorId) } });
}

export async function actualizarApelacion(id, changes) {
    const apelacion = await obtenerApelacionId(id);
    if (changes.status) apelacion.status = changes.status;
    if (changes.meetingDate) apelacion.meetingDate = changes.meetingDate;
    return await repo().save(apelacion);
}