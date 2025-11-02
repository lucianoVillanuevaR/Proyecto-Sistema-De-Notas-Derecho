"use strict";
export const manejarExito = (res, statusCode, message, data = null) => {
  res.status(statusCode).json({
    message,
    data,
    status: "Éxito",
  });
};

export const manejarErrorCliente = (res, statusCode, message, errorDetails = null) => {
  res.status(statusCode).json({
    message,
    errorDetails,
    status: "Error del cliente",
  });
};

export const manejarErrorServidor = (res, statusCode, message, errorDetails = null) => {
  console.error("Error del servidor:", message, errorDetails);
  res.status(statusCode).json({
    message,
    errorDetails,
    status: "Error del servidor",
  });
};