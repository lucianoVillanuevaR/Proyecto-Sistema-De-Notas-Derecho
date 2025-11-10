import { crearApelacion, obtenerApelacion, obtenerApelacionId, obtenerApelacionEstudiante, actualizarApelacion, obtenerApelacionProfesor } from "../services/appeal.service.js";
import { handleSuccess,handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers.js";

export async function crearApelaciones(req, res) {
 try {
    const data = req.body;
    const { role } = req.user;

    if (role !== "estudiante" && role !== "admin") {
      return handleErrorClient(res, 403, "No tienes permisos para crear apelaciones");
    }

    if (!data.studentId || !data.gradeId) {
      return handleErrorClient(res, 400, "El ID del estudiante y la nota son requeridos");
    }

    if (!data.reason || data.reason.trim() === "") {
      return handleErrorClient(res, 400, "La razón de apelación es requerida");
    }

    const nuevaApelacion = await crearApelacion(data);
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

      if (!id || isNaN(id)) {
         return handleErrorClient(res, 400, "ID inválido");
      }

      const apelacion = await obtenerApelacionId(id);
      handleSuccess(res, 200, "Apelación encontrada", apelacion);
   } catch (error) {
      handleErrorClient(res, 404, "Apelación no encontrada", error.message);
   }
}

export async function actualizarApelaciones(req, res) {
   try {
    const { id } = req.params;
    const cambios = req.body;
    const { role } = req.user;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido");
    }

    if (role !== "profesor" && role !== "admin") {
      return handleErrorClient(res, 403, "No tienes permisos para actualizar apelaciones");
    }

    if (!cambios || Object.keys(cambios).length === 0) {
      return handleErrorClient(res, 400, "Datos de actualización requeridos");
    }

    const apelacionActualizada = await actualizarApelacion(id, cambios);
    handleSuccess(res, 200, "Apelación actualizada exitosamente", apelacionActualizada);
  } catch (error) {
    handleErrorServer(res, 500, "Error al actualizar la apelación", error.message);
  }
}