"use client";
import React from 'react';
import HistoryImage from "../../assets/Images/history.png";

export default function History() {
  return (
    <div className="mt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h1 
            className="font-playfair text-brandRed text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            L'Histoire de SI K-Beauty
          </h1>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 flex justify-center items-center p-6 sm:p-8 lg:p-12">
            <div className="max-w-lg">
              <p 
                className="text-lg sm:text-xl leading-relaxed text-justify mb-6"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                "SI K-Beauty est née d'un amour profond pour la Corée, ses traditions et sa science du soin. Nous avons créé un pont entre Séoul et le Maroc, pour vous offrir des produits authentiques, sélectionnés avec rigueur, dans un écrin de simplicité et d'élégance."
              </p>
              <a 
                href="#" 
                className="inline-block text-brandRed hover:text-brandBrown transition-colors duration-300 font-medium underline decoration-2 underline-offset-4 hover:decoration-brandBrown"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                En savoir plus
              </a>
            </div>
          </div>

          {/* Image Content */}
          <div className="order-1 lg:order-2 flex justify-center items-center p-4 sm:p-6 lg:p-8">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <img 
                src={HistoryImage?.src || HistoryImage} 
                alt="Beautiful Asian woman with perfect skin"
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              />
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-brandRed/20 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brandRed/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="flex justify-center mt-16">
          <div className="w-24 h-1 bg-brandRed"></div>
        </div>
      </div>
    </div>
  );
}
