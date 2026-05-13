"use client";
import { X, AlertTriangle, Package } from 'lucide-react';
const baseUrl = process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';

// Helper to format price - handles both string and number values
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0.00';
  // If it's already a string (server returns formatted strings), return as-is
  if (typeof value === 'string') return value;
  // If it's a number, format it
  if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
  return '0.00';
};

export default function CartConflictModal({ 
  isOpen, 
  onClose, 
  conflicts, 
  newCart, 
  onAccept, 
  onReject,
  loading 
}) {
  if (!isOpen) return null;

  const newCartItems = newCart?.cartItems || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute cursor-pointer inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-600" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-l_black">
                Mise à jour du panier requise
              </h2>
              <p className="font-montserrat text-sm text-gray-600">
                Certains articles ne sont plus disponibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 cursor-pointer hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[50vh] overflow-y-auto">
          {/* Conflicts List */}
          {Array.isArray(conflicts) && conflicts.length > 0 && (
            <div className="mb-5">
              <h3 className="font-montserrat text-sm font-semibold text-gray-700 mb-3">
                Articles indisponibles :
              </h3>
              <div className="space-y-2">
                {conflicts.map((conflict, idx) => (
                  <div 
                    key={`conflict-${conflict.itemId || idx}`}
                    className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-lg"
                  >
                    {conflict.product?.thumbnailUrl ? (
                      <img 
                        src={`${baseUrl}/${conflict.product.thumbnailUrl}`} 
                        alt={conflict.product?.title || 'Produit'} 
                        className="w-12 h-12 object-cover rounded-lg opacity-50"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Package size={20} className="text-red-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-montserrat text-sm font-medium text-red-800 line-through">
                        {conflict.product?.title || 'Produit indisponible'}
                      </p>
                      <p className="font-montserrat text-xs text-red-600 mt-0.5">
                        {conflict.message || 'Ce produit n\'est plus disponible'}
                      </p>
                      {conflict.oldQuantity > 0 && (
                        <p className="font-montserrat text-xs text-red-500 mt-0.5">
                          Quantité : {conflict.oldQuantity}
                        </p>
                      )}
                    </div>
                    <AlertTriangle size={16} className="text-red-500 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Cart Preview */}
          {newCartItems.length > 0 && (
            <div>
              <h3 className="font-montserrat text-sm font-semibold text-gray-700 mb-3">
                Votre panier mis à jour contiendra :
              </h3>
              <div className="space-y-2">
                {newCartItems.map((item, idx) => {
                  const imageUrl = item.product?.thumbnailUrl || item.product?.thumbnail;
                  return (
                    <div 
                      key={`item-${item.id || idx}`}
                      className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-lg"
                    >
                      {imageUrl ? (
                        <img 
                          src={`${baseUrl}/${imageUrl}`} 
                          alt={item.product?.title || 'Produit'} 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <Package size={20} className="text-green-500" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-montserrat text-sm font-medium text-gray-800">
                          {item.product?.title || 'Produit'}
                        </p>
                        <p className="font-montserrat text-xs text-gray-600">
                          Qté : {item.quantity} × ${formatPrice(item.product?.unitPrice) || formatPrice(item.product?.price)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {newCartItems.length === 0 && (
            <div className="text-center py-4">
              <p className="font-montserrat text-sm text-gray-600">
                Tous les articles de votre panier sont indisponibles. Votre panier sera vide après cette mise à jour.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 bg-gray-50">
          <p className="font-montserrat text-xs text-gray-500 mb-4 text-center">
            Souhaitez-vous continuer avec les articles disponibles ?
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onReject}
              disabled={loading}
              className="flex-1 cursor-pointer px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-montserrat font-semibold disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onAccept}
              disabled={loading}
              className="flex-1 cursor-pointer px-5 py-3 rounded-lg bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat font-semibold disabled:opacity-50"
            >
              {loading ? 'Traitement...' : 'Accepter et continuer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
