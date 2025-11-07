import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const res = await login({ email, password });
        setLoading(false);

        if (res?.status === 'Success' || res?.data) {
            navigate('/home');
            return;
        }

        setError(res?.message || 'Error al iniciar sesión');
    };

        return (
            <div className="min-h-screen flex items-center justify-center p-10 page-bg">
                <div>
                    <div className="header-content" style={{textAlign: 'center', marginBottom: 8}}>
                        <svg className="law-icon" xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path d="M12 3v2M5 21h14" stroke="#0b3d91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M7 10c0 1.657-1.343 3-3 3v1h6v-1c-1.657 0-3-1.343-3-3zM20 10c0 1.657-1.343 3-3 3v1h6v-1c-1.657 0-3-1.343-3-3z" stroke="#0b3d91" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 3c3 0 5 1.5 5 4v2m-10 0V7c0-2.5 2-4 5-4" stroke="#0b3d91" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h2 className="site-title centered">Intranet de Notas</h2>
                        <div className="faculty-sub">Facultad de Derecho</div>
                    </div>

                    <div className="login-card" role="main">
                        <form onSubmit={handleSubmit}>
                            <div className="card-title">
                                <span className="cup" aria-hidden>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M3 6.5C3 5.67 3.67 5 4.5 5H19.5C20.33 5 21 5.67 21 6.5V18.5C21 19.33 20.33 20 19.5 20H4.5C3.67 20 3 19.33 3 18.5V6.5Z" stroke="#2b6cb0" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                        <path d="M7 8H17" stroke="#2b6cb0" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                                <h3>Por favor ingrese su información</h3>
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="email">Email institucional</label>
                                <div className="input-row">
                                    <input
                                        type="email"
                                        id="email"
                                        aria-label="Email institucional"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="usuario@universidad"
                                        required
                                    />
                                    <span className="icon" aria-hidden>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="7" r="4" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="password">Contraseña</label>
                                <div className="input-row">
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="********"
                                        required
                                    />
                                    <span className="icon" aria-hidden>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            {error && <p className="error-msg">{error}</p>}

                            <div className="actions-row">
                                <a className="forgot" href="#">¿Olvidó su clave?</a>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Cargando...' : (
                                        <span className="btn-content"><span className="key" aria-hidden>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path d="M21 2l-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 13a5 5 0 1 1 7.07 7.07L21 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span> Ingresar</span>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
}

export default Login;
