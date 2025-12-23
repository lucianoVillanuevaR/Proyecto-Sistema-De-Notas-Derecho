import { Outlet } from "react-router-dom";
import "@styles/root.css";
import { AuthProvider } from "@context/AuthContext";
import Sidebar from "../components/Sidebar";
import NotificationButton from "../components/NotificationButton";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Root() {
  return (
    <AuthProvider>
      <PageRoot />
    </AuthProvider>
  );
}

function PageRoot() {
  return (
    <div className="page-root">
      <Sidebar />
      <NotificationButton />
      <div className="page-content">
        <Outlet />
        <footer className="institutional-footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Universidad del Bío-Bío</h3>
              <p>Facultad de Ciencias Jurídicas y Sociales</p>
              <p>Sistema de Gestión de Evaluaciones</p>
            </div>
            
            <div className="footer-section">
              <h4>Contacto</h4>
              <p><FaEnvelope /> contacto@ubiobio.cl</p>
              <p><FaPhone /> +56 42 232 5000</p>
              <p><FaMapMarkerAlt /> Av. Collao 1202, Concepción</p>
            </div>
            
            <div className="footer-section">
              <h4>Enlaces Útiles</h4>
              <a href="https://www.ubiobio.cl" target="_blank" rel="noopener noreferrer">Portal UBB</a>
              <a href="https://intranet.ubiobio.cl" target="_blank" rel="noopener noreferrer">Intranet</a>
              <a href="https://werken.ubiobio.cl" target="_blank" rel="noopener noreferrer">Biblioteca</a>
            </div>
            
            <div className="footer-section">
              <h4>Legal</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Términos y Condiciones:\n\n1. Uso exclusivo para estudiantes y profesores UBB\n2. Los datos son confidenciales\n3. No compartir credenciales de acceso\n4. Reportar errores al administrador'); }}>Términos y Condiciones</a>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Política de Privacidad:\n\nSus datos personales están protegidos según la Ley N°19.628.\nNo compartimos información con terceros.\nLos datos académicos son de uso exclusivo institucional.'); }}>Política de Privacidad</a>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Universidad del Bío-Bío. Todos los derechos reservados.</p>
            <div className="social-links">
              <a href="https://www.facebook.com/ubiobio" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://twitter.com/ubiobio" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://www.instagram.com/ubiobio" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Root;
