import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect, useState } from "react";

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);
  const [filtro, setFiltro] = useState("todos");

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  const usuariosFiltrados = filtro === "todos" 
    ? users 
    : users.filter(user => user.role === filtro);

  return (
    <div className="users-container">
      <div className="users-wrapper">
        <div className="users-header">
          <h1>Lista de Usuarios</h1>
          <div className="filtros">
            <button 
              className={`btn-filtro ${filtro === "todos" ? "activo" : ""}`}
              onClick={() => setFiltro("todos")}
            >
              Todos
            </button>
            <button 
              className={`btn-filtro ${filtro === "profesor" ? "activo" : ""}`}
              onClick={() => setFiltro("profesor")}
            >
              Profesores
            </button>
            <button 
              className={`btn-filtro ${filtro === "estudiante" ? "activo" : ""}`}
              onClick={() => setFiltro("estudiante")}
            >
              Estudiantes
            </button>
          </div>
        </div>

        <div className="users-table">
          {!usuariosFiltrados || usuariosFiltrados.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>No hay usuarios disponibles</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>RUT</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((user) => (
                  <tr key={user.id}>
                    <td>{user.nombre || '-'}</td>
                    <td>{user.rut || '-'}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="acciones">
                      <button className="btn-editar" onClick={() => {
                        if (confirm(`¿Deseas editar el usuario "${user.nombre}"?`)) {
                          handleEditUser(user.id, user);
                        }
                      }}>Editar</button>
                      <button className="btn-eliminar" onClick={() => {
                        if (confirm(`⚠️ ¿Estás seguro de eliminar al usuario "${user.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
                          handleDeleteUser(user.id);
                        }
                      }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
