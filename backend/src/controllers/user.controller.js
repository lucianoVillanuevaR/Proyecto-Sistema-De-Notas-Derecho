import {
  obtenerNotas,
  obtenerNotaPorId,
  actualizarNota,
  eliminarNota,
  crearNota,
} from "../services/notas.services.js";
import { crearEntradaHistorial } from "../services/history.service.js";
import { crearNotificacion } from "../services/notification.service.js";
import { handleSuccess, handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";

export class NotasController {
  async getAllNotas(req, res) {
    try {
      const actor = req.user;
      if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
        return handleErrorClient(res, 403, "Acceso denegado: permisos insuficientes");
      }
      const profesorId = actor.role === "profesor" ? actor.id : null;
      const notas = await obtenerNotas(profesorId);
      handleSuccess(res, 200, "Notas obtenidas exitosamente", notas);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las notas", error.message);
    }
  }

  async getNotaById(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return handleErrorClient(res, 400, "ID de nota inválido");
      }
      
  const nota = await obtenerNotaPorId(id);
      const actor = req.user;
      if (!actor) return handleErrorClient(res, 401, "Usuario no autenticado");
      if (actor.role === "estudiante") {
        if (Number(actor.id) !== Number(nota.studentId)) return handleErrorClient(res, 403, "Acceso denegado: no puedes ver esta nota");
      } else if (actor.role === "profesor") {
        if (Number(actor.id) !== Number(nota.professorId)) return handleErrorClient(res, 403, "Acceso denegado: no eres el profesor responsable de esta nota");
      }
      handleSuccess(res, 200, "Nota obtenida exitosamente", nota);
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }

  async updateNota(req, res) {
    try {
      const { id } = req.params;
      const changes = req.body;
      
      if (!id || isNaN(id)) {
        return handleErrorClient(res, 400, "ID de nota inválido");
      }
      
      if (!changes || Object.keys(changes).length === 0) {
        return handleErrorClient(res, 400, "Datos para actualizar son requeridos");
      }
      
  const notaAntes = await obtenerNotaPorId(id);
  const actor = req.user;
  if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
    return handleErrorClient(res, 403, "Acceso denegado: permisos insuficientes para actualizar notas");
  }
  if (actor.role === "profesor" || actor.role === "admin") {
  }

  const notaActualizada = await actualizarNota(id, changes);
      try {
        if (req.user) {
          const details = JSON.stringify({
            actor: { id: req.user.id, email: req.user.email },
            action: 'actualizar_nota',
            before: notaAntes,
            after: notaActualizada,
          });
          await crearEntradaHistorial(notaActualizada.studentId, req.user.id, "actualizar_nota", details);
          try {
            const diffs = [];
            if ((notaAntes.score ?? null) !== (notaActualizada.score ?? null)) diffs.push(`puntaje: ${notaAntes.score} → ${notaActualizada.score}`);
            if ((notaAntes.evaluation ?? '') !== (notaActualizada.evaluation ?? '')) diffs.push(`evaluación: "${notaAntes.evaluation}" → "${notaActualizada.evaluation}"`);
            if ((notaAntes.type ?? '') !== (notaActualizada.type ?? '')) diffs.push(`tipo: ${notaAntes.type} → ${notaActualizada.type}`);
            if ((notaAntes.observation ?? '') !== (notaActualizada.observation ?? '')) diffs.push('observación actualizada');

            const message = diffs.length > 0 ? `Se actualizaron los siguientes campos: ${diffs.join(', ')}` : `Se actualizó una nota (${notaActualizada.evaluation}).`;

            await crearNotificacion(
              notaActualizada.studentId,
              "nota_actualizada",
              "Se actualizó una nota",
              message,
              { gradeId: notaActualizada.id, before: notaAntes, after: notaActualizada, url: `/reports/student/${notaActualizada.studentId}/report` }
            );
          } catch (notifErr) {
            console.error("Error creando notificación:", notifErr.message || notifErr);
          }
        }
      } catch (logErr) {
        console.error("Error creando entrada de historial:", logErr.message || logErr);
      }
      handleSuccess(res, 200, "Nota actualizada exitosamente", notaActualizada);
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }

  async deleteNota(req, res) {
    try {
      const { id } = req.params;
      
      if (!id || isNaN(id)) {
        return handleErrorClient(res, 400, "ID de nota inválido");
      }
  const notaParaEliminar = await obtenerNotaPorId(id);
  const actor = req.user;
  if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
    return handleErrorClient(res, 403, "Acceso denegado: permisos insuficientes para eliminar notas");
  }
  if (actor.role === "profesor" || actor.role === "admin") {
  }
  await eliminarNota(id);
      try {
        if (req.user) {
          const details = JSON.stringify({
            actor: { id: req.user.id, email: req.user.email },
            action: 'eliminar_nota',
            before: notaParaEliminar,
            after: null,
          });
          await crearEntradaHistorial(notaParaEliminar.studentId, req.user.id, "eliminar_nota", details);
          try {
            await crearNotificacion(
              notaParaEliminar.studentId,
              "nota_eliminada",
              "Se eliminó una nota",
              `Se eliminó la nota (${notaParaEliminar.evaluation}) con puntaje ${notaParaEliminar.score}`,
              { gradeId: notaParaEliminar.id, before: notaParaEliminar, url: `/reports/student/${notaParaEliminar.studentId}/report` }
            );
          } catch (notifErr) {
            console.error("Error creando notificación:", notifErr.message || notifErr);
          }
        }
      } catch (logErr) {
        console.error("Error creando entrada de historial:", logErr.message || logErr);
      }
      handleSuccess(res, 200, "Nota eliminada exitosamente", { id });
    } catch (error) {
      handleErrorClient(res, 404, error.message);
    }
  }

  async createNota(req, res) {
    try {
      const actor = req.user;
      if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
        return handleErrorClient(res, 403, "Acceso denegado: permisos insuficientes");
      }

      const { studentId, evaluacionId, score, observation } = req.body;

      // Validar campos requeridos
      if (!studentId) {
        return handleErrorClient(res, 400, "studentId es requerido");
      }

      // Validar rango de calificación
      if (score !== undefined && score !== null) {
        const scoreNum = Number(score);
        if (isNaN(scoreNum) || scoreNum < 10 || scoreNum > 70) {
          return handleErrorClient(res, 400, "La nota debe estar entre 10 y 70");
        }
      }

      const nuevaNota = await crearNota({
        studentId,
        evaluacionId,
        score,
        observation,
        professorId: actor.id,
        asistio: true,
      });

      // Crear entrada en historial
      try {
        const details = JSON.stringify({
          actor: { id: actor.id, email: actor.email },
          action: 'crear_nota',
          data: nuevaNota,
        });
        await crearEntradaHistorial(studentId, actor.id, "crear_nota", details);

        // Notificar al estudiante
        await crearNotificacion(
          studentId,
          "nota_creada",
          "Nueva calificación",
          `Se ha registrado una nueva calificación${evaluacionId ? ` para la evaluación #${evaluacionId}` : ""} con puntaje ${score}`,
          { gradeId: nuevaNota.id, url: `/reports/student/${studentId}/report` }
        );
      } catch (logErr) {
        console.error("Error en historial/notificaciones:", logErr.message || logErr);
      }

      handleSuccess(res, 201, "Nota creada exitosamente", nuevaNota);
    } catch (error) {
      console.error("Error creando nota:", error);
      handleErrorServer(res, 500, "Error al crear la nota", error.message);
    }
  }
}

