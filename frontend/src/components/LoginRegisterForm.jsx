import { useForm } from "react-hook-form";
import "@styles/LoginRegisterForm.css";

const LoginRegisterForm = ({ mode = "login", onSubmit, loginError}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onSubmit",
  });

  const onFormSubmit = async (data) => {
    try {
      const payload =
      mode === "login" ? { email: data.email, password: data.password } : data;

      await onSubmit(payload);

    } catch (error) {
      if (error.response) {
        // Error from the backend
        console.error("Error del backend:", error.response.data);
      }
    }
  };

  return (
    <div className="login-register-form">
      <h2 className="form-title">
        {mode === "login" ? "Iniciar sesión" : "Registrarse"}
      </h2>
      
      {mode === "login" && (Object.values(errors).length > 0 || loginError) && (
        <div className="form-error-container">
          <p>{errors.email?.message || errors.password?.message || loginError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="form-group">
          <label>Correo:</label>
          <input
            type="email"
            {...register("email", {
              required: "El correo es obligatorio",
              minLength: {
                value: 10,
                message: "El correo debe tener al menos 10 caracteres",
              },
              maxLength: {
                value: 50,
                message: "El correo debe tener como máximo 50 caracteres",
              },
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message:
                  "El correo debe ser un correo electrónico válido",
              },
            })}
          />
          {errors.email && (
            <span className="form-error-container">{errors.email.message}</span>
          )}
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 5,
                message: "La contraseña debe tener al menos 5 caracteres",
              },
              maxLength: {
                value: 26,
                message: "La contraseña debe tener como máximo 26 caracteres",
              },
            })}
          />
          {errors.password && (
            <span className="form-error-container">
              {errors.password.message}
            </span>
          )}
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label>Rol:</label>
            <select
              {...register("role", {
                required: "El rol es obligatorio",
              })}
              defaultValue="estudiante"
            >
              <option value="estudiante">Estudiante</option>
              <option value="profesor">Profesor</option>
            </select>
            {errors.role && (
              <span className="form-error-container">{errors.role.message}</span>
            )}
          </div>
        )}

        <button type="submit">
          {mode === "login" ? "Entrar" : "Registrarse"}
        </button>
      </form>

      {mode === "register" && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginRegisterForm;
