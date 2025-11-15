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

export async function getNotasPorEstudiante(req, res) {
	try {
		const asistenciaRepository = AppDataSource.getRepository(Asistencia);
		const { studentId } = req.params;

		if (!studentId || isNaN(studentId)) {
			return res.status(400).json({ message: "ID de estudiante inválido" });
		}

		const actor = req.user;
		if (!actor) return res.status(401).json({ message: "Usuario no autenticado" });

		if (actor.role === "estudiante" && Number(actor.id) !== Number(studentId)) {
			return res.status(403).json({ message: "Acceso denegado: no puedes ver estas notas" });
		}

		const notas = await asistenciaRepository.find({ where: { estudianteId: Number(studentId) } });
		return res.status(200).json({ message: "Notas obtenidas exitosamente", data: notas });
	} catch (error) {
		console.error("Error al obtener notas por estudiante:", error);
		return res.status(500).json({ message: "Error al obtener notas por estudiante", error: error.message });
	}
}

export async function editarNota(req, res) {
	try {
		const asistenciaRepository = AppDataSource.getRepository(Asistencia);
		const { id } = req.params;
		const changes = req.body;

		if (!id || isNaN(id)) return res.status(400).json({ message: "ID de asistencia inválido" });
		if (!changes || Object.keys(changes).length === 0) return res.status(400).json({ message: "Datos para actualizar son requeridos" });

		const actor = req.user;
		if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
			return res.status(403).json({ message: "Acceso denegado: permisos insuficientes" });
		}

		const { error } = updatevalidation.validate(changes);
		if (error) return res.status(400).json({ message: "Error de validación", error });

		const registro = await asistenciaRepository.findOne({ where: { id: Number(id) } });
		if (!registro) return res.status(404).json({ message: "Registro de asistencia no encontrado" });

		if (changes.nota !== undefined) registro.nota = Number(changes.nota);
		if (changes.comentarios !== undefined) registro.comentarios = changes.comentarios;
		if (changes.estado !== undefined) registro.estado = changes.estado;
		registro.calificadoPor = changes.nota !== undefined ? Number(actor.id) : registro.calificadoPor;

		await asistenciaRepository.save(registro);
		return res.status(200).json({ message: "Nota actualizada exitosamente", data: registro });
	} catch (error) {
		console.error("Error al actualizar nota:", error);
		return res.status(500).json({ message: "Error al actualizar nota", error: error.message });
	}
}

export async function eliminarNota(req, res) {
	try {
		const asistenciaRepository = AppDataSource.getRepository(Asistencia);
		const { id } = req.params;

		if (!id || isNaN(id)) return res.status(400).json({ message: "ID de asistencia inválido" });

		const actor = req.user;
		if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
			return res.status(403).json({ message: "Acceso denegado: permisos insuficientes" });
		}

		const registro = await asistenciaRepository.findOne({ where: { id: Number(id) } });
		if (!registro) return res.status(404).json({ message: "Registro de asistencia no encontrado" });

		await asistenciaRepository.remove(registro);
		return res.status(200).json({ message: "Nota eliminada exitosamente" });
	} catch (error) {
		console.error("Error al eliminar nota:", error);
		return res.status(500).json({ message: "Error al eliminar nota", error: error.message });
	}
}

export async function getTodasNotas(req, res) {
	try {
		const asistenciaRepository = AppDataSource.getRepository(Asistencia);

		const actor = req.user;
		if (!actor || (actor.role !== "profesor" && actor.role !== "admin")) {
			return res.status(403).json({ message: "Acceso denegado: permisos insuficientes" });
		}

		const notas = await asistenciaRepository.find();
		return res.status(200).json({ message: "Todas las notas obtenidas exitosamente", data: notas });
	} catch (error) {
		console.error("Error al obtener todas las notas:", error);
		return res.status(500).json({ message: "Error al obtener todas las notas", error: error.message });
	}
}