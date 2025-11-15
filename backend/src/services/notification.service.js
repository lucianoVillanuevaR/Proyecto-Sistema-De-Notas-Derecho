import { AppDataSource } from "../config/configDb.js";
import { Notification } from "../entities/notification.entity.js";

const repo = () => AppDataSource.getRepository(Notification);

export async function crearNotificacion(userId, tipo, titulo, mensaje, data = null) {
  const notificacion = repo().create({
    userId: Number(userId),
    type: tipo,
    title: titulo,
    message: mensaje,
    data: data ? JSON.stringify(data) : null,
    read: false,
  });
  return await repo().save(notificacion);
}

export async function obtenerNotificacionesPorUsuario(userId) {
  return await repo().find({ where: { userId: Number(userId) }, order: { created_at: "DESC" } });
}

export async function marcarNotificacionLeida(id) {
  const n = await repo().findOne({ where: { id: Number(id) } });
  if (!n) throw new Error("Notificación no encontrada");
  n.read = true;
  return await repo().save(n);
}
