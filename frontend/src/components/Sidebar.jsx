import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "@services/auth.service.js";
import { FaHome, FaUsers, FaSignOutAlt, FaClipboardList, FaGraduationCap, FaBell, FaFileAlt, FaUserPlus } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "@styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("usuario")) || "";
  const userRole = user?.rol || user?.role;
  const isAdmin = userRole === "administrador" || userRole === "admin";
  const isProfesor = userRole === "profesor" || userRole === "prof";
  const canViewGrades = isAdmin || isProfesor;

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
      <h2>Sistema de Gestión de Evaluaciones de Derecho</h2>
      <nav>
        <ul>
          <li>
            <NavLink to="/home">
              <FaHome className="icon"/>
              <span>Inicio</span>
            </NavLink>
          </li>
          {isAdmin && (
            <li>
              <NavLink to="/users">
                <FaUsers className="icon"/>
                <span>Usuarios</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/evaluaciones">
              <FaClipboardList className="icon"/>
              <span>Evaluaciones</span>
            </NavLink>
          </li>
          {canViewGrades && (
            <li>
              <NavLink to="/calificaciones">
                <FaGraduationCap className="icon"/>
                <span>Calificaciones</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/reportes">
              <FaFileAlt className="icon"/>
              <span>Reportes</span>
            </NavLink>
          </li>
          {(isAdmin || isProfesor || userRole === "estudiante" || userRole === "student") && (
            <li>
              <NavLink to="/apelaciones">
                <FaFileAlt className="icon"/>
                <span>Apelaciones</span>
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/register">
                <FaUserPlus className="icon"/>
                <span>Crear Usuario</span>
              </NavLink>
            </li>
          )}
          <li>
            <NavLink to="/profile">
              <CgProfile className="icon"/>
              <span>Perfil</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="logout">
        <NavLink to="/login" onClick={logoutSubmit}>
          <FaSignOutAlt className="icon"/>
          <span>Cerrar Sesión</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
