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
      const userRepo = AppDataSource.getRepository(User);
      const student = await userRepo.findOne({ where: { id: sid } });
      const studentName = notas[0]?.studentName || student?.nombre || null;
      const studentEmail = notas[0]?.studentEmail || student?.email || null;

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
        studentName,
        studentEmail,
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
        await crearEntradaHistorial(sid, actor.id, "descargar_informe_pdf", `Usuario ${actor.email} descargó informe PDF del estudiante ${sid}`);
      } catch (err) {
        console.warn("No se pudo crear entrada de historial al generar PDF:", err.message || err);
      }

  
      const userRepo = AppDataSource.getRepository(User);
      const student = await userRepo.findOne({ where: { id: sid } });
      const studentName = notas[0]?.studentName || student?.nombre || `#${sid}`;
      const studentEmail = notas[0]?.studentEmail || student?.email || 'N/A';
      const doc = new PDFDocument({ 
        margin: 60,
        size: 'A4',
        bufferPages: true
      });
      
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="reporte-calificaciones-${sid}.pdf"`);
      doc.pipe(res);
      const pageWidth = doc.page.width;
      const leftMargin = 60;
      const rightMargin = 60;
      const topMargin = 50;

      doc.fontSize(8).font('Helvetica')
         .fillColor('#0066CC')
         .text('UNIVERSIDAD DEL BÍO-BÍO', leftMargin, topMargin, { 
           align: 'center',
           width: pageWidth - leftMargin - rightMargin
         });
      
      doc.moveDown(1);
      
      doc.fontSize(20).font('Helvetica-Bold')
         .fillColor('#000000')
         .text('Universidad del Bío-Bío', { 
           align: 'center',
           width: pageWidth - leftMargin - rightMargin
         });
      
      doc.moveDown(0.7);
      
      doc.fontSize(16).font('Helvetica-Bold')
         .fillColor('#000000')
         .text('Reporte de Calificaciones', { 
           align: 'center',
           width: pageWidth - leftMargin - rightMargin
         });
      
      doc.moveDown(0.5);
      
      doc.fontSize(11).font('Helvetica')
         .fillColor('#FF8C00')
         .text('Facultad de Ciencias Jurídicas y Sociales', { 
           align: 'center',
           width: pageWidth - leftMargin - rightMargin
         });
      
      doc.moveDown(1.2);
      
      const lineY = doc.y;
      doc.moveTo(leftMargin, lineY)
         .lineTo(pageWidth - rightMargin, lineY)
         .strokeColor('#0066CC')
         .lineWidth(3)
         .stroke();
      
      doc.moveDown(1.5);

      const infoStartY = doc.y;
      
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000')
        .text('Estudiante:', leftMargin, infoStartY);
      doc.font('Helvetica')
        .text(studentName, leftMargin + 80, infoStartY);
      
      doc.font('Helvetica-Bold')
         .text('Email:', leftMargin, infoStartY + 15);
      doc.font('Helvetica')
         .text(studentEmail, leftMargin + 80, infoStartY + 15);
      
      doc.font('Helvetica-Bold')
        .text('ID:', leftMargin, infoStartY + 30);
      doc.font('Helvetica')
        .text(String(sid), leftMargin + 80, infoStartY + 30);
      

      const ahora = new Date();
      const fechaFormateada = `${ahora.getDate()} de ${['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][ahora.getMonth()]} de ${ahora.getFullYear()}`;
      doc.font('Helvetica-Bold')
         .text('Fecha:', leftMargin, infoStartY + 45);
      doc.font('Helvetica')
         .fillColor('#0066CC')
         .text(fechaFormateada, leftMargin + 80, infoStartY + 45);
      
      doc.y = infoStartY + 70;
      doc.moveDown(1);

      const tableTop = doc.y;
      const tableHeaders = ['Evaluación', 'Tipo', 'Nota', 'Observación'];
      const tableWidth = pageWidth - leftMargin - rightMargin;
      const colWidths = [240, 80, 60, 130];
      const colX = [
        leftMargin, 
        leftMargin + 240, 
        leftMargin + 320, 
        leftMargin + 380
      ];
      
      doc.fontSize(10).font('Helvetica').fillColor('#999999');
      tableHeaders.forEach((header, i) => {
        doc.text(header, colX[i] + 5, tableTop, { 
          width: colWidths[i] - 10, 
          align: 'left'
        });
      });
      
      let currentY = tableTop + 20;

      if (notas.length === 0) {
        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#666666');
        doc.text('No hay calificaciones registradas', leftMargin, currentY + 10, {
          align: 'center',
          width: tableWidth
        });
        currentY += 40;
      } else {
        notas.forEach((nota, idx) => {
          const rowHeight = 25;
          
          doc.fontSize(10).font('Helvetica').fillColor('#000000');
          

          doc.text(nota.evaluation || 'N/A', colX[0] + 5, currentY, { 
            width: colWidths[0] - 10,
            ellipsis: true
          });

          doc.text(nota.type || 'escrita', colX[1] + 5, currentY, { 
            width: colWidths[1] - 10
          });
          
      
          const notaValor = Number(nota.score);
          const colorNota = notaValor <= 39 ? '#E74C3C' : '#0066CC';
          doc.fillColor(colorNota).font('Helvetica-Bold')
             .text(notaValor, colX[2] + 5, currentY, { 
               width: colWidths[2] - 10,
               align: 'left'
             });
          
   
          doc.fillColor('#000000').font('Helvetica');
          doc.text(nota.observation || '', colX[3] + 5, currentY, { 
            width: colWidths[3] - 10,
            ellipsis: true
          });
          
          currentY += rowHeight;
        });
      }

      doc.moveDown(2);
      currentY = doc.y + 20;

      const promedioTexto = promedioGeneral !== null ? promedioGeneral.toFixed(2) : 'N/A';
      
      doc.fontSize(13).font('Helvetica-Bold')
         .fillColor('#0066CC')
         .text(`Promedio General: ${promedioTexto}`, leftMargin, currentY, {
           align: 'center',
           width: pageWidth - leftMargin - rightMargin
         });

      doc.moveDown(3);

      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        
        const footerY = doc.page.height - 70;
        
        doc.fontSize(9).font('Helvetica').fillColor('#0066CC');
        doc.text(
          'Sistema de Gestión de Evaluaciones - Universidad del Bío-Bío',
          leftMargin,
          footerY,
          { align: 'center', width: pageWidth - leftMargin - rightMargin }
        );
        
        doc.fontSize(8).fillColor('#999999');
        doc.text(
          `Documento generado el ${ahora.toLocaleString('es-CL', { 
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}`,
          leftMargin,
          footerY + 15,
          { align: 'center', width: pageWidth - leftMargin - rightMargin }
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

      // mapiar = id/email/name
      const mapped = students.map(r => {
        const obj = {};
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
