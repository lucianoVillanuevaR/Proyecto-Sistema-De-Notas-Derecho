import { useState } from 'react';
import { createEvaluacion } from '@services/evaluacion.service.js';    

export const useCreateEvaluacion = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    const createNewEvaluacion = async (evaluacionData) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);
            
            const data = await createEvaluacion(evaluacionData);
            setSuccess(true);
            return data;
        } catch (error) {
            console.error("Error creando la evaluación:", error);
            setError(error.response?.data?.message || "Error al crear la evaluación");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const resetState = () => {
        setError(null);
        setSuccess(false);
        setLoading(false);
    };

    return { 
        createNewEvaluacion, 
        loading, 
        error, 
        success, 
        resetState 
    };
}

export default useCreateEvaluacion;
