"use client";
import React from 'react';
import { Link } from '@/utils/react-router-dom';

const NotFound = () => {
  return (
    <div className="h-screen py-4 bg-linear-to-br from-[#fef7f5] via-white to-white relative overflow-hidden flex items-center justify-center px-4">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Large decorative circles */}
        <div className="absolute top-20 right-[5%] h-96 w-96 rounded-full bg-brandRed/5 blur-3xl" aria-hidden="true" />
        <div className="absolute top-96 left-[3%] h-80 w-80 rounded-full bg-brandRed/8 blur-3xl" aria-hidden="true" />
        <div className="absolute bottom-40 right-[10%] h-72 w-72 rounded-full bg-brandRed/6 blur-3xl" aria-hidden="true" />
        
        {/* Medium decorative circles */}
        <div className="absolute top-1/3 left-[8%] h-64 w-64 rounded-full bg-brandRed/4 blur-2xl" aria-hidden="true" />
        <div className="absolute bottom-1/4 left-[15%] h-56 w-56 rounded-full bg-brandRed/7 blur-2xl" aria-hidden="true" />
        <div className="absolute top-2/3 right-[20%] h-60 w-60 rounded-full bg-brandRed/5 blur-2xl" aria-hidden="true" />
        
        {/* Small accent circles */}
        <div className="absolute top-[15%] right-[30%] h-40 w-40 rounded-full bg-brandRed/6 blur-xl" aria-hidden="true" />
        <div className="absolute bottom-[30%] right-[40%] h-32 w-32 rounded-full bg-brandRed/5 blur-xl" aria-hidden="true" />
        <div className="absolute top-[60%] left-[25%] h-48 w-48 rounded-full bg-brandRed/4 blur-xl" aria-hidden="true" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#fdf4f2] via-white to-white border border-brandRed/10 shadow-lg">
          {/* Decorative corner accents */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brandRed/10" aria-hidden="true" />
          <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-brandRed/5" aria-hidden="true" />
          
          <div className="relative px-8 py-12 md:px-12 md:py-16 text-center">
            {/* 404 Number */}
            <div className="mb-6">
              <h1 
                className="text-8xl md:text-9xl font-bold text-brandRed mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                404
              </h1>
            </div>

            {/* Label */}
            <p
              className="text-xs uppercase tracking-[0.35em] text-brandRed mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Page introuvable
            </p>

            {/* Title */}
            <h2 
              className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Oops! Page introuvable
            </h2>

            {/* Description */}
            <p 
              className="text-gray-600 mb-8 max-w-md mx-auto text-base leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée. 
              Revenez à l'accueil pour continuer votre shopping.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors duration-300 font-semibold shadow-sm hover:shadow-md"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Retour à l'accueil
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-brandRed border-2 border-brandRed rounded-lg hover:bg-brandRed/10 transition-colors duration-300 font-semibold"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Page précédente
              </button>
            </div>

            {/* Decorative Icon */}
            <div className="mt-10 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-brandRed/10 blur-xl" aria-hidden="true" />
                <div className="relative w-20 h-20 rounded-full bg-brandRed/10 flex items-center justify-center">
                  <svg 
                    className="w-10 h-10 text-brandRed" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
