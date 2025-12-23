import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreateEvaluacion from '@hooks/Evaluaciones/useCreateEvaluacion.jsx';
import '@styles/CreateEvaluacion.css';

const CreateEvaluacion = () => {
    const navigate = useNavigate();
    const { createNewEvaluacion, loading, error, success, resetState } = useCreateEvaluacion();

    const [formData, setFormData] = useState({
        nombreEv: '',
        asignatura1: '',
        profesor: '',
        ponderacion: '',
        tipoEv: 'escrita'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await createNewEvaluacion({
                ...formData,
                ponderacion: parseInt(formData.ponderacion)
            });
            
            alert('Evaluación creada exitosamente');
            resetState();
            navigate('/evaluaciones');
        } catch (error) {
            console.error('Error al crear evaluación:', error);
            alert(error.response?.data?.message || 'Error al crear la evaluación');
        }
    };

    const handleCancel = () => {
        navigate('/evaluaciones');
    };

    return (
        <div className="create-evaluacion-page">
            <div className="create-evaluacion-container">
                <h2>Crear Nueva Evaluación</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className="success-message">
                        ¡Evaluación creada exitosamente!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="evaluacion-form">
                    <div className="form-group">
                        <label htmlFor="nombreEv">Nombre de la Evaluación *</label>
                        <input
                            type="text"
                            id="nombreEv"
                            name="nombreEv"
                            value={formData.nombreEv}
                            onChange={handleChange}
                            placeholder="Ej: Parcial 1"
                            required
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="asignatura1">Asignatura *</label>
                        <input
                            type="text"
                            id="asignatura1"
                            name="asignatura1"
                            value={formData.asignatura1}
                            onChange={handleChange}
                            placeholder="Ej: Derecho Civil"
                            required
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="profesor">Profesor *</label>
                        <input
                            type="text"
                            id="profesor"
                            name="profesor"
                            value={formData.profesor}
                            onChange={handleChange}
                            placeholder="Ej: Dr. García"
                            required
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="tipoEv">Tipo de Evaluación *</label>
                        <select
                            id="tipoEv"
                            name="tipoEv"
                            value={formData.tipoEv}
                            onChange={handleChange}
                            required
                        >
                            <option value="escrita">Escrita</option>
                            <option value="oral">Oral</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ponderacion">Ponderación (%) *</label>
                        <input
                            type="number"
                            id="ponderacion"
                            name="ponderacion"
                            value={formData.ponderacion}
                            onChange={handleChange}
                            placeholder="Ej: 30"
                            required
                            min="0"
                            max="100"
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn-cancel" 
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="btn-submit"
                            disabled={loading}
                        >
                            {loading ? 'Creando...' : 'Crear Evaluación'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateEvaluacion;
