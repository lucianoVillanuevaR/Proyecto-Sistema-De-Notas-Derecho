import { useState } from 'react';
import { getEvaluaciones } from '@services/evaluacion.service.js';

export const useGetEvaluaciones = () => {
    const [evaluaciones, setEvaluaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchEvaluaciones = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getEvaluaciones();
            setEvaluaciones(data || []);
        } catch (error) {
            console.error("Error obteniendo evaluaciones:", error);
            setError(error.response?.data?.message || "Error al obtener las evaluaciones");
        } finally {
            setLoading(false);
        }
    };

    return {
        evaluaciones,
        loading,
        error,
        fetchEvaluaciones
    };
};

export default useGetEvaluaciones;
