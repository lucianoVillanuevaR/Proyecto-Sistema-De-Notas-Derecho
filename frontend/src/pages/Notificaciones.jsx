import { useState, useEffect } from 'react';
import { getMyNotifications, markNotificationRead } from '../services/notification.service.js';
import '@styles/notificaciones.css';

export default function Notificaciones() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyNotifications();
      if (res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      setError('Error al cargar notificaciones');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id) {
    try {
      await markNotificationRead(id);
      setNotifications(prevNotifs =>
        prevNotifs.map(notif =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      setError('Error al marcar como leída');
    }
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'grade': return '📝';
      case 'evaluation': return '📋';
      case 'warning': return '⚠️';
      case 'success': return '✓';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  }

  function getNotificationTypeClass(type) {
    switch (type) {
      case 'grade': return 'grade';
      case 'evaluation': return 'evaluation';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'info': return 'info';
      default: return 'default';
    }
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-card">
        <div className="notifications-header">
          <div>
            <h1 className="notifications-title">Notificaciones</h1>
            <p className="notifications-subtitle">
              {unreadCount > 0 
                ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? 'es' : ''} sin leer`
                : 'No tienes notificaciones sin leer'
              }
            </p>
          </div>
          <button onClick={loadNotifications} className="btn-refresh" disabled={loading}>
            🔄 Actualizar
          </button>
        </div>

        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todas ({notifications.length})
          </button>
          <button 
            className={`filter-tab ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            Sin leer ({unreadCount})
          </button>
          <button 
            className={`filter-tab ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            Leídas ({notifications.length - unreadCount})
          </button>
        </div>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Cargando notificaciones...</p>
          </div>
        )}

        {!loading && filteredNotifications.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">
              {filter === 'all' && 'No tienes notificaciones'}
              {filter === 'unread' && 'No tienes notificaciones sin leer'}
              {filter === 'read' && 'No tienes notificaciones leídas'}
            </p>
          </div>
        )}

        {!loading && filteredNotifications.length > 0 && (
          <div className="notifications-list">
            {filteredNotifications.map(notif => (
              <div 
                key={notif.id} 
                className={`notification-item ${!notif.read ? 'unread' : ''} ${getNotificationTypeClass(notif.type)}`}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title-row">
                    <h3 className="notification-title">{notif.title || 'Notificación'}</h3>
                    {!notif.read && (
                      <button 
                        className="btn-mark-read"
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Marcar como leída"
                      >
                        ✓
                      </button>
                    )}
                  </div>
                  <p className="notification-message">{notif.message || 'Sin mensaje'}</p>
                  <div className="notification-footer">
                    <span className="notification-date">
                      {notif.created_at 
                        ? new Date(notif.created_at).toLocaleString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'Fecha desconocida'
                      }
                    </span>
                    {notif.read && (
                      <span className="notification-read-badge">Leída</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
