import axios from './root.service.js';

export async function updateGrade(id, changes) {
  try {
    const res = await axios.patch(`/grades/${id}`, changes);
    return res.data;
  } catch (err) {
    return err.response?.data || { message: 'Error actualizando la nota' };
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
