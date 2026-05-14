import React from 'react';
import Image from 'next/image';

export default function Discover() {
  return (
    <div className="bg-[#FBD7DB] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Section - Text Content */}
          <div className="space-y-4">
            {/* Main Heading */}
            <h2 
              className="text-3xl sm:text-4xl text-brandRed font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Découvrez la différence que font nos cosmétiques
            </h2>
            
            {/* Brand Philosophy */}
            <p 
              className="text-lg sm:text-xl leading-relaxed opacity-90"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Chez SI K-Beauty, nous croyons que la vraie beauté vient de produits qui non seulement améliorent votre apparence, mais aussi respectent vos valeurs et le monde qui nous entoure.
            </p>
            
            {/* Feature Blocks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Eco-Friendly Block */}
              <div className="space-y-2">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Écologique et durable
                </h3>
                <p 
                  className="text-sm opacity-90 leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Engagés pour l'environnement avec des emballages durables et des ingrédients éthiques.
                </p>
              </div>
              
              {/* Inclusivity Block */}
              <div className="space-y-2">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Inclusivité et diversité
                </h3>
                <p 
                  className="text-sm opacity-90 leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Des produits de beauté conçus pour tous les types et tons de peau, célébrant l'unicité de chacun.
                </p>
              </div>
              
              {/* Premium Quality Block */}
              <div className="space-y-2">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                    <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Qualité premium
                </h3>
                <p 
                  className="text-sm opacity-90 leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Des formulations rigoureusement testées utilisant uniquement les meilleurs ingrédients pour des résultats exceptionnels.
                </p>
              </div>
              
              {/* Empowering Confidence Block */}
              <div className="space-y-2">
                <div className="w-8 h-8">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brandRed">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                </div>
                <h3 
                  className="font-bold text-lg"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Renforcer la confiance
                </h3>
                <p 
                  className="text-sm opacity-90 leading-relaxed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Sublimer votre beauté naturelle pour vous aider à vous sentir confiant(e) et radieux(se) chaque jour.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Section - Product Showcase */}
          <div className="relative">
            <div className="bg-gradient-to-br from-[#F5F5DC] to-[#F0E68C] rounded-2xl p-4 lg:p-6 relative overflow-hidden">
              {/* Product Image */}
              <div className="relative z-10 w-full h-[350px]">
                <Image 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=450&fit=crop&q=80"
                  alt="SI K-Beauty Products"
                  fill
                  className="object-cover rounded-xl shadow-xl"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/20 rounded-full"></div>
              <div className="absolute bottom-8 left-4 w-12 h-12 bg-white/10 rounded-full"></div>
              <div className="absolute top-1/2 left-2 w-8 h-8 bg-white/15 rounded-full"></div>
              
              {/* Stats Badges */}
              <div className="absolute top-6 right-6 z-10 bg-white rounded-xl px-4 py-3 shadow-lg">
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    98%
                  </div>
                  <div 
                    className="text-xs text-gray-600"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Ingrédients naturels
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 z-11 right-6 bg-white rounded-xl px-4 py-3 shadow-lg">
                <div className="text-center">
                  <div 
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    50K+
                  </div>
                  <div 
                    className="text-xs text-gray-600"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    Clients satisfaits
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
