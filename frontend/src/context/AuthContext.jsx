import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [sessionExpired, setSessionExpired] = useState(false);
    const user = JSON.parse(sessionStorage.getItem('usuario')) || '';
    const isAuthenticated = user ? true : false;
    const lastActivityRef = useRef(Date.now());

    // Verificar sesión cada 5 minutos
    useEffect(() => {
        if (!isAuthenticated) return;

        const checkSession = () => {
            const lastActivity = sessionStorage.getItem('lastActivity');
            if (lastActivity) {
                const now = Date.now();
                const diff = now - parseInt(lastActivity);
                // Sesión expira después de 2 horas (7200000 ms)
                if (diff > 7200000) {
                    sessionStorage.clear();
                    setSessionExpired(true);
                    navigate('/login');
                    alert('⏱️ Tu sesión ha expirado por inactividad.\n\nPor favor, inicia sesión nuevamente.');
                }
            }
        };

        const interval = setInterval(checkSession, 300000); // Cada 5 minutos
        return () => clearInterval(interval);
    }, [isAuthenticated, navigate]);

    // Actualizar última actividad (throttled para mejor performance)
    useEffect(() => {
        if (!isAuthenticated) return;

        const updateActivity = () => {
            const now = Date.now();
            // Solo actualizar si pasó más de 1 minuto desde la última actualización
            if (now - lastActivityRef.current > 60000) {
                sessionStorage.setItem('lastActivity', now.toString());
                lastActivityRef.current = now;
            }
        };

        // Inicializar última actividad
        sessionStorage.setItem('lastActivity', Date.now().toString());
        
        window.addEventListener('click', updateActivity);
        window.addEventListener('keypress', updateActivity);

        return () => {
            window.removeEventListener('click', updateActivity);
            window.removeEventListener('keypress', updateActivity);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/auth' && !location.pathname.startsWith('/register')) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate, location])

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, sessionExpired }}>
            { children }
        </AuthContext.Provider>
    )
}