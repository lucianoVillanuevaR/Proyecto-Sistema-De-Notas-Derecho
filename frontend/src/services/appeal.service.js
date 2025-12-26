import axios from './root.service.js';

export async function getAppeals() {
  const res = await axios.get('/appeal/obtener');
  return res.data.data;
}

export async function getAppealById(id) {
  const res = await axios.get(`/appeal/obtener/id/${id}`);
  return res.data.data;
}

export async function getAppealableGrades() {
  const res = await axios.get('/appeal/obtener/notas');
  return res.data.data;
}

export async function createAppeal(data) {
  const res = await axios.post('/appeal/crear', data);
  return res.data.data;
}

export async function updateAppeal(id, data) {
  const res = await axios.patch(`/appeal/actualizar/${id}`, data);
  return res.data.data;
}