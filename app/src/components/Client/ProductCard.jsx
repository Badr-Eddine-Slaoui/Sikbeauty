"use client";
import React, { useState } from "react";
import { useNavigate } from "@/utils/react-router-dom";
import { useCart } from "../../contexts/CartContext";
import Image from "next/image";

function ProductCard({ product }) {
  const [isHover, setIsHover] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const toNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const discountValue = product?.discountType === 'PRICE'
    ? toNumber(product?.discount)
    : product?.discountType === 'PERCENT'
    ? toNumber(product?.discount)
    : 0;

  const originalPrice = toNumber(product?.price ?? 0);
  const discountedPrice = toNumber(product?.finalPrice ?? 0) || originalPrice;
  const hasDiscount = !!product?.discountType && discountValue > 0 && discountedPrice > 0 && discountedPrice < originalPrice;

  const isAvailable = product?.status === true;

  const handleClick = () => {
    navigate(`/client/products/${product.id}`);
  };

  return (
    <div className="w-full">
      <div 
        className="relative overflow-hidden group bg-white shadow-md hover:shadow-xl transition-all duration-300"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {/* Product Image */}
        <div className="relative overflow-hidden h-80">
          <Image 
            src={product.thumbnailUrl || "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=500&fit=crop"} 
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110" 
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-4 left-4 bg-[#B5483A] text-white px-3 py-1 z-10">
              <span 
                className="text-sm font-semibold uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {product.discountType === 'PERCENT'
                  ? `-${discountValue}%`
                  : product.discountType === 'PRICE'
                  ? `-${discountValue}$`
                  : ''}
              </span>
            </div>
          )}

          {/* Stock Badge */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <span 
                className="text-white text-xl font-bold uppercase"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Bientôt disponible
              </span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4 bg-white">
          <h3 
            className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[3rem]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.title}
          </h3>
          <p 
            className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {product.description || "Produit K-Beauty premium pour votre routine de soins"}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-[#B5483A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    ${discountedPrice.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400 line-through" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    ${originalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-[#B5483A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <button 
              className="px-4 py-2 bg-brandRed text-white hover:bg-brandBrown transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isAddingToCart || !isAvailable}
              onClick={async (e) => {
                e.stopPropagation();
                if (!product?.id) return;
                if (!isAvailable) return;
                setIsAddingToCart(true);
                try {
                  await addToCart(product.id, 1);
                } finally {
                  setIsAddingToCart(false);
                }
              }}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {isAddingToCart ? 'Ajout...' : isAvailable ? 'Ajouter au panier' : 'Bientôt disponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
