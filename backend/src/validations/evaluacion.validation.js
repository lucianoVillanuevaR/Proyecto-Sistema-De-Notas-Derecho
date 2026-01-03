"use strict";
import joi from "joi";

const ASIGNATURAS_VALIDAS = [
    "Derecho Romano",
    "Introduccion al Derecho",
    "Institucional I",
    "Microeconomia",
    "Formacion Integral Oferta Institucional",
    "Formacion Integral Actividades Extra Programaticas",
    "Derecho y Sociedad",
    "Derecho Internacional Publico y de los Derechos Humanos",
    "Habilidades Juridicas Basicas",
    "Macroeconomia",
    "Ingles Comunicacional I",
    "Persona y Teoria del Acto Juridico",
    "Administracion y Contabilidad",
    "Bases y Organos Constitucionales",
    "Derecho Procesal Organico",
    "Ingles Comunicacional II",
    "Derechos Reales y Obligaciones",
    "Taller de Integracion Juridica",
    "Derechos y Garantias Constitucionales",
    "Normas Comunes a Todo Procedimiento y Prueba",
    "Teoria General del Derecho Laboral y Contrato Individual de Trabajo",
    "Ingles Comunicacional III",
    "Efectos de las Obligaciones y Responsabilidad Civil",
    "Teoria del Delito y Derecho Penal Parte General",
    "Actos y Procedimiento Administrativo",
    "Procedimiento Ordinario y Recursos Procesales",
    "Derecho Laboral Colectivo y Procedimiento Laboral",
    "Ingles Comunicacional IV",
    "Contratos",
    "Derecho Penal Parte Especial",
    "Contratacion Administrativa y Funcion Publica",
    "Procedimiento Ejecutivo y Especiales Contratacion Administrativa y Funcion Publica",
    "Practica Juridica",
    "Derecho de Familia",
    "Estructura de la Obligacion Tributaria",
    "Acto de Comercio y Derecho Societario",
    "Derecho Procesal Penal",
    "Informatica Juridica",
    "Negociacion",
    "Derecho Sucesorio",
    "Parte especial: IVA y Renta",
    "Sociedad Anonima y Titulos de Credito",
    "Curso de Profundizacion I",
    "Derecho Informatico",
    "Litigacion",
    "Derecho Internacional Privado",
    "Curso de Profundizacion II",
    "Clinica Juridica",
    "Litigacion Especializada",
    "Seminario de Licenciatura",
    "Curso de Profundizacion III",
    "Curso de Profundizacion IV"
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
