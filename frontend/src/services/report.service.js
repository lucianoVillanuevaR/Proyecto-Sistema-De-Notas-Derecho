import axios from './root.service.js';

export async function solicitarMiInforme() {
  try {
    const response = await axios.get('/reports/me/report');
    return response.data;
  } catch (error) {
    return { error: error.response?.data || { message: 'Error al solicitar informe' } };
  }
}

export async function descargarMiInformePdf() {
  try {
    const response = await axios.get('/reports/me/report/pdf', { responseType: 'blob' });
    return response;
  } catch (error) {
    // normalize
    throw error.response?.data || error;
  }
}

export async function listStudents(q = '') {
  try {
    const response = await axios.get('/reports/students', { params: { q } });
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'Error al listar estudiantes' };
  }
}

export async function getInformeEstudiante(studentId) {
  try {
    const response = await axios.get(`/reports/student/${studentId}/report`);
    return response.data;
  } catch (error) {
    return error.response?.data || { message: 'Error al obtener informe' };
  }
}

export async function descargarInformeEstudiantePdf(studentId) {
  try {
    const response = await axios.get(`/reports/student/${studentId}/report/pdf`, { responseType: 'blob' });
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
}
