import React from 'react';
import Image from 'next/image';

// Valeurs component for individual value cards with hover text overlay
function Valeurs({ src, title, description }) {
  return (
    <div className="group relative overflow-hidden bg-white shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl h-80 sm:h-96 md:h-[28rem]">
      {/* Image Container */}
      <div className="relative h-full overflow-hidden">
        <Image 
          src={src || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80"} 
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        
        {/* Hover Text Overlay */}
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center text-center p-4">
          <h3 
            className="text-xl sm:text-2xl font-bold text-white mb-3 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h3>
          <p 
            className="text-sm text-white leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function NosValeur() {
  const valeurs = [
    {
      src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80",
      title: "Authenticité",
      description: "Nous nous engageons à offrir des produits authentiques inspirés des traditions coréennes, garantissant une expérience de beauté véritable."
    },
    {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop&q=80",
      title: "De la nature avec intention",
      description: "Nous croyons qu'il faut donner à votre peau uniquement ce dont elle a vraiment besoin, rien de plus, rien de nocif. Chaque ingrédient est soigneusement choisi pour sa pureté, sa sécurité et son efficacité prouvée."
    },
    {
      src: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=300&fit=crop&q=80",
      title: "Bien-être",
      description: "Chaque produit est conçu pour promouvoir le bien-être holistique, en prenant soin de votre peau et de votre confiance en vous."
    }
  ];

  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h1 
            className="font-playfair text-brandRed text-center text-3xl sm:text-4xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Nos Valeurs
          </h1>
          <br />
          <p 
            className="font-dm text-center text-lg sm:text-xl text-gray-700"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Une Beauté Consciente Et Élégante
          </p>
        </div>

        {/* Triptych Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {valeurs.map((valeur, index) => (
            <div key={index} className="w-full">
              <Valeurs 
                src={valeur.src}
                title={valeur.title}
                description={valeur.description}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
