import { useState } from 'react';
import { marcarAsistencia } from '@services/asistencia.service.js';    

export const useAsistenciaEv = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    
    const marcarPresente = async (evaluacionId) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            setMessage('');
            
            const response = await marcarAsistencia(evaluacionId);
            setSuccess(true);
            setMessage(response.message || "¡Asistencia registrada exitosamente!");
            return response;
        } catch (error) {
            console.error("Error marcando asistencia:", error);
            setError(error.response?.data?.message || "Error al registrar asistencia");
            setMessage(error.response?.data?.message || "Error al registrar asistencia");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
        setMessage('');
    };

    return { 
        marcarPresente, 
        loading, 
        error, 
        success, 
        message,
        resetState 
    };
}

export default useAsistenciaEv;
