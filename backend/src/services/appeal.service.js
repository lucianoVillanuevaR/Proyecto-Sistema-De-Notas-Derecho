import { AppDataSource } from "../config/configDb.js";
import { Appeal } from "../entities/appeal.entity.js";
import { Grade } from "../entities/grade.entity.js"
import { User } from "../entities/user.entity.js";
import { In } from "typeorm";

const repo = () => AppDataSource.getRepository(Appeal);
const repoGrade = () => AppDataSource.getRepository(Grade);

async function enrichAppeals(list) {
    if (!Array.isArray(list) || list.length === 0) return [];

    const gradeIds = [...new Set(list.map(a => a.gradeId).filter(Boolean))];
    const professorIds = [...new Set(list.map(a => a.professorId).filter(Boolean))];
    const studentIds = [...new Set(list.map(a => a.studentId).filter(Boolean))];

    const [grades, professors, students] = await Promise.all([
        gradeIds.length ? repoGrade().findBy({ id: In(gradeIds) }) : [],
        professorIds.length ? AppDataSource.getRepository(User).findBy({ id: In(professorIds) }) : [],
        studentIds.length ? AppDataSource.getRepository(User).findBy({ id: In(studentIds) }) : [],
    ]);

    const gradeMap = new Map(grades.map(g => [g.id, g]));
    const professorMap = new Map(professors.map(p => [p.id, p.nombre]));
    const studentMap = new Map(students.map(s => [s.id, s.nombre]));

    return list.map(a => ({
        ...a,
        gradeEvaluation: gradeMap.get(a.gradeId)?.evaluation ?? null,
        professorName: professorMap.get(a.professorId) ?? a.professorId,
        studentName: studentMap.get(a.studentId) ?? a.studentId,
    }));
}

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
    const list = await repo().find();
    return await enrichAppeals(list);
}

export async function obtenerApelacionId(id) {
    const apelacion = await repo().findOne({ where: { id: Number(id) } });
    //if (!apelacion) throw new Error("Apelacion no encontrada");
    return apelacion;
}

export async function obtenerApelacionEstudiante(studentId) {
    const list = await repo().find({ where: { studentId: Number(studentId) } });
    return await enrichAppeals(list);
}

export async function obtenerApelacionProfesor(professorId) {
    const list = await repo().find({ where: { professorId: Number(professorId) } });
    return await enrichAppeals(list);
}

export async function obtenerNotasApelables(studentId, role) {
    const ahora = new Date();

        const gradeRepo = repoGrade();
        const grades = role === "admin"
            ? await gradeRepo.find()
            : await gradeRepo.find({ where: { studentId: Number(studentId) } });

        // Resolver nombres de profesores sin usar joins SQL
        const professorIds = [...new Set(grades.map(g => g.professorId).filter(Boolean))];
        const professorNameMap = new Map();
        if (professorIds.length) {
            const userRepo = AppDataSource.getRepository(User);
            const professors = await userRepo.findBy({ id: In(professorIds) });
            professors.forEach(p => professorNameMap.set(p.id, p.nombre));
        }

    const apeladas = role === "admin" ? await repo().find({ select: ["gradeId"] }) : await repo().find({
        where: { studentId: Number(studentId) },
        select: ["gradeId"],
    });

    const apeladasIds = apeladas.map(a => a.gradeId);

        return grades
            .filter(grade => {
                if (apeladasIds.includes(grade.id)) return false;
                if (role === "admin") return true;
                const fechaNota = new Date(grade.created_at);
                const diferenciaDias = (ahora - fechaNota) / (1000 * 60 * 60 * 24);
                return diferenciaDias <= 7;
            })
            .map(grade => ({
                ...grade,
                professorName: professorNameMap.get(grade.professorId) || grade.professorId,
            }));
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