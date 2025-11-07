import { Link } from 'react-router-dom';

const Error404 = () => {
  return (
    <div className="min-h-screen law-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-12 md:p-16 text-center max-w-2xl transition-all">
        <h1 className="text-9xl font-extrabold law-gradient-text-lg mb-4">
          404
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 text-lg mb-8">
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link 
          to="/home" 
          className="inline-block law-btn text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 hover:shadow-xl"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default Error404;