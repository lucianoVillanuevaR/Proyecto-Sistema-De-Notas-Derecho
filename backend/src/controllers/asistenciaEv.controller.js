"use strict";
import Asistencia from "../entities/asistenciaEv.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createvalidation, updatevalidation } from "../validations/asistenciaEv.validation.js";

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
			estado: "pendiente",
		};

		const { error } = createvalidation.validate(datosAsistencia);
		if (error) {
			return res.status(400).json({ message: "Error al crear asistencia", error });
		}

		const registro = await asistenciaRepository.findOne({ where: { estudianteId: datosAsistencia.estudianteId, evaluacionId: datosAsistencia.evaluacionId } });
		if (registro) {
			registro.asistio = true;
			registro.estado = registro.nota ? registro.estado : "pendiente";
			await asistenciaRepository.save(registro);
			return res.status(200).json({ message: "Asistencia actualizada exitosamente", data: registro });
		}

		const nuevaAsistencia = asistenciaRepository.create(datosAsistencia);
		await asistenciaRepository.save(nuevaAsistencia);
		return res.status(201).json({ message: "Asistencia registrada exitosamente", data: nuevaAsistencia });
	} catch (error) {
		console.error("Error al registrar asistencia:", error);
		return res.status(500).json({ message: "Error al registrar asistencia", error: error.message });
	}
}

export async function asignarNota(req, res) {
	try {
		const asistenciaRepository = AppDataSource.getRepository(Asistencia);

		if (!req.user || req.user.role !== "profesor") {
			return res.status(403).json({ message: "Acceso denegado" });
		}

		const { id } = req.params;
		const { nota, comentarios } = req.body;

		const { error } = updatevalidation.validate({ nota, comentarios });
		if (error) {
			return res.status(400).json({ message: "Error al actualizar la asistencia", error });
		}

		const registro = await asistenciaRepository.findOne({ where: { id: Number(id) } });
		if (!registro) {
			return res.status(404).json({ message: "Registro de asistencia no encontrado" });
		}

		registro.nota = Number(nota);
		registro.calificadoPor = Number(req.user.id);
		registro.comentarios = comentarios || null;
		registro.estado = "calificado";

		await asistenciaRepository.save(registro);
		return res.status(200).json({ message: "Entrega calificada exitosamente", data: registro });
	} catch (error) {
		console.error("Error al asignar nota:", error);
		return res.status(500).json({ message: "Error al asignar nota", error: error.message });
	}
}