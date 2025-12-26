import { useEffect, useState } from 'react';
import { createAppeal, getAppealableGrades } from '../services/appeal.service';
import { useNavigate } from 'react-router-dom';

export default function CreateAppeal() {
  const [grades, setGrades] = useState([]);
  const [gradeId, setGradeId] = useState('');
  const [reason, setReason] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAppealableGrades().then(setGrades);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await createAppeal({ gradeId, reason });
    navigate('/apelaciones');
  }

  return (
    <div>
      <h1>Crear Apelación</h1>

      <form onSubmit={handleSubmit}>
        <label>Nota</label>
        <select value={gradeId} onChange={e => setGradeId(e.target.value)}>
          <option value="">Seleccione una nota</option>
          {grades.map(g => (
            <option key={g.id} value={g.id}>
              Nota #{g.id} – Profesor {g.professorId}
            </option>
          ))}
        </select>

        <label>Razón</label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
        />

        <button type="submit">Enviar apelación</button>
      </form>
    </div>
  );
}
