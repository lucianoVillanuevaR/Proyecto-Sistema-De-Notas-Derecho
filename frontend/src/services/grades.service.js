import axios from './root.service.js';

export async function updateGrade(id, changes) {
  try {
    console.debug('[grades.service] PATCH /grades/', id, changes);
    const res = await axios.patch(`/grades/${id}`, changes);
    console.debug('[grades.service] response', res);
    return res.data;
  } catch (err) {
    console.error('[grades.service] error', err.response?.data || err);
    throw err.response?.data || err;
  }
}

export async function createGrade(data) {
  try {
    const res = await axios.post('/grades', data);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: 'Error creando la nota' };
  }
}

export async function getAllGrades() {
  try {
    const res = await axios.get('/grades');
    return res.data;
  } catch (err) {
    console.error('[grades.service] getAllGrades error', err.response?.data || err);
    throw err.response?.data || err;
  }
}
