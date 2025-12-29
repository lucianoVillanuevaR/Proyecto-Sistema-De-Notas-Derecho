import { useNavigate } from "react-router-dom"
import LoginRegisterForm from "@components/LoginRegisterForm"
import { registerService } from '@services/auth.service.js'
import '@styles/loginRegister.css'
import justiceScale from "@assets/JusticeScale.png"

const Register = () => {
    const navigate = useNavigate();

    const registerSubmit = async (data) => {
        try {
            const response = await registerService(data);
            if (response && response.status === 201) {
                navigate("/home");
            } else {
                console.error("Error al registrar usuario", response);
            }
        } catch (error) {
            console.error("Error al registrar usuario", error);
        }
    }
    return (
        <main className="page-root">
      <div className="lucky-cat-container">
        <img src={justiceScale} alt="Balanza de Justicia" className="justice-image" />
      </div>
      <div className="login-register-container">
        <LoginRegisterForm mode="register" onSubmit={registerSubmit} />
      </div>
    </main>
    )
}

export default Register