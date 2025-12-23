import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import justiceSad from "@assets/JusticeSad.png";
import "@styles/error404.css";

const Error404 = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const sugerencias = [
    { name: "Inicio", path: "/home" },
    { name: "Evaluaciones", path: "/evaluaciones" },
    { name: "Calificaciones", path: "/calificaciones" },
    { name: "Mi Perfil", path: "/profile" },
    { name: "Notificaciones", path: "/notificaciones" },
    { name: "Solicitar Informe", path: "/request-report" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const result = sugerencias.find(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (result) {
      navigate(result.path);
    } else {
      alert("No se encontró una página con ese nombre");
    }
  };

  return (
    <div className="error-container">
      <img src={justiceSad} className="error-image"/>
      <a href="https://http.cat/status/404" className="error-title">Error 404</a>
      <p className="error-description">Página no encontrada. La ruta que buscas no existe.</p>
      
      <form onSubmit={handleSearch} className="error-search">
        <input 
          type="text" 
          placeholder="Buscar página..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="error-search-input"
        />
        <button type="submit" className="error-search-btn">Buscar</button>
      </form>

      <div className="error-suggestions">
        <p className="suggestions-title">Páginas disponibles:</p>
        <div className="suggestions-grid">
          {sugerencias.map((sug, idx) => (
            <Link key={idx} to={sug.path} className="suggestion-link">
              {sug.name}
            </Link>
          ))}
        </div>
      </div>
      
      <Link to="/home" className="error-link">Volver al inicio</Link>
    </div>
  );
};

export default Error404;
