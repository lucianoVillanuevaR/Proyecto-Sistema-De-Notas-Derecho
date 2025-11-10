import { crearApelacion, obtenerApelacion, obtenerApelacionId, obtenerApelacionEstudiante, actualizarApelacion, obtenerApelacionProfesor } from "../services/appeal.service";
import { handleSuccess,handleErrorClient, handleErrorServer } from "../Handlers/responseHandlers";

export async function crearApelaciones(req, res) {
 try {
    const date = req.body

    if (!data.studentId || !data.gradeId) {
      return handleErrorClient(res, 400, "El ID del estudiante y la nota son requeridos");
    }

    if (!data.reason || data.reason.trim() === "") {
      return handleErrorClient(res, 400, "La razón de apelación es requerida");
    }

    const nuevaApelacion = await crearApelacion(data);
    handleSuccess(res, 201, "Apelación creada exitosamente", nuevaApelacion);
 }  catch (error) {
    handleErrorClient(res, 500, "Error al crear apelación", error.message);
 } 
}

export async function obtenerApelaciones(req, res) {
   try {
      const apelaciones = await obtenerApelacion();
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

export async function obtenerApelacionesPorEstudiante(req, res) {
   try {
      const { studentId } = req.params;

      if (!studentId || isNaN(studentId)) {
         return handleErrorClient(res, 400, "ID de estudiante inválido");
      }

      const apelaciones = await obtenerApelacionEstudiante(studentId);
      handleSuccess(res, 200, "Apelaciones del estudiante obtenidas", apelaciones);
   } catch (error) {
      handleErrorServer(res, 500, "Error al obtener apelaciones del estudiante", error.message);
   }
}

export async function obtenerApelacionesPorProfesor(req, res) {
   try {
      const { professorId } = req.params;

      if (!professorId || isNaN(professorId)) {
         return handleErrorClient(res, 400, "ID de profesor inválido");
      }

      const apelaciones = await obtenerApelacionProfesor(professorId);
      handleSuccess(res, 200, "Apelaciones del profesor obtenidas", apelaciones);
   } catch (error) {
      handleErrorServer(res, 500, "Error al obtener apelaciones del profesor", error.message);
   }
}

export async function actualizarApelaciones(req, res) {
   try {
    const { id } = req.params;
    const cambios = req.body;

    if (!id || isNaN(id)) {
      return handleErrorClient(res, 400, "ID inválido");
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