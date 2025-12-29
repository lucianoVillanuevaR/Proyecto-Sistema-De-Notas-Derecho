import Swal from "sweetalert2";
import { deleteUser } from "@services/user.service";

const useDeleteUser = (fetchUsers) => {
  const handleDeleteUser = async (userId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(userId);
        await fetchUsers();
        Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error eliminando usuario:", error);
        Swal.fire("Error", "No se pudo eliminar el usuario", "error");
      }
    }
  };

  return { handleDeleteUser };
};

export default useDeleteUser;
