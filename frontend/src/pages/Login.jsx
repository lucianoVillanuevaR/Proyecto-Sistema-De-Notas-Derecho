import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LoginRegisterForm from "@components/LoginRegisterForm";
import { loginService } from "@services/auth.service.js";
import justiceScale from "@assets/JusticeScale.png";
import "@styles/loginRegister.css";

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  // Función que maneja el envío del formulario de inicio de sesión
  const loginSubmit = async (data) => {
    try {
      const response = await loginService(data);
      if (response && response.status === 200) {
        navigate("/home");
      } else {
        setLoginError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      console.error(error);
      setLoginError("Error al iniciar sesión");
    }
  };

  return (
    <main className="page-root">
      <div className="lucky-cat-container">
        <img src={justiceScale} alt="Balanza de Justicia" className="justice-image" />
      </div>
      <div className="login-register-container">
        <LoginRegisterForm mode="login" onSubmit={loginSubmit} loginError={loginError} />
      </div>
    </main>
  );
};

export default Login;
