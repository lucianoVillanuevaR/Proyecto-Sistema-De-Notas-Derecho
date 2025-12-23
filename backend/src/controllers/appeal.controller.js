import { crearApelacion, obtenerApelacion, obtenerApelacionId, obtenerApelacionEstudiante, actualizarApelacion, obtenerApelacionProfesor, obtenerNotasApelables } from "../services/appeal.service.js";
import { crearNotificacion } from "../services/notification.service.js";
import { createAppealValidation, updateAppealValidation } from "../validations/appeal.validation.js";
import { handleSuccess,handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function crearApelaciones(req, res) {
 try {
    const { error } = createAppealValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        error.details[0].message
      );
    }
    
    const { id, role, email } = req.user;

    if (role !== "estudiante" && role !== "admin") {
      return handleErrorClient(res, 403, "No tienes permisos para crear apelaciones");
    }

    const nuevaApelacion = await crearApelacion({
      ...req.body,
      studentId: id,
      role,
   });

   try {
      await crearNotificacion(
        nuevaApelacion.professorId,
        "nueva_apelacion",
        "Nueva apelación recibida",
        `El estudiante ${email} ha enviado una apelación.`,
        {
          appealId: nuevaApelacion.id,
          gradeId: nuevaApelacion.gradeId,
          studentId: nuevaApelacion.studentId,
          url: `/appeals/${nuevaApelacion.id}`
        }
      );
    } catch (err) {
      console.error("Error creando notificación:", err.message);
    }

    handleSuccess(res, 201, "Apelación creada exitosamente", nuevaApelacion);
 }  catch (error) {
    handleErrorServer(res, 500, "Error al crear apelación", error.message);
 } 
}

export async function obtenerApelaciones(req, res) {
   try {
      const { role, id } = req.user;

      let apelaciones;

      if (role === "admin") {
         apelaciones = await obtenerApelacion();
      } else if (role === "estudiante") {
         apelaciones = await obtenerApelacionEstudiante(id);
      } else if (role === "profesor") {
         apelaciones = await obtenerApelacionProfesor(id);
      } else {
         return handleErrorClient(res, 403, "No tienes permisos para ver apelaciones");
      }
      
      handleSuccess(res, 200, "Apelaciones obtenidas exitosamente", apelaciones);
   } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las apelaciones", error.message);
   }
}

export async function obtenerApelacionporId(req, res){
   try {
      const { id } = req.params;
      const { role, id: userId } = req.user;

      if (!id || isNaN(id)) {
         return handleErrorClient(res, 400, "ID inválido");
      }

      const apelacion = await obtenerApelacionId(id);

      if (!apelacion) return handleErrorClient(res, 404, "Apelación no encontrada");

      if ((role === "estudiante" && apelacion.studentId !== userId) || (role === "profesor" && apelacion.professorId !== userId)) {
         return handleErrorClient(res, 403, "No tienes permisos para ver esta apelación");
      }

      handleSuccess(res, 200, "Apelación encontrada", apelacion);
   } catch (error) {
      handleErrorServer(res, 500, "Error al obtener las apelaciones", error.message);
   }
}

export async function obtenerNotasParaApelar(req, res) {
    try {
      const { id, role } = req.user;

      if (role !== "estudiante" && role !== "admin") {
        return handleErrorClient(res, 403, "No tienes permisos");
      }

      const notas = await obtenerNotasApelables(id, role);

      handleSuccess(res, 200, "Notas obtenidas", notas);
    } catch (error) {
      handleErrorServer(res, 500, "Error al obtener notas", error.message);
    }
}

export async function actualizarApelaciones(req, res) {
   try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido");
    }

    const { error } = updateAppealValidation.validate(req.body);

    if (error) {
      return handleErrorClient(
        res,
        400,
        error.details[0].message
      );
    }

    const apelacion = await obtenerApelacionId(id);

    if (!apelacion) {
      return handleErrorClient(res, 404, "Apelación no encontrada");
    }

    if (role === "estudiante") {
      return handleErrorClient(res, 403, "Los estudiantes no pueden actualizar apelaciones");
    }

    if (role === "profesor" && apelacion.professorId != userId) {
      return handleErrorClient(res, 403, "No tienes permisos para actualizar la apelación");
    }

    const apelacionActualizada = await actualizarApelacion(id, req.body);

    try {
      await crearNotificacion(
        apelacionActualizada.studentId,
        "apelacion_actualizada",
        "Tu apelación fue actualizada",
        `Estado actual: ${apelacionActualizada.status}`,
        {
          appealId: apelacionActualizada.id,
          status: apelacionActualizada.status,
          comment: apelacionActualizada.comment || null,
          url: `/appeals/${apelacionActualizada.id}`
        }
      );
    } catch (err) {
      console.error("Error creando notificación:", err.message);
    }

    handleSuccess(res, 200, "Apelación actualizada exitosamente", apelacionActualizada);
  } catch (error) {
    handleErrorServer(res, 500, "Error al actualizar la apelación", error.message);
  }
}