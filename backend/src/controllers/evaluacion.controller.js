"use strict";
import Evaluacion from "../entities/evaluacion.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createvalidation, updatevalidation } from "../validations/evaluacion.validation.js";
import { crearNotificacion } from "../services/notification.service.js";
import { User } from "../entities/user.entity.js";

export async function getEvaluaciones(req, res){
    try {
    const evaluacionesRepository = AppDataSource.getRepository(Evaluacion);

        const evaluaciones = await evaluacionesRepository.find();

        res.status(200).json(({message: "Evaluaciones obtenidas exitosamente",data: evaluaciones}));
    } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
        res.status(500).json({message: "Error al obtener las evaluaciones", error: error.message});
    }
}

export async function getEvaluacionById(req, res){
    try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { id } = req.params;

    const evaluacion = await evaluacionRepository.findOne({where: { id }});

        if(!evaluacion){
            return res.status(404).json({message: "Evaluacion no encontrada"});
        }

        res.status(200).json({message: "Evaluacion obtenida exitosamente", data: evaluacion});
    } catch (error) {
        console.error("Error al obtener la evaluacion por ID:", error);
        res.status(500).json({message: "Error al obtener la evaluacion por ID", error: error.message});
        }
    }

export async function createEvaluacion(req, res){
    try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { nombreEv, asignatura1, profesor, ponderacion, tipoEv } = req.body;
        const { error } = createvalidation.validate(req.body);
        if(error){
            return res.status(400).json({message: "Error al crear la evaluacion", error: error});
        }

        const nuevaEvaluacion = evaluacionRepository.create({
            nombreEv,
            asignatura1,
            profesor,
            ponderacion,
            tipoEv
        });
        
        const existeMismaAsignatura = await evaluacionRepository.findOne({where: { nombreEv, asignatura1 }});
        if (existeMismaAsignatura) {
            return res.status(400).json({ message: "Ya existe una evaluación con ese nombre en la misma asignatura." });
        }

        await evaluacionRepository.save(nuevaEvaluacion);
        
        try {
            const usuarioRepository = AppDataSource.getRepository(User);
            const estudiantes = await usuarioRepository.find({ where: { role: "estudiante" } });
            const profesores = await usuarioRepository.find({ where: { role: "profesor" } });
            
            for (const estudiante of estudiantes) {
                await crearNotificacion(
                    estudiante.id,
                    "evaluacion_creada",
                    "Nueva Evaluación",
                    `Se ha creado una nueva evaluación: ${nuevaEvaluacion.nombreEv} en ${nuevaEvaluacion.asignatura1}`
                );
            }
            
            for (const profesor of profesores) {
                await crearNotificacion(
                    profesor.id,
                    "evaluacion_creada",
                    "Nueva Evaluación Creada",
                    `Se ha creado una nueva evaluación: ${nuevaEvaluacion.nombreEv} en ${nuevaEvaluacion.asignatura1}`
                );
            }
        } catch (notifError) {
            console.error("Error al crear notificaciones:", notifError);
        }
        
        res.status(201).json({
            message: "Evaluacion creada exitosamente",
            data: nuevaEvaluacion
        });
    } catch (error) {
        console.error("Error al crear la evaluacion:", error);
        res.status(500).json({message: "Error al crear la evaluacion"});
    }
}
export async function updateEvaluacion(req, res){
    try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { id } = req.params;
        const { nombreEv, asignatura1, profesor, ponderacion, tipoEv } = req.body;

        const evaluacion = await evaluacionRepository.findOne({where: { id }});
        if(!evaluacion){
            return res.status(404).json({message: "Evaluacion no encontrada"});
        }
        const { error } = updatevalidation.validate(req.body);
        if(error){
            return res.status(400).json({message: "Error al actualizar la evaluacion", error: error});
        }

        const nuevoNombre = nombreEv || evaluacion.nombreEv;
        const nuevaAsignatura = asignatura1 || evaluacion.asignatura1;
        const conflicto = await evaluacionRepository.findOne({ where: { nombreEv: nuevoNombre, asignatura1: nuevaAsignatura } });
        if (conflicto && conflicto.id !== evaluacion.id) {
            return res.status(400).json({ message: "Ya existe otra evaluación con ese nombre en la misma asignatura." });
        }

    evaluacion.nombreEv = nombreEv || evaluacion.nombreEv;
    evaluacion.asignatura1 = asignatura1 || evaluacion.asignatura1;
    evaluacion.profesor = profesor || evaluacion.profesor;
    evaluacion.ponderacion = ponderacion || evaluacion.ponderacion;
    evaluacion.tipoEv = tipoEv || evaluacion.tipoEv;

    await evaluacionRepository.save(evaluacion);
    try {
        const usuarioRepository = AppDataSource.getRepository(User);
        const estudiantes = await usuarioRepository.find({ where: { role: "estudiante" } });
        const profesores = await usuarioRepository.find({ where: { role: "profesor" } });

        for (const estudiante of estudiantes) {
            await crearNotificacion(
                estudiante.id,
                "evaluacion_actualizada",
                "Evaluación Actualizada",
                `Se ha actualizado la evaluación: ${evaluacion.nombreEv}`
            );
        }
        
        for (const profesor of profesores) {
            await crearNotificacion(
                profesor.id,
                "evaluacion_actualizada",
                "Evaluación Actualizada",
                `Se ha actualizado la evaluación: ${evaluacion.nombreEv}`
            );
        }
    } catch (notifError) {
        console.error("Error al crear notificaciones:", notifError);
    }
    
    res.status(200).json({message: "Evaluacion actualizada exitosamente", data: evaluacion});
    } catch (error) {
        console.error("Error al actualizar la evaluacion:", error);
        res.status(500).json({message: "Error al actualizar la evaluacion"});   
    }
}

export async function deleteEvaluacion(req, res){
    try {
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { id } = req.params;
        const evaluacion = await evaluacionRepository.findOne({where: { id }});
        if(!evaluacion){
            return res.status(404).json({message: "Evaluacion no encontrada"});
        }
        
        await evaluacionRepository.remove(evaluacion);
        res.status(200).json({message: "Evaluacion eliminada exitosamente"});
    } catch (error) {
        console.error("Error al eliminar la evaluacion:", error);
        res.status(500).json({message: "Error al eliminar la evaluacion"});
    }
}

