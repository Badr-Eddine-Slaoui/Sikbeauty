"use client";
import { useState } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

export default function CartItem({ item }) {
  const { incrementDecrementQuantity, removeFromCart } = useCart();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

  // Helper function to build image URL
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}` : path;
  };

  const handleIncrement = async () => {
    setIsUpdating(true);
    await incrementDecrementQuantity(item.id, 'increment');
    setIsUpdating(false);
  };

  const handleDecrement = async () => {
    setIsUpdating(true);
    await incrementDecrementQuantity(item.id, 'decrement');
    setIsUpdating(false);
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await removeFromCart(item.id);
    setIsRemoving(false);
  };

  const product = item.product || {};
  const imageUrl = product.thumbnailUrl ? buildImageUrl(product.thumbnailUrl) : PLACEHOLDER_IMAGE;
  const toNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  // Backend cart response already includes the discounted unit price as `product.unitPrice`
  // and the base price as `product.price` (both formatted as strings like "850.00").
  const basePrice = toNumber(product.price ?? 0);
  const unitPrice = toNumber(product.unitPrice ?? product.price ?? 0);

  const finalPrice = unitPrice * (item.quantity || 1);
  const showDiscount = basePrice > 0 && unitPrice > 0 && unitPrice < basePrice;
  const oldPrice = showDiscount ? basePrice : null;
  const isAvailable = product?.status === true;

  return (
    <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-shadow ${isAvailable ? 'bg-white border-gray-200 hover:shadow-md' : 'bg-red-50 border-red-300 opacity-80'}`}>
      {/* Product Image */}
      <div className={`relative w-full sm:w-32 h-36 sm:h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden ${!isAvailable ? 'grayscale' : ''}`}>
        {!isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
            <span className="text-white text-xs font-semibold bg-red-600 px-2 py-1 rounded">Indisponible</span>
          </div>
        )}
        <img
          src={imageUrl}
          alt={product.title || 'Produit'}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = PLACEHOLDER_IMAGE;
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
        <div className="flex-1">
          <h3 className="font-playfair text-lg font-bold text-l_black mb-2">
            {product.title || product.description?.substring(0, 50) || 'Produit'}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-montserrat text-base font-semibold text-brandRed">
              ${unitPrice.toFixed(2)}
            </span>
            {oldPrice !== null && (
              <span className="font-montserrat text-sm text-gray-500 line-through">
                ${oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="font-montserrat text-sm text-gray-600">
            Disponibilité: <span className={isAvailable ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>
              {isAvailable ? 'Disponible' : 'Pas disponible (Bientôt disponible)'}
            </span>
          </p>
          {!isAvailable && (
            <p className="font-montserrat text-xs text-red-600 mt-1">
              Ce produit sera supprimé lors du passage en caisse
            </p>
          )}
        </div>

        {/* Quantity Controls and Price */}
        <div className="flex flex-row sm:flex-row items-center justify-between sm:justify-end gap-3 sm:gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={handleDecrement}
              disabled={isUpdating || item.quantity <= 1}
              className="h-10 w-10 sm:h-auto sm:w-auto p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Diminuer la quantité"
            >
              <Minus size={16} />
            </button>
            <span className="font-montserrat text-base font-medium px-4 min-w-12 text-center select-none">
              {item.quantity || 1}
            </span>
            <button
              onClick={handleIncrement}
              disabled={isUpdating || !isAvailable || item.quantity >= 99}
              className="h-10 w-10 sm:h-auto sm:w-auto p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Augmenter la quantité"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Total Price */}
          <div className="text-right min-w-[84px]">
            <p className="font-montserrat text-lg font-bold text-brandRed">
              ${finalPrice.toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-10 w-10 sm:h-auto sm:w-auto p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Supprimer l'article"
            aria-label="Supprimer l'article"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

