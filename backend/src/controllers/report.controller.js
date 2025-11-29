import { obtenerNotasPorEstudiante } from "../services/notas.services.js";
import { crearEntradaHistorial, obtenerHistorialPorEstudiante } from "../services/history.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import PDFDocument from "pdfkit";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import { Brackets } from "typeorm";

export const reportController = {
  async getInformeEstudiante(req, res) {
    try {
      const { studentId } = req.params;
      const actor = req.user; 

      if (!studentId || isNaN(studentId)) {
        return handleErrorClient(res, 400, "ID de estudiante inválido");
      }

      const sid = Number(studentId);
      if (actor.role === "estudiante") {
        if (actor.id !== sid) return handleErrorClient(res, 403, "Acceso denegado: solo el estudiante puede ver su informe");
      } else if (actor.role === "profesor" || actor.role === "admin") {
        
      } else {
        return handleErrorClient(res, 403, "Acceso denegado: role no permitido");
      }
      const notas = await obtenerNotasPorEstudiante(sid);

      const promediosPorEvaluacion = {};
      let sumaTotal = 0;
      let countTotal = 0;

      notas.forEach((n) => {
        const key = n.evaluation || "sin_evaluacion";
        const modalidad = n.type || "escrita";
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

      const observaciones = notas
        .filter(n => n.observation)
        .map(n => ({ professorId: n.professorId, observation: n.observation, type: n.type || "escrita", created_at: n.created_at }));

      try {
        await crearEntradaHistorial(sid, actor.id, "consulta_informe", `Usuario ${actor.email} consultó informe del estudiante ${sid}`);
      } catch (err) {
        console.warn("No se pudo crear entrada de historial:", err.message || err);
      }

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

  async getHistorialEstudiante(req, res) {
    try {
      const { studentId } = req.params;
      const actor = req.user;

      if (!studentId || isNaN(studentId)) {
        return handleErrorClient(res, 400, "ID de estudiante inválido");
      }

      const sid = Number(studentId);
      if (actor.role === "estudiante") {
        if (actor.id !== sid) return handleErrorClient(res, 403, "Acceso denegado: solo el estudiante puede ver su historial");
      } else if (actor.role === "profesor" || actor.role === "admin") {
        
      } else {
        return handleErrorClient(res, 403, "Acceso denegado: role no permitido");
      }

      const historial = await obtenerHistorialPorEstudiante(sid);
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
  async getMiInforme(req, res) {
    try {
      req.params.studentId = String(req.user.id);
      return await this.getInformeEstudiante(req, res);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener mi informe", error.message);
    }
  },

  // Generar PDF del informe (propio)
  async getMiInformePdf(req, res) {
    try {
      req.params.studentId = String(req.user.id);
      return await this.getInformePdf(req, res);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al generar PDF de mi informe", error.message);
    }
  },

  // Generar PDF del informe por estudiante (profesor o estudiante)
  async getInformePdf(req, res) {
    try {
      const { studentId } = req.params;
      const actor = req.user;

      if (!studentId || isNaN(studentId)) {
        return handleErrorClient(res, 400, "ID de estudiante inválido");
      }

      const sid = Number(studentId);
      if (actor.role === "estudiante") {
        if (actor.id !== sid) return handleErrorClient(res, 403, "Acceso denegado: solo el estudiante puede descargar su informe");
      } else if (actor.role === "profesor" || actor.role === "admin") {
        
      } else {
        return handleErrorClient(res, 403, "Acceso denegado: role no permitido");
      }

      const notas = await obtenerNotasPorEstudiante(sid);

      // calcular promedios (mismo algoritmo que getInformeEstudiante)
      const promediosPorEvaluacion = {};
      let sumaTotal = 0;
      let countTotal = 0;

      notas.forEach((n) => {
        const key = n.evaluation || "sin_evaluacion";
        const modalidad = n.type || "escrita";
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

      const observaciones = notas
        .filter(n => n.observation)
        .map(n => ({ professorId: n.professorId, observation: n.observation, type: n.type || "escrita", created_at: n.created_at }));

      // Registrar consulta en historial (no bloquear si falla)
      try {
        await crearEntradaHistorial(sid, actor.id, "descargar_informe_pdf", `Usuario ${actor.email} descargó informe PDF del estudiante ${sid}`);
      } catch (err) {
        console.warn("No se pudo crear entrada de historial al generar PDF:", err.message || err);
      }

      // Obtener información del estudiante
      const userRepo = AppDataSource.getRepository(User);
      const student = await userRepo.findOne({ where: { id: sid } });
      const studentEmail = student ? student.email : `estudiante ID ${sid}`;

      // Generar PDF con formato profesional
      const doc = new PDFDocument({ 
        margin: 50,
        size: 'A4',
        bufferPages: true
      });
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="informe-${sid}.pdf"`);
      doc.pipe(res);

      // Encabezado principal
      doc.fontSize(20).font('Helvetica-Bold').text('Informe académico - Estudiante ' + sid, { 
        align: "center" 
      });
      doc.moveDown(0.5);

      // Información de generación
      doc.fontSize(10).font('Helvetica').text(`Generado por: ${actor.email} (${actor.role})`, { align: 'left' });
      const fechaFormateada = new Date().toLocaleString('es-CL', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      });
      doc.text(`Fecha: ${fechaFormateada}`, { align: 'left' });
      doc.moveDown(1.5);

      // Sección de Notas
      doc.fontSize(14).font('Helvetica-Bold').text("Notas:", { underline: true });
      doc.moveDown(0.8);

      if (notas.length === 0) {
        doc.fontSize(11).font('Helvetica').text("No hay notas registradas para este estudiante.");
      } else {
        notas.forEach((n, idx) => {
          doc.fontSize(11).font('Helvetica-Bold').text(
            `${idx + 1}. Evaluación: ${n.evaluation} | Tipo: ${n.type || 'escrita'} | Puntaje: ${n.score} | Profesor: ${n.professorId}`
          );
          if (n.observation) {
            doc.fontSize(10).font('Helvetica').text(`   Observación: ${n.observation}`, { 
              indent: 15 
            });
          }
          const fechaNota = new Date(n.created_at).toLocaleString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'GMT'
          });
          doc.fontSize(10).font('Helvetica-Oblique').text(`   Fecha: ${fechaNota}`, { 
            indent: 15 
          });
          doc.moveDown(0.5);
        });
      }

      doc.moveDown(1);

      // Sección de Promedios por evaluación
      doc.fontSize(14).font('Helvetica-Bold').text("Promedios por evaluación:", { underline: true });
      doc.moveDown(0.8);
      
      if (Object.keys(promedios).length === 0) {
        doc.fontSize(11).font('Helvetica').text("No hay promedios calculados.");
      } else {
        Object.keys(promedios).forEach((k) => {
          const item = promedios[k];
          doc.fontSize(11).font('Helvetica-Bold').text(
            `- ${k}: promedio ${item.promedio !== null ? item.promedio : 'N/A'}`
          );
          Object.keys(item.modalidades).forEach(m => {
            doc.fontSize(10).font('Helvetica').text(
              `  * ${m}: ${item.modalidades[m]}`,
              { indent: 20 }
            );
          });
          doc.moveDown(0.3);
        });
      }

      doc.moveDown(1);

      // Promedio General destacado
      doc.fontSize(12).font('Helvetica-Bold').text(
        `Promedio general: ${promedioGeneral !== null ? promedioGeneral : 'N/A'}`,
        { align: 'left' }
      );

      // Sección de Observaciones
      if (observaciones.length > 0) {
        doc.moveDown(1.5);
        doc.fontSize(14).font('Helvetica-Bold').text("Observaciones:", { underline: true });
        doc.moveDown(0.8);
        
        observaciones.forEach((o, i) => {
          const fechaObs = new Date(o.created_at).toLocaleString('es-CL', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'GMT'
          });
          doc.fontSize(11).font('Helvetica-Bold').text(
            `${i + 1}. Profesor ${o.professorId} (${o.type}) - ${fechaObs}`
          );
          doc.fontSize(10).font('Helvetica').text(`   ${o.observation}`, { 
            indent: 15 
          });
          doc.moveDown(0.5);
        });
      }

      // Pie de página con número de páginas
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(9).font('Helvetica').text(
          `Página ${i + 1} de ${pages.count}`,
          50,
          doc.page.height - 50,
          { align: 'center' }
        );
      }

      doc.end();
      
    } catch (error) {
      return handleErrorServer(res, 500, "Error al generar PDF", error.message);
    }
  },

  async getMiHistorial(req, res) {
    try {
      req.params.studentId = String(req.user.id);
      return await this.getHistorialEstudiante(req, res);
    } catch (error) {
      return handleErrorServer(res, 500, "Error al obtener mi historial", error.message);
    }
  },

  // Listar estudiantes (para profesores/admin) con búsqueda por email o nombre (si existe columna 'name')
  async listStudents(req, res) {
    try {
      const actor = req.user;
      if (!actor || (actor.role !== 'profesor' && actor.role !== 'admin')) {
        return handleErrorClient(res, 403, 'Acceso denegado: permisos insuficientes');
      }

      const q = (req.query.q || '').toString().trim();
      const userRepo = AppDataSource.getRepository(User);
      const metadata = userRepo.metadata;
      const hasName = metadata.columns.some(c => c.propertyName === 'name' || c.databaseName === 'name');

      const qb = userRepo.createQueryBuilder('u').where('u.role = :role', { role: 'estudiante' });
      if (q) {
        const param = `%${q}%`;
        qb.andWhere(new Brackets((br) => {
          br.where('u.email ILIKE :param', { param });
          if (hasName) br.orWhere('u.name ILIKE :param', { param });
        }));
      }

      const students = await qb.select(['u.id', 'u.email', hasName ? 'u.name' : undefined].filter(Boolean)).limit(100).getRawMany();

      // Normalize result: getRawMany returns raw column names like u_id; map to id/email/name
      const mapped = students.map(r => {
        const obj = {};
        // raw keys can be like u_id, u_email, u_name
        Object.keys(r).forEach(k => {
          const kk = k.replace(/^u_?/, '').replace(/\./g, '_');
          obj[kk] = r[k];
        });
        return obj;
      });

      return handleSuccess(res, 200, 'Estudiantes listados', mapped);
    } catch (error) {
      return handleErrorServer(res, 500, 'Error al listar estudiantes', error.message);
    }
  }
};

export default reportController;
