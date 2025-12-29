import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "@styles/evaluaciones.css";
import { useAuth } from "@context/AuthContext";
import { getEvaluaciones, createEvaluacion, editEvaluacion, deleteEvaluacion } from "@services/evaluacion.service";
import axios from "@services/root.service";

const Evaluaciones = () => {
  const { user } = useAuth();
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const asignaturas = [
    "Derecho Romano",
    "Introducción al Derecho",
    "Institucional I",
    "Microeconomía",
    "Formación Integral Oferta Institucional",
    "Formación Integral Actividades Extra Programáticas",
    "Derecho y Sociedad",
    "Derecho Internacional Público y de los Derechos Humanos",
    "Habilidades Jurídicas Básicas",
    "Macroeconomía",
    "Inglés Comunicacional I",
    "Persona y Teoría del Acto Jurídico",
    "Administración y Contabilidad",
    "Bases y Órganos Constitucionales",
    "Derecho Procesal Orgánico",
    "Inglés Comunicacional II",
    "Derechos Reales y Obligaciones",
    "Taller de Integración Jurídica",
    "Derechos y Garantías Constitucionales",
    "Normas Comunes a Todo Procedimiento y Prueba",
    "Teoría General del Derecho Laboral y Contrato Individual de Trabajo",
    "Inglés Comunicacional III",
    "Efectos de las Obligaciones y Responsabilidad Civil",
    "Teoría del Delito y Derecho Penal Parte General",
    "Actos y Procedimiento Administrativo",
    "Procedimiento Ordinario y Recursos Procesales",
    "Derecho Laboral Colectivo y Procedimiento Laboral",
    "Inglés Comunicacional IV",
    "Contratos",
    "Derecho Penal Parte Especial",
    "Contratación Administrativa y Función Pública",
    "Procedimiento Ejecutivo y Especiales Contratación Administrativa y Función Pública",
    "Práctica Jurídica",
    "Derecho de Familia",
    "Estructura de la Obligación Tributaria",
    "Acto de Comercio y Derecho Societario",
    "Derecho Procesal Penal",
    "Informática Jurídica",
    "Negociación",
    "Derecho Sucesorio",
    "Parte especial: IVA y Renta",
    "Sociedad Anónima y Títulos de Crédito",
    "Curso de Profundización I",
    "Derecho Informático",
    "Litigación",
    "Derecho Internacional Privado",
    "Curso de Profundización II",
    "Clínica Jurídica",
    "Litigación Especializada",
    "Seminario de Licenciatura",
    "Curso de Profundización III",
    "Curso de Profundización IV"
  ];

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      setLoading(true);
      const data = await getEvaluaciones();
      
      setEvaluaciones(data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error cargando evaluaciones:", error);
      Swal.fire("Error", "No se pudieron cargar las evaluaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    const evaluacion = evaluaciones.find((e) => e.id === id);
    
    const asignaturasOptions = asignaturas.map(asig => 
      `<option value="${asig}" ${(evaluacion.asignatura1 || evaluacion.asignatura) === asig ? "selected" : ""}>${asig}</option>`
    ).join('');
    
    Swal.fire({
      title: "Editar Evaluación",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${evaluacion.nombreEv || evaluacion.nombre || ''}">
        <select id="asignatura" class="swal2-input">
          <option value="">Seleccione asignatura</option>
          ${asignaturasOptions}
        </select>
        <select id="tipo" class="swal2-input">
          <option value="oral" ${(evaluacion.tipoEv || evaluacion.tipo) === "oral" ? "selected" : ""}>Oral</option>
          <option value="escrita" ${(evaluacion.tipoEv || evaluacion.tipo) === "escrita" ? "selected" : ""}>Escrita</option>
        </select>
        <input id="ponderacion" class="swal2-input" placeholder="Ponderación (%)" value="${String(evaluacion.ponderacion || '').replace('%', '')}">
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const ponderacionValue = document.getElementById("ponderacion").value;
        return {
          nombreEv: document.getElementById("nombre").value,
          asignatura1: document.getElementById("asignatura").value,
          tipoEv: document.getElementById("tipo").value,
          ponderacion: parseInt(ponderacionValue) || 0,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await editEvaluacion(id, result.value);
          await cargarEvaluaciones();
          Swal.fire("¡Guardado!", "La evaluación ha sido actualizada.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo actualizar la evaluación", "error");
        }
      }
    });
  };

  const handleEliminar = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteEvaluacion(id);
          await cargarEvaluaciones();
          Swal.fire("¡Eliminado!", "La evaluación ha sido eliminada.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar la evaluación", "error");
        }
      }
    });
  };

  const handleMarcarPresente = async (evaluacionId) => {
    try {
      const result = await Swal.fire({
        title: "Marcar Presente",
        text: "¿Confirmas tu asistencia a esta evaluación?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4caf50",
        confirmButtonText: "Sí, confirmar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const response = await axios.post("/asistencias/marcarAsistencia", {
          evaluacionId: evaluacionId
        });

        if (response.data) {
          Swal.fire("¡Registrado!", "Tu asistencia ha sido registrada correctamente.", "success");
          cargarEvaluaciones();
        }
      }
    } catch (error) {
      console.error("Error al marcar presente:", error);
      if (error.response?.status === 403) {
        Swal.fire("Error", "Los profesores no pueden registrar asistencia", "error");
      } else if (error.response?.data?.message?.includes("ya")) {
        Swal.fire("Ya registrado", "Ya has marcado tu asistencia para esta evaluación", "info");
      } else {
        Swal.fire("Error", "No se pudo registrar la asistencia", "error");
      }
    }
  };

  const handleCrearNueva = () => {
    const asignaturasOptions = asignaturas.map(asig => 
      `<option value="${asig}">${asig}</option>`
    ).join('');
    
    Swal.fire({
      title: "Crear Nueva Evaluación",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre">
        <select id="asignatura" class="swal2-input">
          <option value="">Seleccione asignatura</option>
          ${asignaturasOptions}
        </select>
        <select id="tipo" class="swal2-input">
          <option value="">Seleccione tipo</option>
          <option value="oral">Oral</option>
          <option value="escrita">Escrita</option>
        </select>
        <input id="ponderacion" class="swal2-input" placeholder="Ponderación (%)">
      `,
      showCancelButton: true,
      confirmButtonText: "Crear",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const asignatura = document.getElementById("asignatura").value;
        const tipo = document.getElementById("tipo").value;
        const ponderacion = document.getElementById("ponderacion").value;

        if (!nombre || !asignatura || !tipo || !ponderacion) {
          Swal.showValidationMessage("Por favor completa todos los campos");
          return false;
        }

        return {
          nombreEv: nombre,
          asignatura1: asignatura,
          tipoEv: tipo,
          ponderacion: parseInt(ponderacion) || 0,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await createEvaluacion(result.value);
          await cargarEvaluaciones();
          Swal.fire("¡Creado!", "La evaluación ha sido creada.", "success");
        } catch (error) {
          console.error("Error creando evaluación:", error);
          Swal.fire("Error", "No se pudo crear la evaluación", "error");
        }
      }
    });
  };

  // Paginación
  const totalPages = Math.ceil(evaluaciones.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const evaluacionesPaginadas = evaluaciones.slice(startIndex, endIndex);

  return (
    <div className="evaluaciones-container">
      <div className="evaluaciones-wrapper">
        <div className="evaluaciones-header">
          <h1>Lista de Evaluaciones</h1>
          {user?.role !== 'estudiante' && (
            <button className="btn-crear" onClick={handleCrearNueva}>
              + Crear Nueva Evaluación
            </button>
          )}
        </div>

        <div className="evaluaciones-table">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Cargando evaluaciones...</p>
            </div>
          ) : evaluaciones.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No hay evaluaciones registradas</p>
            </div>
          ) : (
          <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Asignatura</th>
              <th>Tipo</th>
              <th>Ponderación (%)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluacionesPaginadas.map((evaluacion) => (
              <tr key={evaluacion.id}>
                <td>{evaluacion.nombreEv || evaluacion.nombre}</td>
                <td>{evaluacion.asignatura1 || evaluacion.asignatura}</td>
                <td>{evaluacion.tipoEv || evaluacion.tipo}</td>
                <td>{evaluacion.ponderacion}{typeof evaluacion.ponderacion === 'number' ? '%' : ''}</td>
                <td className="acciones">
                  {user?.role !== 'estudiante' && (
                    <>
                      <button
                        className="btn-editar"
                        onClick={() => handleEditar(evaluacion.id)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleEliminar(evaluacion.id)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  {user?.role === 'estudiante' && (
                    <button
                      className="btn-presente"
                      onClick={() => handleMarcarPresente(evaluacion.id)}
                      disabled={evaluacion.yaPresente}
                      style={evaluacion.yaPresente ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                      {evaluacion.yaPresente ? '✓ Ya Presente' : 'Marcar Presente'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
                )}
      </div>
      
      {!loading && evaluaciones.length > 0 && (
        <div className="pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Evaluaciones;
