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
            <div className="min-h-screen flex flex-col items-center justify-center p-6 page-bg">
                <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
                    <svg className="site-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="7" width="18" height="12" rx="2" stroke="#0b3d91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#0b3d91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 13h18" stroke="#0b3d91" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.0"/>
                    </svg>
                    <div className="text-center mt-2 mb-4">
                        <h2 className="text-2xl font-bold text-law-primary">Intranet de Notas</h2>
                        <div className="text-sm text-gray-600">Facultad de Derecho</div>
                    </div>

                    <div className="login-card mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <h3 className="card-heading">Por favor ingrese su información</h3>
                                <div className="card-divider" />
                            </div>

                            <div className="mb-2">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <div className="relative">
                                    <span className="input-icon" aria-hidden>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <circle cx="12" cy="7" r="4" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        id="email"
                                        aria-label="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="usuario@universidad"
                                        required
                                        className="w-full input-with-icon pr-4 py-2 border border-gray-300 rounded bg-gray-50 focus:border-law-primary focus:ring-2 focus:ring-law-accent/20 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-2">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                                <div className="relative">
                                    <span className="input-icon" aria-hidden>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="11" width="18" height="10" rx="2" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="********"
                                        required
                                        className="w-full input-with-icon pr-4 py-2 border border-gray-300 rounded bg-gray-50 focus:border-law-primary focus:ring-2 focus:ring-law-accent/20 outline-none"
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}

                            <div className="flex items-center justify-between">
                                <a className="text-sm forgot-link hover:underline" href="#"></a>
                                <button type="submit" className="submit-btn" disabled={loading}>
                                    {loading ? 'Cargando...' : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path d="M21 2l-6 6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M7 13a5 5 0 1 1 7.07 7.07L21 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            Ingresar
                                        </>
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
