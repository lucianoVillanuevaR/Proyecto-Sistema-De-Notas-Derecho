import { Link } from "react-router-dom";
import justiceSad from "@assets/JusticeSad.png";
import "@styles/error404.css";

const Error404 = () => {
  return (
    <div className="error-container">
      <img src={justiceSad} className="error-image"/>
      <a href="https://http.cat/status/404" className="error-title">Error 404</a>
      <p className="error-description">Te equivocaste de url, revisa las rutas 👀</p>
      <Link to="/home" className="error-link">Volver al inicio</Link>
    </div>
  );
};

export default Error404;
