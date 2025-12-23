"use strict";
import joi from "joi";

export const createvalidation = joi.object({
  estudianteId: joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id del estudiante debe ser un número",
      "number.integer": "El id del estudiante debe ser un número entero",
      "number.positive": "El id del estudiante debe ser un número positivo",
      "any.required": "El id del estudiante es obligatorio",
    }),
  evaluacionId: joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El id de la evaluación debe ser un número",
      "number.integer": "El id de la evaluación debe ser un número entero",
      "number.positive": "El id de la evaluación debe ser un número positivo",
      "any.required": "El id de la evaluación es obligatorio",
    }),
  asistio: joi.boolean()
    .optional()
    .messages({
      "boolean.base": "El campo 'asistio' debe ser verdadero o falso",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales en la creación de asistencia"
});
 
