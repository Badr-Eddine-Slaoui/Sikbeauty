"use client";
import React, { useState } from "react";
import Image from "next/image";

function Product({ src }) {
  const [isHover, setIsHover] = useState(false);
  
  return (
    <div className="w-full">
      <div 
        className="relative overflow-hidden group h-80"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        {/* Product Image */}
        <Image 
          src={src || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop"} 
          alt="Produit" 
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Hover Overlay */}
        <div 
          style={{ fontFamily: "'Playfair Display', serif" }}
          className={`absolute inset-0 bg-black/75 flex flex-col justify-between items-center
            transition-all duration-500 text-white p-6
            ${isHover ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            ${isHover ? 'pointer-events-auto' : 'pointer-events-none'}`}
        >
          <div className="flex-1 flex flex-col justify-center text-center">
            <span className="inline-block bg-brandRed text-white text-sm font-dm px-3 py-1 mb-3 mx-auto">
              -20% OFFRE
            </span>
            <h3 className="text-2xl font-semibold mb-4">GLOW SERUM</h3>
            <p className="font-dm text-sm leading-relaxed px-2">
              Une ampoule éclairante qui équilibre le teint et affine l'apparence des pores pour une peau lumineuse et radieuse
            </p>
          </div>
          
          {/* Add to Cart Button */}
          <button className="w-full bg-white cursor-pointer text-black py-3 font-dm text-base font-medium hover:bg-brandRed hover:text-white transition-all duration-300 transform hover:scale-105">
            Ajouter au panier - 15,40$
          </button>
        </div>
      </div>
    </div>
  );
}

export default Product