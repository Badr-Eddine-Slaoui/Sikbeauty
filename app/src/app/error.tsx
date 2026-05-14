'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h2 className="text-2xl font-playfair font-bold text-l_black mb-4">
        Oups ! Quelque chose s'est mal passé.
      </h2>
      <p className="text-gray-600 font-montserrat text-center mb-8 max-w-md">
        Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-brandRed text-white rounded-full hover:bg-hoverBrandRed transition-colors font-montserrat font-medium"
        >
          Réessayer
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-montserrat font-medium"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
