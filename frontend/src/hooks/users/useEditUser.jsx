import { editUser } from "@services/user.service";
import Swal from "sweetalert2";

const useEditUser = (fetchUsers) => {
  const handleEditUser = async (userId, user) => {
    const result = await Swal.fire({
      title: "Editar Usuario",
      html: `
        <input id="nombre" class="swal2-input" placeholder="Nombre" value="${user.nombre || ''}">
        <input id="rut" class="swal2-input" placeholder="RUT (ej: 12345678-9)" value="${user.rut || ''}">
        <input id="email" class="swal2-input" placeholder="Email" value="${user.email || ''}">
        <select id="role" class="swal2-input">
          <option value="estudiante" ${user.role === "estudiante" ? "selected" : ""}>Estudiante</option>
          <option value="profesor" ${user.role === "profesor" ? "selected" : ""}>Profesor</option>
          <option value="admin" ${user.role === "admin" ? "selected" : ""}>Admin</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("nombre").value;
        const rut = document.getElementById("rut").value;
        const email = document.getElementById("email").value;
        const role = document.getElementById("role").value;

        if (!nombre || !rut || !email) {
          Swal.showValidationMessage("Por favor completa todos los campos");
          return false;
        }

        return { nombre, rut, email, role };
      },
    });

    if (result.isConfirmed) {
      try {
        await editUser(userId, result.value);
        await fetchUsers();
        Swal.fire("¡Guardado!", "El usuario ha sido actualizado.", "success");
      } catch (error) {
        console.error("Error editando usuario:", error);
        Swal.fire("Error", "No se pudo actualizar el usuario", "error");
      }
    }
  };

  return { handleEditUser };
};

export default useEditUser;
