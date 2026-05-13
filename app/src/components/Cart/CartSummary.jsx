"use client";
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate, Link } from '@/utils/react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import toast from 'react-hot-toast';
import CartConflictModal from './CartConflictModal';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function CartSummary() {
  const navigate = useNavigate();
  const { cart, getTotal, hasInactiveItems, getInactiveItems, getActiveItems, fetchCart } = useCart();
  const total = getTotal();
  const hasUnavailable = hasInactiveItems();
  const inactiveItems = getInactiveItems();
  const activeItems = getActiveItems();

  const [loading, setLoading] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState(null);

  // Handle both 'items' and 'result' field names from API
  const cartItems = cart?.items || cart?.result || [];

  const handleProceedToCheckout = async () => {
    if (activeItems.length === 0) return;

    setLoading(true);
    try {
      const response = await api.post(API_ENDPOINTS.CHECKOUT.VALIDATE);
      const data = response?.data;
      
      // Check if response indicates conflict (some servers return 200 with conflict status)
      if (data?.status === 'REQUIRES_CONFIRMATION' || data?.newCart) {
        setConflictData({
          conflicts: data?.conflicts || [],
          newCart: data?.newCart || null,
        });
        setShowConflictModal(true);
        return;
      }
      
      toast.success('Panier validé avec succès');
      navigate('/checkout');
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      
      // Handle 409 Conflict response from server
      if (status === 409 || data?.status === 'REQUIRES_CONFIRMATION' || data?.newCart || data?.conflicts) {
        setConflictData({
          conflicts: data?.conflicts || [],
          newCart: data?.newCart || null,
        });
        setShowConflictModal(true);
      } else if (hasUnavailable) {
        // If we have inactive items locally, show the conflict modal with local data
        setConflictData({
          conflicts: inactiveItems.map(item => ({
            itemId: item.id,
            type: 'PRODUCT_UNAVAILABLE',
            message: 'Ce produit n\'est plus disponible',
            oldQuantity: item.quantity,
            newQuantity: 0,
            product: {
              id: item.product?.id,
              title: item.product?.title,
              thumbnailUrl: item.product?.thumbnailUrl || item.product?.thumbnail,
              price: item.product?.price,
              unitPrice: item.product?.unitPrice,
            },
          })),
          newCart: {
            cartItems: activeItems.map(item => ({
              id: item.id,
              product: {
                id: item.product?.id,
                title: item.product?.title,
                thumbnailUrl: item.product?.thumbnailUrl || item.product?.thumbnail,
                price: item.product?.price,
                unitPrice: item.product?.unitPrice,
              },
              quantity: item.quantity,
            })),
          },
        });
        setShowConflictModal(true);
      } else if (status === 404) {
        // Server endpoint not found - if cart is clean locally, proceed to checkout
        toast.success('Passage à la caisse');
        navigate('/checkout');
      } else {
        toast.error(data?.message || 'Échec de la validation du panier');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptConflict = async () => {
    setLoading(true);
    try {
      await api.post(API_ENDPOINTS.CHECKOUT.ACCEPT, { accept: true });
      toast.success('Panier mis à jour avec succès');
      await fetchCart();
      setShowConflictModal(false);
      setConflictData(null);
      navigate('/checkout');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Échec de la mise à jour du panier');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConflict = () => {
    setShowConflictModal(false);
    setConflictData(null);
    toast.error("Vous ne pouvez pas finaliser la commande en raison d'un produit en rupture de stock. Veuillez mettre à jour votre panier.");
  };
  
  if (!cart || cartItems.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
      <h2 className="font-playfair text-2xl font-bold text-l_black mb-6">
        Récapitulatif
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-montserrat text-base text-gray-600">
            Sous-total ({cartItems.length} {cartItems.length === 1 ? 'article' : 'articles'})
          </span>
          <span className="font-montserrat text-base font-semibold text-l_black">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-playfair text-xl font-bold text-l_black">
              Total
            </span>
            <span className="font-playfair text-2xl font-bold text-brandRed">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {hasUnavailable && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-montserrat text-sm font-semibold text-amber-800">
                {inactiveItems.length} produit{inactiveItems.length > 1 ? 's' : ''} indisponible{inactiveItems.length > 1 ? 's' : ''}
              </p>
              <p className="font-montserrat text-xs text-amber-700 mt-1">
                {activeItems.length > 0 
                  ? 'Les produits indisponibles seront retirés lors du passage en caisse.'
                  : 'Veuillez retirer les produits indisponibles ou continuer vos achats.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleProceedToCheckout}
        disabled={activeItems.length === 0 || loading}
        className={`block w-full text-center py-3 rounded-lg transition-colors duration-300 font-montserrat font-semibold ${activeItems.length > 0 && !loading ? 'bg-brandRed text-white hover:bg-hoverBrandRed cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
      >
        {loading ? 'Validation...' : activeItems.length > 0 ? 'Passer la commande' : 'Aucun article disponible'}
      </button>

      {hasUnavailable && (
        <p className="mt-3 font-montserrat text-xs text-red-600">
          Remove unavailable items to proceed.
        </p>
      )}

      <Link
        to="/client/products"
        className="block w-full mt-3 text-xs text-center text-brandRed hover:text-hoverBrandRed transition-colors duration-300 font-montserrat font-medium"
      >
        Continuer mes achats
      </Link>

      <CartConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        conflicts={conflictData?.conflicts}
        newCart={conflictData?.newCart}
        onAccept={handleAcceptConflict}
        onReject={handleRejectConflict}
        loading={loading}
      />
    </div>
  );
}

