"use strict";
import evaluacion from "../entitys/evaluacion.entity.js";
import { AppDataSource } from "../config/configDb.js";
import { createvalidation, updatevalidation } from "../validations/evaluacion.validation.js";

export async function getEvaluaciones(req, res){
    try {
        const evaluacionesRepository = AppDataSource.getRepository(evaluacion);

        const evaluaciones = await evaluacionesRepository.find();

        res.status(200).json(({message: "Evaluaciones obtenidas exitosamente",data: evaluaciones}));
    } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
        res.status(500).json({message: "Error al obtener las evaluaciones", error: error.message});
    }
}

export async function getEvaluacionById(req, res){
    try {
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
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
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
        const { nombreEv, asignatura1, profesor, nota } = req.body;
        const { error } = createvalidation.validate(req.body);
        if(error){
            return res.status(400).json({message: "Error al crear la evaluacion", error: error});
        }

        const nuevaEvaluacion = evaluacionRepository.create({
            nombreEv,
            asignatura1,
            profesor,
            nota
        });
        await evaluacionRepository.save(nuevaEvaluacion);
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
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
        const { id } = req.params;
        const { nombreEv, asignatura1, profesor, nota } = req.body;

        const ayudantia = await evaluacionRepository.findOne({where: { id }});
        if(!ayudantia){
            return res.status(404).json({message: "Evaluacion no encontrada"});
        }
        const { error } = updatevalidation.validate(req.body);
        if(error){
            return res.status(400).json({message: "Error al actualizar la evaluacion", error: error});
        }

        evaluacion.nombreEv = nombreEv || evaluacion.nombreEv;
        evaluacion.asignatura1 = asignatura1 || evaluacion.asignatura1;
        evaluacion.profesor = profesor || evaluacion.profesor;
        evaluacion.nota = nota !== undefined ? nota : evaluacion.nota;

        await evaluacionRepository.save(evaluacion);
        res.status(200).json({message: "Evaluacion actualizada exitosamente", data: evaluacion});
    } catch (error) {
        console.error("Error al actualizar la evaluacion:", error);
        res.status(500).json({message: "Error al actualizar la evaluacion"});   
    }
}

export async function deleteEvaluacion(req, res){
    try {
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
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
