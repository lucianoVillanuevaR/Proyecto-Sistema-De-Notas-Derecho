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
