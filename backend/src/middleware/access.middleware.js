import { AppDataSource } from "../config/configDb.js";

export function puedeAccederAlumno() {
  return async (req, res, next) => {
    try {
      const requester = req.user; // id  , email, role
      const studentId = parseInt(req.params.studentId || req.query.studentId, 10);
      if (!studentId) return res.status(400).json({ message: "studentId requerido" });

      if (requester.role === "ADMIN") return next();
      if (requester.role === "ALUMNO" && requester.id === studentId) return next();

      // validacion para profesor 
      if (requester.role === "PROFESOR") {
        const teacherCourseRepo = AppDataSource.getRepository("TeacherCourse");
        const enrollmentRepo = AppDataSource.getRepository("Enrollment");

        const enrollments = await enrollmentRepo.find({
          where: { student: { id: studentId } },
          relations: { course: true, student: true },
        });

        if (enrollments.length === 0) return res.status(403).json({ message: "Sin relación con el alumno" });

        const courseIds = enrollments.map(e => e.course.id);
        const count = await teacherCourseRepo.count({
          where: { teacher: { id: requester.id }, course: { id: courseIds } },
          relations: { teacher: true, course: true },
        });

        if (count > 0) return next();
      }

      return res.status(403).json({ message: "No autorizado para este alumno" });
    } catch (e) {
      return res.status(500).json({ message: "Error de acceso", error: e.message });
    }
  };
}

// default export (nombre en español)
export default puedeAccederAlumno;
