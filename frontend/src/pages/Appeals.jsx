import StudentAppeals from "./StudentAppeals";
import ProfessorAppeals from "./ProfessorAppeals";

export default function Appeals() {
  const user = JSON.parse(sessionStorage.getItem("usuario"));

  if (!user) {
    return <p>No autorizado</p>;
  }

  const role = user.role || user.rol;

  if (role === "estudiante") {
    return <StudentAppeals />;
  }

  if (
    role === "profesor" ||
    role === "administrador" ||
    role === "admin"
  ) {
    return <ProfessorAppeals />;
  }

  return <p>Rol no reconocido</p>;
}