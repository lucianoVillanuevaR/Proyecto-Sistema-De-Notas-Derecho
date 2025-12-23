import axios from '@services/root.service';

export const getEvaluaciones = async () => {
    try {
        const response = await axios.get('/evaluaciones');
        return response.data.data;
    } catch (error) {
        console.error("Error consiguiendo las evaluaciones:", error);
        throw error;
    }
}

export async function deleteEvaluacion(evaluacionId){
    try {
        const response = await axios.delete(`/evaluaciones/${evaluacionId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la evaluación:', error);
        throw error;
    }
}

export async function editEvaluacion(evaluacionId, evaluacionData) {
    try {
        const response = await axios.put(`/evaluaciones/${evaluacionId}`, evaluacionData);
        return response.data;
    } catch (error) {
        console.error("Error editando la evaluación:", error);
        throw error;
    }
}

export const createEvaluacion = async (evaluacionData) => {
    try {
        const response = await axios.post('/evaluaciones', evaluacionData);
        return response.data;
    } catch (error) {
        console.error("Error creando la evaluación:", error);
        throw error;
    }
}

export const getEvaluacionById = async (evaluacionId) => {
    try {
        const response = await axios.get(`/evaluaciones/${evaluacionId}`);
        return response.data.data;
    } catch (error) {
        console.error("Error obteniendo la evaluación:", error);
        throw error;
    }
}
