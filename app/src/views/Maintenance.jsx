"use client";
import React from 'react';

const Maintenance = () => {
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
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl animate-fade-in-up">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#fdf4f2] via-white to-white border border-brandRed/10 shadow-lg">
          {/* Decorative corner accents */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brandRed/10" aria-hidden="true" />
          <div className="absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-brandRed/5" aria-hidden="true" />
          
          <div className="relative px-8 py-12 md:px-12 md:py-16 text-center">
            {/* Title / Logo Accent */}
            <div className="mb-6 flex justify-center">
              <div className="relative animate-soft-float">
                <div className="absolute inset-0 rounded-full bg-brandRed/10 blur-xl" aria-hidden="true" />
                <div className="relative w-24 h-24 rounded-full bg-brandRed/10 flex items-center justify-center">
                  <svg 
                    className="w-12 h-12 text-brandRed animate-spin" 
                    style={{ animationDuration: '8s' }}
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Label */}
            <p
              className="text-xs uppercase tracking-[0.35em] text-brandRed mb-4 font-semibold animate-pulse"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Boutique en préparation
            </p>

            {/* Title */}
            <h1 
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Maintenance en cours
            </h1>

            {/* Description */}
            <p 
              className="text-gray-600 mb-8 max-w-md mx-auto text-base leading-relaxed"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Nous mettons à jour notre site internet pour vous offrir une expérience d'achat exceptionnelle. 
              Sikbeauty sera très bientôt de retour. Merci pour votre patience !
            </p>

            {/* Info Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 bg-brandRed/5 border border-brandRed/10 rounded-full text-brandRed text-sm font-medium"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <span className="w-2 h-2 rounded-full bg-brandRed animate-pulse"></span>
              Retour très bientôt
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
