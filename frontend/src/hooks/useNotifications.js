import { useState, useEffect, useCallback } from 'react';
import { getMyNotifications } from '@services/notification.service';

// Estado global compartido para notificaciones
let globalUnreadCount = 0;
const listeners = new Set();

function notifyListeners() {
  listeners.forEach(listener => listener(globalUnreadCount));
}

export function updateGlobalUnreadCount(count) {
  globalUnreadCount = count;
  notifyListeners();
}

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(globalUnreadCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listener = (count) => setUnreadCount(count);
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyNotifications();
      if (response?.data) {
        const unread = response.data.filter(notif => !notif.read).length;
        updateGlobalUnreadCount(unread);
      }
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    unreadCount,
    loading,
    fetchUnreadCount
  };
}
