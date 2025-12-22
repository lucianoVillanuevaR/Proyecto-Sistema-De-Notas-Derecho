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
  nota: joi.number()
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
  calificadoPor: joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El id de quien calificó debe ser un número",
      "number.integer": "El id de quien calificó debe ser un número entero",
      "number.positive": "El id de quien calificó debe ser un número positivo",
    }),
  estado: joi.string()
    .valid('pendiente', 'calificado', 'ausente')
    .optional()
    .messages({
      'any.only': "El estado debe ser 'pendiente', 'calificado' o 'ausente'",
      'string.base': 'El estado debe ser un texto',
    }),
  comentarios: joi.string()
    .max(1000)
    .optional()
    .allow('', null)
    .messages({
      "string.base": "Los comentarios deben ser texto",
      "string.max": "Los comentarios no pueden superar los 1000 caracteres",
    }),
});

export const updatevalidation = joi.object({
  estudianteId: joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El id del estudiante debe ser un número",
      "number.integer": "El id del estudiante debe ser un número entero",
      "number.positive": "El id del estudiante debe ser un número positivo",
    }),
  evaluacionId: joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El id de la evaluación debe ser un número",
      "number.integer": "El id de la evaluación debe ser un número entero",
      "number.positive": "El id de la evaluación debe ser un número positivo",
    }),
  asistio: joi.boolean()
    .optional()
    .messages({
      "boolean.base": "El campo 'asistio' debe ser verdadero o falso",
    }),
  nota: joi.number()
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
  calificadoPor: joi.number()
    .integer()
    .positive()
    .optional()
    .messages({
      "number.base": "El id de quien calificó debe ser un número",
      "number.integer": "El id de quien calificó debe ser un número entero",
      "number.positive": "El id de quien calificó debe ser un número positivo",
    }),
  estado: joi.string()
    .valid('pendiente', 'calificado', 'ausente')
    .optional()
    .messages({
      'any.only': "El estado debe ser 'pendiente', 'calificado' o 'ausente'",
      'string.base': 'El estado debe ser un texto',
    }),
  comentarios: joi.string()
    .max(1000)
    .optional()
    .allow('', null)
    .messages({
      "string.base": "Los comentarios deben ser texto",
      "string.max": "Los comentarios no pueden superar los 1000 caracteres",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales"
});
