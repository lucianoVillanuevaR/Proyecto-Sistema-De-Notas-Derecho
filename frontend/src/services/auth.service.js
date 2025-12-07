import axios from './root.service.js';
import cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export async function registerService(datauser) {
    try {
        const response = await axios.post("/auth/register", {
            email: datauser.email,
            password: datauser.password,
            role: datauser.role || 'estudiante'
        })

        return response
    } catch (error) {
        console.error("Error en auth.service", error);
        return error.response || { status: 500, data: { message: 'Error de conexión' } };
    }
}

export async function loginService(datauser) {
    try {
        const response = await axios.post('/auth/login', {
            email: datauser.email,
            password: datauser.password
        });

        const { status, data } = response;
        if (status === 200) {
            // El backend devuelve { data: { user, token } }
            const { user, token } = data.data;
            const userData = {
                id: user.id,
                username: user.username,
                email: user.email,
                rut: user.rut,
                role: user.role
            };
            sessionStorage.setItem('usuario', JSON.stringify(userData));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            cookies.set('jwt-auth', token, { path: '/' });
        }
        return response;
    } catch (error) {
        console.error("Error en auth.service", error);
        return error.response || { status: 500, data: { message: 'Error de conexión' } };
    }
}

export async function logout() {
    try {
        await axios.post('/auth/logout');
        sessionStorage.removeItem('usuario');
        cookies.remove('jwt');
        cookies.remove('jwt-auth');
    } catch (error) {
        console.error('Error al cerrar sesión', error)
    }
}
