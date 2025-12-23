import axios from './root.service.js';

export async function getProfile() {
    try {
        const response = await axios.get('/profile/private');
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al obtener perfil' };
    }
}

export async function getMyCourses() {
    try {
        const response = await axios.get('/profile/courses');
        return response.data;
    } catch (error) {
        // fallback: try another common endpoint
        try {
            const r2 = await axios.get('/students/me/courses');
            return r2.data;
        } catch (e) {
            return { error: error.response?.data || { message: 'No hay cursos disponibles' } };
        }
    }
}

export async function updateProfile(data) {
    try {
        const response = await axios.patch('/profile/private', data);
        return response.data;
    } catch (error) {
        return error.response?.data || { message: 'Error al actualizar perfil' };
    }
}