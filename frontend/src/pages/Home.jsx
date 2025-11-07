import { useState } from 'react';

const Home = () => {
  const [profileData, setProfileData] = useState(null);

  const handleGetProfile = async () => {
    console.log('Obtener perfil');
  };
  return (
    <div className="min-h-screen law-bg flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl transition-all">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-8 text-center law-gradient-text">
          Página de Inicio
        </h1>
        
        <button 
          onClick={handleGetProfile} 
          className="w-full law-btn text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-xl"
        >
          Obtener Perfil
        </button>

        {profileData && (
          <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
            <pre className="text-sm text-gray-700 overflow-auto">{JSON.stringify(profileData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;