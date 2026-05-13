"use client";
import React from 'react';
import { Link } from '@/utils/react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Unauthorized() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Accès refusé
        </h1>
        
        <p className="text-gray-600 mb-6">
          Vous n'avez pas la permission d'accéder à cette page.
          {user && (
            <span className="block mt-2 text-sm">
              Votre rôle actuel : <span className="font-semibold">{user.role}</span>
            </span>
          )}
        </p>
        
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-brandRed text-white px-4 py-2 rounded-md hover:bg-brandBrown transition-colors duration-300 inline-block"
          >
            Retour à l'accueil
          </Link>
          
          <button
            onClick={logout}
            className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-300"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
