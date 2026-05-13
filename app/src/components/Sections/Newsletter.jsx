"use client";
import React, { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <section className="bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 
          className="text-3xl sm:text-4xl font-bold text-brandRed mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Newsletter / Offre Discrète
        </h2>
        
        {/* Description */}
        <p 
          className="text-lg sm:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Restez informé de nos dernières offres exclusives et conseils beauté coréenne. Recevez des promotions spéciales directement dans votre boîte mail.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Votre adresse email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-6 py-4 border border-gray-300 focus:border-brandRed focus:outline-none focus:ring-1 focus:ring-[#B5483A] transition-colors bg-white rounded-lg"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
            required
          />
          <button
            type="submit"
            className="px-8 py-4 bg-brandRed text-white hover:bg-brandBrown transition-colors duration-300 rounded-lg font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 uppercase tracking-wide"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            S'abonner
          </button>
        </form>

        {/* Privacy Note */}
        <p 
          className="text-sm text-gray-600 mt-6"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          En vous abonnant, vous acceptez de recevoir nos newsletters. Vous pouvez vous désabonner à tout moment.
        </p>
      </div>
    </section>
  );
}
