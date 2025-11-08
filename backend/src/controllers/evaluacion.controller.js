"use strict";
<<<<<<< HEAD
import evaluacion from "../entities/evaluacion.entity.js";
=======
import Evaluacion from "../entities/evaluacion.entity.js";
>>>>>>> d7e589a (add funciones y arreglo de codigo)
import { AppDataSource } from "../config/configDb.js";
import { createvalidation, updatevalidation } from "../validations/evaluacion.validation.js";

export async function getEvaluaciones(req, res){
    try {
<<<<<<< HEAD
        const evaluacionesRepository = AppDataSource.getRepository(evaluacion);
=======
    const evaluacionesRepository = AppDataSource.getRepository(Evaluacion);
>>>>>>> d7e589a (add funciones y arreglo de codigo)

        const evaluaciones = await evaluacionesRepository.find();

        res.status(200).json(({message: "Evaluaciones obtenidas exitosamente",data: evaluaciones}));
    } catch (error) {
        console.error("Error al obtener las evaluaciones:", error);
        res.status(500).json({message: "Error al obtener las evaluaciones", error: error.message});
    }
}

export async function getEvaluacionById(req, res){
    try {
<<<<<<< HEAD
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
        const { id } = req.params;

        const evaluacion = await evaluacionRepository.findOne({where: { id }});
=======
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { id } = req.params;

    const evaluacion = await evaluacionRepository.findOne({where: { id }});
>>>>>>> d7e589a (add funciones y arreglo de codigo)

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
<<<<<<< HEAD
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
        const { nombreEv, asignatura1, profesor, nota } = req.body;
=======
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { nombreEv, asignatura1, profesor, ponderacion } = req.body;
>>>>>>> d7e589a (add funciones y arreglo de codigo)
        const { error } = createvalidation.validate(req.body);
        if(error){
            return res.status(400).json({message: "Error al crear la evaluacion", error: error});
        }

        const nuevaEvaluacion = evaluacionRepository.create({
            nombreEv,
            asignatura1,
            profesor,
            ponderacion
        });
<<<<<<< HEAD
=======
        // Validación simple: no permitir mismo nombre de evaluación dentro de la misma asignatura
        const existeMismaAsignatura = await evaluacionRepository.findOne({where: { nombreEv, asignatura1 }});
        if (existeMismaAsignatura) {
            return res.status(400).json({ message: "Ya existe una evaluación con ese nombre en la misma asignatura." });
        }

>>>>>>> d7e589a (add funciones y arreglo de codigo)
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
<<<<<<< HEAD
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
        const { id } = req.params;
        const { nombreEv, asignatura1, profesor, nota } = req.body;

        const ayudantia = await evaluacionRepository.findOne({where: { id }});
        if(!ayudantia){
=======
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
        const { id } = req.params;
        const { nombreEv, asignatura1, profesor, ponderacion } = req.body;

        const evaluacion = await evaluacionRepository.findOne({where: { id }});
        if(!evaluacion){
>>>>>>> d7e589a (add funciones y arreglo de codigo)
            return res.status(404).json({message: "Evaluacion no encontrada"});
        }
        const { error } = updatevalidation.validate(req.body);
        if(error){
            return res.status(400).json({message: "Error al actualizar la evaluacion", error: error});
        }

<<<<<<< HEAD
        evaluacion.nombreEv = nombreEv || evaluacion.nombreEv;
        evaluacion.asignatura1 = asignatura1 || evaluacion.asignatura1;
        evaluacion.profesor = profesor || evaluacion.profesor;
        evaluacion.ponderacion = ponderacion || evaluacion.ponderacion;

        await evaluacionRepository.save(evaluacion);
        res.status(200).json({message: "Evaluacion actualizada exitosamente", data: evaluacion});
=======
        // Si se cambia nombreEv o asignatura1, validar que no exista otra evaluacion
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

    await evaluacionRepository.save(evaluacion);
    res.status(200).json({message: "Evaluacion actualizada exitosamente", data: evaluacion});
>>>>>>> d7e589a (add funciones y arreglo de codigo)
    } catch (error) {
        console.error("Error al actualizar la evaluacion:", error);
        res.status(500).json({message: "Error al actualizar la evaluacion"});   
    }
}

export async function deleteEvaluacion(req, res){
    try {
<<<<<<< HEAD
        const evaluacionRepository = AppDataSource.getRepository(evaluacion);
=======
    const evaluacionRepository = AppDataSource.getRepository(Evaluacion);
>>>>>>> d7e589a (add funciones y arreglo de codigo)
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

