import { AppDataSource } from "../config/configDb.js";
import { Notification } from "../entities/notification.entity.js";

const repo = () => AppDataSource.getRepository(Notification);

export async function crearNotificacion(userId, tipo, titulo, mensaje, data = null) {
  try {
    const notificacion = repo().create({
      userId: Number(userId),
      type: tipo,
      title: titulo,
      message: mensaje,
      data: data ? JSON.stringify(data) : null,
      read: false,
    });
    const saved = await repo().save(notificacion);
    try {
      console.log(`Notificación creada: id=${saved.id} userId=${saved.userId} type=${saved.type}`);
    } catch (e) {
      // ignore logging errors
    }
    return saved;
  } catch (error) {
    console.error("Error creando notificación en DB:", error.message || error);
    throw error;
  }
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
