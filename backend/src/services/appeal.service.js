import { AppDataSource } from "../config/configDb.js";
import { Appeal } from "../entities/appeal.entity.js";
import { Grade } from "../entities/grade.entity.js"

const repo = () => AppDataSource.getRepository(Appeal);
const repoGrade = () => AppDataSource.getRepository(Grade);

export async function crearApelacion(data) {
    const grade = await repoGrade().findOne({
        where: { id: Number(data.gradeId) },
    });

    if (!grade) {
        throw new Error("La calificación no existe");
    }

    const existe = await repo().findOne({
        where: { gradeId: grade.id, },
    });

    if (existe) {
        throw new Error("Ya existe una apelación para esta calificación");
    }

    if (data.role !== "admin" && grade.studentId !== data.studentId) {
        throw new Error("No puedes apelar una nota que no es tuya");
    }

    if (data.role === "estudiante") {
        const ahora = new Date();
        const fechaNota = new Date(grade.created_at);

        const diferenciaEnDias =
            (ahora - fechaNota) / (1000 * 60 * 60 * 24);

        if (diferenciaEnDias > 7) {
            throw new Error(
                "No puedes apelar una nota con más de 7 días de antigüedad"
            );
        }
    }
    
    const nuevaAp = repo().create({
        studentId: Number(data.studentId),
        professorId: grade.professorId,
        gradeId: grade.id,
        reason: data.reason,
    });
    return await repo().save(nuevaAp);
}

export async function obtenerApelacion() {
    return await repo().find();
}

export async function obtenerApelacionId(id) {
    const apelacion = await repo().findOne({ where: { id: Number(id) } });
    //if (!apelacion) throw new Error("Apelacion no encontrada");
    return apelacion;
}

export async function obtenerApelacionEstudiante(studentId) {
    return await repo().find({ where: { studentId: Number(studentId) } });
}

export async function obtenerApelacionProfesor(professorId) {
    return await repo().find({ where: { professorId: Number(professorId) } });
}

export async function obtenerNotasApelables(studentId, role) {
    const ahora = new Date();

    const grades = role === "admin" ? await repoGrade().find() : await repoGrade().find({
        where: { studentId: Number(studentId) },
    });

    const apeladas = role === "admin"? await repo().find({ select: ["gradeId"] }) : await repo().find({
        where: { studentId: Number(studentId) },
        select: ["gradeId"],
    });

    const apeladasIds = apeladas.map(a => a.gradeId);

    return grades.filter(grade => {
        if (apeladasIds.includes(grade.id)) return false;
        if (role === "admin") return true;
        const fechaNota = new Date(grade.created_at);
        const diferenciaDias = (ahora - fechaNota) / (1000 * 60 * 60 * 24);
        return diferenciaDias <= 7;
    });
}

export async function actualizarApelacion(id, changes) {
    const apelacion = await obtenerApelacionId(id);
    if (!apelacion) throw new Error("Apelación no encontrada");
    if (changes.comment !== undefined) apelacion.comment = changes.comment;
    if (changes.status) {
        const allowed = ["aceptada", "rechazada"];
        if (allowed.includes(changes.status))
            apelacion.status = changes.status;
    }
    if (changes.meetingDate) apelacion.meetingDate = changes.meetingDate;
    return await repo().save(apelacion);
}