export async function obtenerTodosLosUsuarios(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ["id", "nombre", "email", "rut", "role"],
    });

    handleSuccess(res, 200, "Usuarios obtenidos exitosamente", users);
  } catch (error) {
    console.error("Error en UserController:", error);
    handleErrorServer(res, 500, "Error al obtener usuarios", error.message);
  }
}

export async function actualizarUsuario(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    const { nombre, rut, email, role } = req.body;

    const usuario = await userRepository.findOne({ where: { id } });
    if (!usuario) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    if (email && email !== usuario.email) {
      const emailExiste = await userRepository.findOne({ where: { email } });
      if (emailExiste && emailExiste.id !== usuario.id) {
        return handleErrorClient(res, 400, "Ya existe otro usuario con ese email");
      }
    }
  
    if (rut && rut !== usuario.rut) {
      const rutExiste = await userRepository.findOne({ where: { rut } });
      if (rutExiste && rutExiste.id !== usuario.id) {
        return handleErrorClient(res, 400, "Ya existe otro usuario con ese RUT");
      }
    }

    usuario.nombre = nombre || usuario.nombre;
    usuario.rut = rut || usuario.rut;
    usuario.email = email || usuario.email;
    usuario.role = role || usuario.role;

    await userRepository.save(usuario);

    handleSuccess(res, 200, "Usuario actualizado exitosamente", usuario);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    handleErrorServer(res, 500, "Error al actualizar el usuario", error.message);
  }
}

export async function eliminarUsuario(req, res) {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { id } = req.params;
    
    const usuario = await userRepository.findOne({ where: { id } });
    if (!usuario) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }

    await userRepository.remove(usuario);
    handleSuccess(res, 200, "Usuario eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    handleErrorServer(res, 500, "Error al eliminar el usuario", error.message);
  }
}
