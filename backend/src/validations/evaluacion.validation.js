"use strict";
import joi from "joi";

const ASIGNATURAS_VALIDAS = [
  "Derecho Romano",
  "Introducción al Derecho",
  "Institucional I",
  "Microeconomía",
  "Formación Integral Oferta Institucional",
  "Formación Integral Actividades Extra Programáticas",
  "Derecho y Sociedad",
  "Derecho Internacional Público y de los Derechos Humanos",
  "Habilidades Jurídicas Básicas",
  "Macroeconomía",
  "Inglés Comunicacional I",
  "Persona y Teoría del Acto Jurídico",
  "Administración y Contabilidad",
  "Bases y Órganos Constitucionales",
  "Derecho Procesal Orgánico",
  "Inglés Comunicacional II",
  "Derechos Reales y Obligaciones",
  "Taller de Integración Jurídica",
  "Derechos y Garantías Constitucionales",
  "Normas Comunes a Todo Procedimiento y Prueba",
  "Teoría General del Derecho Laboral y Contrato Individual de Trabajo",
  "Inglés Comunicacional III",
  "Efectos de las Obligaciones y Responsabilidad Civil",
  "Teoría del Delito y Derecho Penal Parte General",
  "Actos y Procedimiento Administrativo",
  "Procedimiento Ordinario y Recursos Procesales",
  "Derecho Laboral Colectivo y Procedimiento Laboral",
  "Inglés Comunicacional IV",
  "Contratos",
  "Derecho Penal Parte Especial",
  "Contratación Administrativa y Función Pública",
  "Procedimiento Ejecutivo y Especiales Contratación Administrativa y Función Pública",
  "Práctica Jurídica",
  "Derecho de Familia",
  "Estructura de la Obligación Tributaria",
  "Acto de Comercio y Derecho Societario",
  "Derecho Procesal Penal",
  "Informática Jurídica",
  "Negociación",
  "Derecho Sucesorio",
  "Parte especial: IVA y Renta",
  "Sociedad Anónima y Títulos de Crédito",
  "Curso de Profundización I",
  "Derecho Informático",
  "Litigación",
  "Derecho Internacional Privado",
  "Curso de Profundización II",
  "Clínica Jurídica",
  "Litigación Especializada",
  "Seminario de Licenciatura",
  "Curso de Profundización III",
  "Curso de Profundización IV"
];

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
    .valid(...ASIGNATURAS_VALIDAS)
    .required()
    .messages({
      "any.only": "La asignatura seleccionada no es válida",
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
    .valid(...ASIGNATURAS_VALIDAS)
    .optional()
    .messages({
      "any.only": "La asignatura seleccionada no es válida",
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