"use strict";
import joi from "joi";

export const createvalidation = joi.object({
  nombreEv: joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ\s]+$/)
    .messages({
      "string.pattern.base": "El nombre de la evaluación solo puede contener letras, números y espacios",
      "string.min": "El nombre de la evaluación debe tener al menos 3 caracteres",
      "string.max": "El nombre de la evaluación debe tener como máximo 30 caracteres",
      "string.empty": "El nombre de la evaluación es un campo obligatorio",
    }),
  asignatura1: joi.string()
    .min(3)
    .max(30)
    .required()
    .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .messages({
      "string.pattern.base": "La asignatura solo puede contener letras y espacios",
      "string.min": "La asignatura debe tener al menos 3 caracteres",
      "string.max": "La asignatura debe tener como máximo 30 caracteres",
      "string.empty": "La asignatura es un campo obligatorio",
    }),
  ponderacion: joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      "number.base": "La ponderacion debe ser un número",
      "number.min": "La ponderacion no puede ser menor a 0",
      "number.max": "La ponderacion no puede ser mayor a 100"
    })
  ,
  tipoEv: joi.string()
    .valid('oral', 'escrita')
    .required()
    .messages({
      'any.only': "El tipo de evaluación debe ser 'oral' o 'escrita'",
      'string.base': 'El tipo de evaluación debe ser un texto',
      'string.empty': 'El tipo de evaluación es obligatorio',
    })
});
export const updatevalidation = joi.object({
  nombreEv: joi.string()
    .min(3)
    .max(30)
    .optional()
    .pattern(/^[A-Za-z0-9À-ÖØ-öø-ÿ\s]+$/)
    .messages({
      "string.pattern.base": "El nombre de la evaluación solo puede contener letras, números y espacios",
      "string.min": "El nombre de la evaluación debe tener al menos 3 caracteres",
      "string.max": "El nombre de la evaluación debe tener como máximo 30 caracteres",
      "string.empty": "El nombre de la evaluación es un campo obligatorio",
    }),
  asignatura1: joi.string()
    .min(3)
    .max(30)
    .optional()
    .pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/)
    .messages({
      "string.pattern.base": "La asignatura solo puede contener letras y espacios",
      "string.min": "La asignatura debe tener al menos 3 caracteres",
      "string.max": "La asignatura debe tener como máximo 30 caracteres",
      "string.empty": "La asignatura es un campo obligatorio",
    }),
  ponderacion: joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      "number.base": "La ponderacion debe ser un número",
      "number.min": "La ponderacion no puede ser menor a 0",
      "number.max": "La ponderacion no puede ser mayor a 100"
    }),
  tipoEv: joi.string()
    .valid('oral', 'escrita')
    .optional()
    .messages({
      'any.only': "El tipo de evaluación debe ser 'oral' o 'escrita'",
      'string.base': 'El tipo de evaluación debe ser un texto',
    }),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales"
});