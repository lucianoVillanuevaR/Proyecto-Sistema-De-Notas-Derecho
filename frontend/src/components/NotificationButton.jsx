import { useNavigate } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import "@styles/NotificationButton.css";

const NotificationButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/notificaciones");
  };

  return (
    <button className="notification-button" onClick={handleClick} title="Notificaciones">
      <FaBell className="notification-icon" />
      {/* Opcional: agregar badge para contar notificaciones */}
      {/* <span className="notification-badge">3</span> */}
    </button>
  );
};

export default NotificationButton;
