import { editEvaluacion } from '@services/evaluacion.service.js';

export const useEditEvaluacion = (fetchEvaluaciones) => {
    const handleEditEvaluacion = async (evaluacionId, evaluacion) => {
        const nombreEv = prompt('Nuevo nombre de evaluación:', evaluacion.nombreEv);
        const asignatura1 = prompt('Nueva asignatura:', evaluacion.asignatura1);
        const ponderacion = prompt('Nueva ponderación (%):', evaluacion.ponderacion);
        const tipoEv = prompt('Tipo de evaluación (oral/escrita):', evaluacion.tipoEv);

        if (nombreEv && asignatura1 && ponderacion && tipoEv) {
            const evaluacionData = {
                nombreEv,
                asignatura1,
                ponderacion: parseInt(ponderacion),
                tipoEv
            };

            try {
                await editEvaluacion(evaluacionId, evaluacionData);
                alert('Evaluación actualizada exitosamente');
                fetchEvaluaciones();
            } catch (error) {
                console.error('Error al actualizar la evaluación:', error);
                alert('Error al actualizar la evaluación');
            }
        }
    };

    return { handleEditEvaluacion };
};

export default useEditEvaluacion;
