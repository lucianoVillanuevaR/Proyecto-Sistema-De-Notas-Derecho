"use strict";
import Asistencia from "../entities/asistenciaEv.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createvalidation } from "../validations/asistenciaEv.validation.js";
import { crearNotificacion } from "../services/notification.service.js";
import { User } from "../entities/user.entity.js";

export async function marcarAsistencia(req, res) {
	try {
		const asistenciaRepository = AppDataSource.getRepository(Asistencia);
		const estudianteId = req.user && req.user.id;

		if (!estudianteId) {
			return res.status(401).json({ message: "Usuario no autenticado" });
		}

		if (req.user && req.user.role === "profesor") {
			return res.status(403).json({ message: "Los profesores no pueden registrar asistencia" });
		}

		const { evaluacionId } = req.body;
		const datosAsistencia = {
			estudianteId: Number(estudianteId),
			evaluacionId: Number(evaluacionId),
			asistio: true,
		};

		const { error } = createvalidation.validate(datosAsistencia);
		if (error) {
			return res.status(400).json({ message: "Error al crear asistencia", error });
		}

		const registro = await asistenciaRepository.findOne({ where: { estudianteId: datosAsistencia.estudianteId, evaluacionId: datosAsistencia.evaluacionId } });
		if (registro) {
			registro.asistio = true;
			registro.estado = registro.estado || "pendiente";
			await asistenciaRepository.save(registro);
			return res.status(200).json({ message: "Asistencia actualizada exitosamente", data: registro });
		}

		const nuevaAsistencia = asistenciaRepository.create({
			...datosAsistencia,
			estado: "pendiente",
		});
		await asistenciaRepository.save(nuevaAsistencia);
		
		try {
			await crearNotificacion(
				estudianteId,
				"asistencia_registrada",
				"Asistencia Registrada",
				"Tu asistencia ha sido registrada correctamente"
			);
			
			const usuarioRepository = AppDataSource.getRepository(User);
			const profesores = await usuarioRepository.find({ where: { role: "profesor" } });
			
			for (const profesor of profesores) {
				await crearNotificacion(
					profesor.id,
					"estudiante_asistencia",
					"Asistencia de Estudiante Registrada",
					`Un estudiante ha marcado su asistencia en la evaluación ID: ${nuevaAsistencia.evaluacionId}`
				);
			}
		} catch (notifError) {
			console.error("Error al crear notificación de asistencia:", notifError);
		}
		
		return res.status(201).json({ message: "Asistencia registrada exitosamente", data: nuevaAsistencia });
	} catch (error) {
		console.error("Error al registrar asistencia:", error);
		return res.status(500).json({ message: "Error al registrar asistencia", error: error.message });
	}
}
 
