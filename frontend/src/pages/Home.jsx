import { useState, useRef, useEffect } from "react";
import { FaHome, FaCalendarAlt, FaEnvelope, FaUniversity, FaGlobe, FaBook, FaBuilding, FaGraduationCap } from "react-icons/fa";
import { getAppeals } from "@services/appeal.service.js";
import ubbLogo from "@assets/Escudo_Universidad_del_Bío-Bío.png";
import "@styles/home.css";

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userEmail = user?.email || user?.correo || "correo@ejemplo.com";
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showMalla, setShowMalla] = useState(false);
  const mallaRef = useRef(null);

  const [meetingsMap, setMeetingsMap] = useState({});

  useEffect(() => {
    // Cargar apelaciones y mapear por fecha (YYYY-MM-DD)
    const loadMeetings = async () => {
      try {
        const data = await getAppeals();
        if (!Array.isArray(data)) return;
        const map = {};
        data.forEach(ap => {
          if (!ap.meetingDate) return;
          // Ignorar citas en apelaciones rechazadas
          if (ap.status === 'rechazada') return;
          const d = new Date(ap.meetingDate);
          if (isNaN(d.getTime())) return;
          const key = d.toISOString().slice(0,10); // YYYY-MM-DD
          if (!map[key]) map[key] = [];
          // Intentar extraer información de estudiante y nota de forma robusta
          const studentId = ap.studentId || ap.student?.id || ap.student?.studentId || '';
          const studentName = ap.student?.name || ap.student?.nombre || '';
          const gradeId = ap.gradeId || ap.grade?.id || ap.gradeId || '';
          const gradeLabel = ap.grade?.evaluation || ap.grade?.name || (ap.grade?.score ? `Nota ${ap.grade.score}` : '') || '';

          map[key].push({
            id: ap.id,
            time: d.toISOString().slice(11,16),
            reason: ap.reason || '',
            status: ap.status,
            studentId,
            studentName,
            gradeId,
            gradeLabel
          });
        });
        setMeetingsMap(map);
      } catch (err) {
        console.error('Error al cargar citas de apelaciones', err);
      }
    };

    loadMeetings();
  }, []);

  const mallaCurricular = {
    "Año 1": {
      "I SEMESTRE": [
        "Derecho Romano",
        "Introducción al Derecho",
        "Institucional I",
        "Microeconomía",
        "Formación Integral Oferta Institucional",
        "Formación Integral Actividades Extra Programáticas"
      ],
      "II SEMESTRE": [
        "Derecho y Sociedad",
        "Derecho Internacional Público y de los Derechos Humanos",
        "Habilidades Jurídicas Básicas",
        "Macroeconomía",
        "Formación Integral Oferta Institucional",
        "Inglés Comunicacional I"
      ]
    },
    "Año 2": {
      "III SEMESTRE": [
        "Persona y Teoría del Acto Jurídico",
        "Administración y Contabilidad",
        "Bases y Órganos Constitucionales",
        "Derecho Procesal Orgánico",
        "Formación Integral Oferta Institucional",
        "Inglés Comunicacional II"
      ],
      "IV SEMESTRE": [
        "Derechos Reales y Obligaciones",
        "Taller de Integración Jurídica",
        "Derechos y Garantías Constitucionales",
        "Normas Comunes a Todo Procedimiento y Prueba",
        "Teoría General del Derecho Laboral y Contrato Individual de Trabajo",
        "Inglés Comunicacional III"
      ]
    },
    "Año 3": {
      "V SEMESTRE": [
        "Efectos de las Obligaciones y Responsabilidad Civil",
        "Teoría del Delito y Derecho Penal Parte General",
        "Actos y Procedimiento Administrativo",
        "Procedimiento Ordinario y Recursos Procesales",
        "Derecho Laboral Colectivo y Procedimiento Laboral",
        "Inglés Comunicacional IV"
      ],
      "VI SEMESTRE": [
        "Contratos",
        "Derecho Penal Parte Especial",
        "Contratación Administrativa y Función Pública",
        "Procedimiento Ejecutivo y Especiales Contratación Administrativa y Función Pública",
        "Práctica Jurídica",
        "Formación Integral Actividades Extra Programáticas"
      ]
    },
    "Año 4": {
      "VII SEMESTRE": [
        "Derecho de Familia",
        "Estructura de la Obligación Tributaria",
        "Acto de Comercio y Derecho Societario",
        "Derecho Procesal Penal",
        "Informática Jurídica",
        "Negociación"
      ],
      "VIII SEMESTRE": [
        "Derecho Sucesorio",
        "Parte especial: IVA y Renta",
        "Sociedad Anónima y Títulos de Crédito",
        "Curso de Profundización I",
        "Derecho Informático",
        "Litigación"
      ]
    },
    "Año 5": {
      "IX SEMESTRE": [
        "Derecho Internacional Privado",
        "Curso de Profundización II",
        "Clínica Jurídica",
        "Litigación Especializada"
      ],
      "X SEMESTRE": [
        "Seminario de Licenciatura",
        "Curso de Profundización III",
        "Curso de Profundización IV"
      ]
    }
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isSelected = 
        day === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();
      
      const isToday = 
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
      const meetingsForDay = meetingsMap[dateKey] || [];
      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          <div className="calendar-day-number">{day}</div>
          {meetingsForDay.length > 0 && (
            <div className="meeting-dot" title={`${meetingsForDay.length} cita(s)`}></div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <img src={ubbLogo} alt="Universidad del Bío-Bío" className="ubb-logo" />
        <div className="welcome-section">
          <h1>Bienvenido al Sistema de Gestión de Notas</h1>
          <p className="welcome-user">{userEmail}</p>
          <FaHome className="home-icon" />
        </div>
      </div>

      <div className="home-content">
        <div className="quick-links">
          <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="quick-link-btn">
            <FaEnvelope className="link-icon" />
            <span>Ir Gmail</span>
          </a>
          <a href="https://www.ubiobio.cl" target="_blank" rel="noopener noreferrer" className="quick-link-btn">
            <FaUniversity className="link-icon" />
            <span>UBB</span>
          </a>
          <a href="https://intranet.ubiobio.cl/af2dfcd8f214b3412679f1713ae5046b/intranet/" target="_blank" rel="noopener noreferrer" className="quick-link-btn">
            <FaGlobe className="link-icon" />
            <span>Intranet UBB</span>
          </a>
          <a href="https://werken.ubiobio.cl/" target="_blank" rel="noopener noreferrer" className="quick-link-btn">
            <FaBook className="link-icon" />
            <span>Biblioteca Virtual</span>
          </a>
          <a href="https://www.ubiobio.cl/oficinavirtual/" target="_blank" rel="noopener noreferrer" className="quick-link-btn">
            <FaBuilding className="link-icon" />
            <span>Oficina Virtual</span>
          </a>
          <button onClick={() => {
            setShowMalla(!showMalla);
            setTimeout(() => {
              if (!showMalla && mallaRef.current) {
                mallaRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }} className="quick-link-btn">
            <FaGraduationCap className="link-icon" />
            <span>Malla Curricular</span>
          </button>
        </div>

        <div className="calendar-container">
          <div className="calendar-card">
            <div className="calendar-header">
              <button onClick={previousMonth} className="calendar-nav-btn">‹</button>
              <div className="calendar-title">
                <FaCalendarAlt className="calendar-icon" />
                <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              </div>
              <button onClick={nextMonth} className="calendar-nav-btn">›</button>
            </div>
            
            <div className="calendar-grid">
              {dayNames.map(day => (
                <div key={day} className="calendar-day-name">{day}</div>
              ))}
              {renderCalendar()}
            </div>

            {/* Detalle de citas para la fecha seleccionada */}
            <div className="meetings-list">
              <h4>Citas para {selectedDate.toLocaleDateString()}</h4>
              {(() => {
                const key = selectedDate.toISOString().slice(0,10);
                const items = meetingsMap[key] || [];
                if (items.length === 0) return <p>No hay citas para esta fecha.</p>;
                return (
                  <ul>
                    {items.map(m => (
                      <li key={m.id} className="meeting-item">
                        <div className="meeting-top"><span className="meeting-time-label">Hora:</span> <span className="meeting-value">{m.time}</span></div>
                        <div className="meeting-bottom">
                          <div>Alumno ID: <span className="meeting-value">{m.studentId || 'N/A'}</span> {m.studentName ? <span className="muted">({m.studentName})</span> : null}</div>
                          <div>Calificación ID: <span className="meeting-value">{m.gradeId || 'N/A'}</span> {m.gradeLabel ? <span className="muted">({m.gradeLabel})</span> : null}</div>
                          <div>Motivo: {m.reason || 'Sin motivo'}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      {showMalla && (
        <div className="malla-section" ref={mallaRef}>
          <div className="malla-container">
            <h2 className="malla-title">ASIGNATURAS - CARRERA DE DERECHO</h2>
            <div className="malla-grid">
              {Object.entries(mallaCurricular).map(([year, semesters]) => (
                <div key={year} className="year-column">
                  <h3 className="year-header">{year}</h3>
                  {Object.entries(semesters).map(([semester, subjects]) => (
                    <div key={semester} className="semester-block">
                      <h4 className="semester-header">{semester}</h4>
                      <ul className="subjects-list">
                        {subjects.map((subject, idx) => (
                          <li key={idx} className="subject-item">{subject}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
