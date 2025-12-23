"use strict";
import joi from "joi";

const maxMeetingDate = new Date();
maxMeetingDate.setDate(maxMeetingDate.getDate() + 30);

export const createAppealValidation = joi.object({
  gradeId: joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "El ID de la calificación debe ser un número",
      "number.integer": "El ID de la calificación debe ser un número entero",
      "number.positive": "El ID de la calificación debe ser positivo",
      "any.required": "El ID de la calificación es obligatorio",
    }),

  reason: joi.string()
    .min(5)
    .max(1000)
    .required()
    .messages({
      "string.base": "La razón debe ser texto",
      "string.min": "La razón debe tener al menos 5 caracteres",
      "string.max": "La razón no puede superar los 1000 caracteres",
      "string.empty": "La razón de la apelación es obligatoria",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales en la apelación",
});


export const updateAppealValidation = joi.object({
  status: joi.string()
    .valid("aceptada", "rechazada")
    .optional()
    .messages({
      "any.only": "El estado debe ser aceptada o rechazada",
      "string.base": "El estado debe ser texto",
    }),

  comment: joi.string()
    .max(1000)
    .optional()
    .allow(null, "")
    .messages({
      "string.base": "El comentario debe ser texto",
      "string.max": "El comentario no puede superar los 1000 caracteres",
    }),

  meetingDate: joi.date()
    .min('now')
    .max(maxMeetingDate)
    .optional()
    .messages({
      "date.base": "La fecha de reunión debe ser válida",
      "date.min": "La fecha de reunión no puede ser en el pasado",
      "date.max": "La fecha de reunión no puede ser superior a 30 días",
    }),
}).unknown(false).messages({
  "object.unknown": "No se permiten campos adicionales en la actualización",
});