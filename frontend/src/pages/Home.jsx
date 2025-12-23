import { useState } from "react";
import { FaHome, FaCalendarAlt, FaEnvelope, FaUniversity, FaGlobe } from "react-icons/fa";
import "@styles/home.css";

const Home = () => {
  const user = JSON.parse(sessionStorage.getItem("usuario")) || {};
  const userEmail = user?.email || user?.correo || "correo@ejemplo.com";
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

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

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="home-container">
      <div className="home-header">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
