"use strict";
import joi from "joi";

// Validación para actualizar notas (sistema de 10 a 70)
export const updateGradeValidation = joi.object({
  score: joi.number()
    .min(10)
    .max(70)
    .integer()
    .optional()
    .messages({
      "number.base": "La nota debe ser un número",
      "number.min": "La nota mínima permitida es 10",
      "number.max": "La nota máxima permitida es 70",
      "number.integer": "La nota debe ser un número entero",
    }),
  observation: joi.string()
    .max(500)
    .optional()
    .allow('', null)
    .messages({
      "string.base": "La observación debe ser texto",
      "string.max": "La observación no puede superar los 500 caracteres",
    }),
  evaluation: joi.string()
    .max(100)
    .optional()
    .messages({
      "string.base": "El nombre de la evaluación debe ser texto",
      "string.max": "El nombre de la evaluación no puede superar los 100 caracteres",
    }),
  type: joi.string()
    .valid('escrita', 'oral', 'taller', 'proyecto', 'examen', 'control', 'parcial', 'final')
    .optional()
    .messages({
      'any.only': "El tipo debe ser uno de: escrita, oral, taller, proyecto, examen, control, parcial, final",
      'string.base': 'El tipo debe ser un texto',
    }),
  source: joi.string()
    .valid('grade', 'asistencia', 'asistenciaEv')
    .optional()
    .messages({
      'any.only': "La fuente debe ser 'grade', 'asistencia' o 'asistenciaEv'",
      'string.base': 'La fuente debe ser un texto',
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales en la actualización de notas"
});

export const createGradeValidation = joi.object({
  studentId: joi.number()
    .required()
    .messages({
      "number.base": "studentId debe ser un número",
      "any.required": "studentId es requerido",
    }),
  evaluacionId: joi.number()
    .optional()
    .allow(null)
    .messages({
      "number.base": "evaluacionId debe ser un número",
    }),
  score: joi.number()
    .min(10)
    .max(70)
    .integer()
    .optional()
    .allow(null)
    .messages({
      "number.base": "La nota debe ser un número",
      "number.min": "La nota mínima permitida es 10",
      "number.max": "La nota máxima permitida es 70",
      "number.integer": "La nota debe ser un número entero",
    }),
  observation: joi.string()
    .max(500)
    .optional()
    .allow('', null)
    .messages({
      "string.base": "La observación debe ser texto",
      "string.max": "La observación no puede superar los 500 caracteres",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales al crear una nota"
});

// Validación para el promedio (también de 10 a 70)
export const averageValidation = joi.number()
  .min(10)
  .max(70)
  .precision(2)
  .messages({
    "number.base": "El promedio debe ser un número",
    "number.min": "El promedio mínimo permitido es 10",
    "number.max": "El promedio máximo permitido es 70",
    "number.precision": "El promedio debe tener máximo 2 decimales",
  });
