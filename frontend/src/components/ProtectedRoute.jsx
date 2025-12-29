import { useAuth } from '@context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user } = useAuth();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles) {
        const userRole = user?.rol || user?.role;
        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/home" />;
        }
    }

    return children;
};

export default ProtectedRoute;
