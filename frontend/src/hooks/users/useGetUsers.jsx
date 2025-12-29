import { useState } from 'react';
import { getUsers } from '@services/user.service.js';

export const useGetUsers = () => { 
    const [users, setUsers] = useState([]);
    
    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            if (data && Array.isArray(data)) {
                dataLogged(data);
                setUsers(data);
            } else {
                console.error("Datos inválidos recibidos:", data);
                setUsers([]);
            }
        } catch (error) {
            console.error("Error consiguiendo usuarios:", error);
            setUsers([]);
        }
    };
    
    const dataLogged = (data) => {
        try {
            const usuario = JSON.parse(sessionStorage.getItem("usuario"));
            if (!usuario || !usuario.rut) return;
            
            for (let i = 0; i < data.length; i++) {
                if(data[i].rut === usuario.rut) {
                    data.splice(i, 1);
                    break;
                }
            }
        } catch (error) {
            console.error("Error procesando datos de usuario:", error);
        }
    }

    return { users, setUsers, fetchUsers };
}

export default useGetUsers;