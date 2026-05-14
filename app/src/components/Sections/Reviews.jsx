"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

// Comment component for individual reviews
function Comment({ fullName, purchase, comment, avatar }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
      {/* Avatar */}
      <div className="flex items-center mb-4">
        <div className="relative w-12 h-12 mr-4">
          <Image 
            src={avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&q=80"} 
            alt={fullName}
            fill
            className="rounded-full object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <h3 
            className="font-semibold text-gray-800"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {fullName}
          </h3>
          <p 
            className="text-sm text-gray-600"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {purchase}
          </p>
        </div>
      </div>
      
      {/* Comment */}
      <p 
        className="text-gray-700 leading-relaxed italic"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        "{comment}"
      </p>
      
      {/* Stars */}
      <div className="flex mt-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample reviews data
  const reviews = [
    {
      fullName: "Sarah Johnson",
      purchase: "Glow Serum",
      comment: "Ce sérum a complètement transformé ma peau ! Je l'utilise depuis 3 mois et les résultats sont incroyables. Ma peau est plus lumineuse et plus uniforme que jamais.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
    },
    {
      fullName: "Maria Rodriguez",
      purchase: "Hydrating Mask",
      comment: "Le meilleur masque hydratant que j'ai jamais utilisé ! Ma peau est si douce et rebondie après chaque utilisation. Parfait pour ma routine peau sèche.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80"
    },
    {
      fullName: "Emily Chen",
      purchase: "Anti-Aging Cream",
      comment: "Résultats incroyables ! Je vois une amélioration visible de mes ridules et de la texture de ma peau. La technologie de soin coréenne fait vraiment des merveilles.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80"
    }
  ];

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const nextComment = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevComment = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="w-full bg-gradient-to-br from-gray-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-center text-3xl sm:text-4xl mb-5 text-brandRed uppercase font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ce que disent nos clients
          </h1>
          <p 
            className="text-center font-mont text-lg text-gray-600"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            De vraies histoires de vrais clients qui adorent nos produits
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          {/* Reviews Carousel */}
          <div className="flex-1 w-full">
            <div className="relative">
              <div className="overflow-hidden rounded-lg">
                <div 
                  className="flex mb-5 transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {reviews.map((review, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-2">
                      <Comment 
                        fullName={review.fullName} 
                        purchase={review.purchase} 
                        comment={review.comment} 
                        avatar={review.avatar} 
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {reviews.length > 1 && (
                <>
                  <button 
                    onClick={prevComment}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-300 z-10"
                    aria-label="Avis précédent"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={nextComment}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 transition-colors duration-300 z-10"
                    aria-label="Avis suivant"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Dots Indicator */}
            {reviews.length > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-brandRed w-8' 
                        : 'bg-gray-300 hover:bg-gray-400 w-3'
                    }`}
                    aria-label={`Aller à l'avis ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className="w-full lg:w-auto p-6 lg:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center">
                <div 
                  className="text-3xl sm:text-4xl font-bold text-brandRed mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  4.9
                </div>
                <div 
                  className="text-gray-600 text-sm sm:text-base"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Note moyenne
                </div>
              </div>
              
              <div className="text-center">
                <div 
                  className="text-3xl sm:text-4xl font-bold text-brandRed mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  10K+
                </div>
                <div 
                  className="text-gray-600 text-sm sm:text-base"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Clients satisfaits
                </div>
              </div>
              
              <div className="text-center">
                <div 
                  className="text-3xl sm:text-4xl font-bold text-brandRed mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  98%
                </div>
                <div 
                  className="text-gray-600 text-sm sm:text-base"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Recommanderaient
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
