import "@styles/users.css";
import useGetUsers from "@hooks/users/useGetUsers.jsx";
import useDeleteUser from "@hooks/users/useDeleteUser.jsx";
import useEditUser from "@hooks/users/useEditUser.jsx";
import { useEffect } from "react";

const Users = () => {
  const { users, fetchUsers } = useGetUsers();
  const { handleDeleteUser } = useDeleteUser(fetchUsers);
  const { handleEditUser } = useEditUser(fetchUsers);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <div className="users-wrapper">
        <div className="users-header">
          <h1>Lista de Usuarios</h1>
        </div>

        <div className="users-table">
          {!users || users.length === 0 ? (
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
                {users.map((user) => (
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
