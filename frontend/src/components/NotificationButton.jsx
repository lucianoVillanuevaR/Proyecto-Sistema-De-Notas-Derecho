import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNotifications } from "@hooks/useNotifications";
import "@styles/NotificationButton.css";

const NotificationButton = () => {
  const navigate = useNavigate();
  const { unreadCount, fetchUnreadCount } = useNotifications();

  useEffect(() => {
    fetchUnreadCount();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const handleClick = () => {
    navigate("/notificaciones");
  };

  return (
    <button className="notification-button" onClick={handleClick} title="Notificaciones">
      <FaBell className="notification-icon" />
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount}</span>
      )}
    </button>
  );
};

export default NotificationButton;
