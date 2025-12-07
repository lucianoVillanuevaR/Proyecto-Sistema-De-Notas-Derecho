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

  useEffect(() => {
    cargarEvaluaciones();
  }, []);

  const cargarEvaluaciones = async () => {
    try {
      setLoading(true);
      const data = await getEvaluaciones();
      
      // Cargar el estado de "ya presente" del localStorage
      const presentesGuardados = JSON.parse(localStorage.getItem('presentesRegistrados')) || {};
      
      const evaluacionesConEstado = data.map(evaluacion => ({
        ...evaluacion,
        yaPresente: presentesGuardados[evaluacion.id] || false
      }));
      
      setEvaluaciones(evaluacionesConEstado || []);
    } catch (error) {
      console.error("Error cargando evaluaciones:", error);
      Swal.fire("Error", "No se pudieron cargar las evaluaciones", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (id) => {
    const evaluacion = evaluaciones.find((e) => e.id === id);
    
    Swal.fire({
      title: "Editar Evaluación",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${evaluacion.nombreEv || evaluacion.nombre || ''}">
        <input id="asignatura" class="swal2-input" placeholder="Asignatura" value="${evaluacion.asignatura1 || evaluacion.asignatura || ''}">
        <input id="profesor" class="swal2-input" placeholder="Profesor" value="${evaluacion.profesor || ''}">
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
          profesor: document.getElementById("profesor").value,
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
          
          // Guardar en localStorage que ya marcó presente
          const presentesGuardados = JSON.parse(localStorage.getItem('presentesRegistrados')) || {};
          presentesGuardados[evaluacionId] = true;
          localStorage.setItem('presentesRegistrados', JSON.stringify(presentesGuardados));
          
          // Marcar la evaluación como presente en el estado local
          setEvaluaciones(evaluaciones.map(e => 
            e.id === evaluacionId ? { ...e, yaPresente: true } : e
          ));
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
    Swal.fire({
      title: "Crear Nueva Evaluación",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre">
        <input id="asignatura" class="swal2-input" placeholder="Asignatura">
        <input id="profesor" class="swal2-input" placeholder="Profesor">
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
        const profesor = document.getElementById("profesor").value;
        const tipo = document.getElementById("tipo").value;
        const ponderacion = document.getElementById("ponderacion").value;

        if (!nombre || !asignatura || !profesor || !tipo || !ponderacion) {
          Swal.showValidationMessage("Por favor completa todos los campos");
          return false;
        }

        return {
          nombreEv: nombre,
          asignatura1: asignatura,
          profesor,
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
              <th>Profesor</th>
              <th>Tipo</th>
              <th>Ponderación (%)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {evaluaciones.map((evaluacion) => (
              <tr key={evaluacion.id}>
                <td>{evaluacion.nombreEv || evaluacion.nombre}</td>
                <td>{evaluacion.asignatura1 || evaluacion.asignatura}</td>
                <td>{evaluacion.profesor}</td>
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
      </div>
    </div>
  );
};

export default Evaluaciones;
