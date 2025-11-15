import axios from './root.service.js';

export async function getMyNotifications() {
  try {
    const res = await axios.get('/notifications/me');
    return res.data;
  } catch (err) {
    return err.response?.data || { message: 'Error al obtener notificaciones' };
  }
}

export async function markNotificationRead(id) {
  try {
    const res = await axios.post(`/notifications/mark-read/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: 'Error al marcar notificación' };
  }
}
