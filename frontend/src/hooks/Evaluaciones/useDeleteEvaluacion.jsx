import { deleteEvaluacion } from '@services/evaluacion.service.js';

export const useDeleteEvaluacion = (fetchEvaluaciones) => {
    const handleDeleteEvaluacion = async (evaluacionId) => {
        const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta evaluación?');
        
        if (confirmar) {
            try {
                await deleteEvaluacion(evaluacionId);
                alert('Evaluación eliminada exitosamente');
                fetchEvaluaciones();
            } catch (error) {
                console.error('Error al eliminar la evaluación:', error);
                alert('Error al eliminar la evaluación');
            }
        }
    };

    return { handleDeleteEvaluacion };
};

export default useDeleteEvaluacion;
