import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaHome, FaUsers, FaSignOutAlt, FaClipboardList, FaGraduationCap, FaBell, FaFileAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "@styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol;

  const logoutSubmit = () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    }
  };

  return (
    <div className="sidebar">
      <h2>Gestión de Evaluaciones de Derecho</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon"/> Inicio
            </NavLink>
          </li>
          {userRole === "administrador" && (
            <li>
              <NavLink to="/users">
                <FaUsers className="icon"/> Usuarios
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/evaluaciones">
              <FaClipboardList className="icon"/> Gestionar Evaluaciones
            </NavLink>
          </li>
          <li>
            <NavLink to="/reportes">
              <FaFileAlt className="icon"/> Solicitar Reporte
            </NavLink>
          </li>
          <li>
            <NavLink to="/calificaciones">
              <FaGraduationCap className="icon"/> Gestionar Notas
            </NavLink>
          </li>
          <li>
            <NavLink to="/notificaciones">
              <FaBell className="icon"/> Notificaciones
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <CgProfile className="icon"/> Perfil
            </NavLink>
          </li>
          <li style={{ height: "70%" }}/>
          <li className="logout">
            <NavLink to="/login" onClick={logoutSubmit}>
              <FaSignOutAlt className="icon"/> Cerrar Sesión
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
