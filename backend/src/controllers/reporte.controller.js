import { AppDataSource } from "../config/configDb.js";

export async function obtenerReporteEstudiante(req, res) {
  try {
    const studentId = parseInt(req.params.studentId, 10);
    const { courseId } = req.query;

    // aca va el curso 
    const enrollmentRepo = AppDataSource.getRepository("Enrollment");
    const enrollments = await enrollmentRepo.find({
      where: { student: { id: studentId }, ...(courseId ? { course: { id: parseInt(courseId,10) } } : {}) },
      relations: { course: true, student: true },
    });

    // traer los certamenes cerrados 
    const evaluationRepo = AppDataSource.getRepository("Evaluation");
    const gradeRepo = AppDataSource.getRepository("Grade");

    const report = [];
    for (const enr of enrollments) {
      const evals = await evaluationRepo.find({ where: { course: { id: enr.course.id }, isClosed: true } });
      const rows = [];
      let sum = 0, count = 0;

      for (const ev of evals) {
        const g = await gradeRepo.findOne({
          where: { evaluation: { id: ev.id }, student: { id: studentId } },
          relations: { evaluation: true, student: true },
        });
        const score = g?.score ?? null;
        if (typeof score === "number") { sum += score; count += 1; }
        rows.push({ evaluationId: ev.id, title: ev.title, date: ev.date, score, isClosed: ev.isClosed });
      }

      const promedioParcial = count ? +(sum / count).toFixed(2) : null;
      report.push({
        course: { id: enr.course.id, code: enr.course.code, name: enr.course.name, term: enr.course.term },
        evaluations: rows,
        promedioParcial
      });
    }

    // faltan alertaas
    return res.json({ studentId, report });
  } catch (e) {
    return res.status(500).json({ message: "Error al generar reporte", error: e.message });
  }
}

// default export (nombre en español)
export default { obtenerReporteEstudiante };
