import { obtenerNotasPorEstudiante } from "../services/notas.services.js";
import { crearEntradaHistorial, obtenerHistorialPorEstudiante } from "../services/history.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export const reportController = {
  // Obtener informe de rendimiento académico para un estudiante
  async getInformeEstudiante(req, res) {
    try {
      const { studentId } = req.params;
      const actor = req.user; // { id, email, role }

      if (!studentId || isNaN(studentId)) {
        return handleErrorClient(res, 400, "ID de estudiante inválido");
      }

      const sid = Number(studentId);

      // Autorización: solo el alumno correspondiente o el profesor responsable
      if (actor.role === "estudiante") {
        if (actor.id !== sid) return handleErrorClient(res, 403, "Acceso denegado: solo el estudiante puede ver su informe");
      } else if (actor.role === "profesor") {
        // verificar que exista al menos una nota de ese estudiante registrada por este profesor
        const notasProfesor = await obtenerNotasPorEstudiante(sid);
        const tieneNotasDelProfesor = notasProfesor.some(n => Number(n.professorId) === Number(actor.id));
        if (!tieneNotasDelProfesor) return handleErrorClient(res, 403, "Acceso denegado: no eres el profesor responsable de este estudiante");
      } else {
        return handleErrorClient(res, 403, "Acceso denegado: role no permitido");
      }

      // Obtener notas del estudiante
      const notas = await obtenerNotasPorEstudiante(sid);

      // Calcular promedios por evaluación y por modalidad (escrita / oral) y promedio general
      const promediosPorEvaluacion = {};
      let sumaTotal = 0;
      let countTotal = 0;

      notas.forEach((n) => {
        const key = n.evaluation || "sin_evaluacion";
        const modalidad = n.type || "escrita"; // 'escrita' o 'oral'
        if (!promediosPorEvaluacion[key]) promediosPorEvaluacion[key] = { totalSuma: 0, totalCount: 0, modalidades: {} };
        if (!promediosPorEvaluacion[key].modalidades[modalidad]) promediosPorEvaluacion[key].modalidades[modalidad] = { suma: 0, count: 0 };
        promediosPorEvaluacion[key].modalidades[modalidad].suma += Number(n.score);
        promediosPorEvaluacion[key].modalidades[modalidad].count += 1;
        promediosPorEvaluacion[key].totalSuma += Number(n.score);
        promediosPorEvaluacion[key].totalCount += 1;
        sumaTotal += Number(n.score);
        countTotal += 1;
      });

      const promedios = {};
      Object.keys(promediosPorEvaluacion).forEach((k) => {
        const obj = promediosPorEvaluacion[k];
        const modalidades = {};
        Object.keys(obj.modalidades).forEach((m) => {
          const mm = obj.modalidades[m];
          modalidades[m] = Number((mm.suma / mm.count).toFixed(2));
        });
        const promedioEvaluacion = obj.totalCount ? Number((obj.totalSuma / obj.totalCount).toFixed(2)) : null;
        promedios[k] = { modalidades, promedio: promedioEvaluacion };
      });

      const promedioGeneral = countTotal ? Number((sumaTotal / countTotal).toFixed(2)) : null;

      // Preparar observaciones (array de { professorId, observation, created_at })
      const observaciones = notas
        .filter(n => n.observation)
        .map(n => ({ professorId: n.professorId, observation: n.observation, type: n.type || "escrita", created_at: n.created_at }));

      // Registrar en historial la consulta
      try {
        await crearEntradaHistorial(sid, actor.id, "consulta_informe", `Usuario ${actor.email} consultó informe del estudiante ${sid}`);
      } catch (err) {
        console.warn("No se pudo crear entrada de historial:", err.message || err);
      }

      // Responder con el informe
      return handleSuccess(res, 200, "Informe obtenido exitosamente", {
        studentId: sid,
        notas,
        promediosPorEvaluacion: promedios,
        promedioGeneral,
        observaciones,
      });
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener el informe", error.message);
    }
  },

  // Obtener historial del estudiante
  async getHistorialEstudiante(req, res) {
    try {
      const { studentId } = req.params;
      const actor = req.user;

      if (!studentId || isNaN(studentId)) {
        return handleErrorClient(res, 400, "ID de estudiante inválido");
      }

      const sid = Number(studentId);

      // Autorización similar: estudiante mismo o profesor responsable puede ver historial
      if (actor.role === "estudiante") {
        if (actor.id !== sid) return handleErrorClient(res, 403, "Acceso denegado: solo el estudiante puede ver su historial");
      } else if (actor.role === "profesor") {
        const notasProfesor = await obtenerNotasPorEstudiante(sid);
        const tieneNotasDelProfesor = notasProfesor.some(n => Number(n.professorId) === Number(actor.id));
        if (!tieneNotasDelProfesor) return handleErrorClient(res, 403, "Acceso denegado: no eres el profesor responsable de este estudiante");
      } else {
        return handleErrorClient(res, 403, "Acceso denegado: role no permitido");
      }

      const historial = await obtenerHistorialPorEstudiante(sid);

      // Registrar la consulta del historial
      try {
        await crearEntradaHistorial(sid, actor.id, "consulta_historial", `Usuario ${actor.email} consultó historial del estudiante ${sid}`);
      } catch (err) {
        console.warn("No se pudo crear entrada de historial:", err.message || err);
      }

      return handleSuccess(res, 200, "Historial obtenido exitosamente", historial);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener historial", error.message);
    }
  }
,

  // Obtener mi propio informe (usa req.user.id)
  async getMiInforme(req, res) {
    try {
      // Delegar estableciendo studentId en params
      req.params.studentId = String(req.user.id);
      return await this.getInformeEstudiante(req, res);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener mi informe", error.message);
    }
  },

  // Obtener mi propio historial (usa req.user.id)
  async getMiHistorial(req, res) {
    try {
      req.params.studentId = String(req.user.id);
      return await this.getHistorialEstudiante(req, res);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener mi historial", error.message);
    }
  }
};

export default reportController;
