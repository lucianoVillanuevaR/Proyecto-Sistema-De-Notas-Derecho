import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen page-bg flex items-center justify-center p-6">
      <div className="bg-white card-elevated p-12 rounded-2xl max-w-3xl w-full text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Bienvenido a la Intranet de la Facultad de Derecho</h1>
        <p className="mt-3 text-sm text-gray-500">Accede a tu perfil, historial y notificaciones desde la barra lateral.</p>
      </div>
    </div>
  );
}