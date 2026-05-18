"use client";
import { useEffect, useState } from 'react';
import { useNavigate, Link } from '@/utils/react-router-dom';
import { useCart } from '../../contexts/CartContext';
import CartItem from '../../components/Cart/CartItem';
import CartSummary from '../../components/Cart/CartSummary';
import ClientNavbar from '../../components/Client/ClientNavbar';
import { ShoppingCart, ArrowLeft, AlertTriangle } from 'lucide-react';
import PageLoader from '../../components/ui/PageLoader';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import toast from 'react-hot-toast';
import CartConflictModal from '../../components/Cart/CartConflictModal';

export default function CartPage() {
  const { cart, loading, fetchCart, getTotal, hasInactiveItems, getInactiveItems, getActiveItems } = useCart();
  const navigate = useNavigate();
  const hasUnavailable = hasInactiveItems();
  const inactiveItems = getInactiveItems();
  const activeItems = getActiveItems();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [conflictData, setConflictData] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleProceedToCheckout = async () => {
    if (activeItems.length === 0) return;

    setCheckoutLoading(true);
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
      setCheckoutLoading(false);
    }
  };

  const handleAcceptConflict = async () => {
    setCheckoutLoading(true);
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
      setCheckoutLoading(false);
    }
  };

  const handleRejectConflict = () => {
    setShowConflictModal(false);
    setConflictData(null);
    toast.error("Vous ne pouvez pas finaliser la commande en raison d'un produit en rupture de stock. Veuillez mettre à jour votre panier.");
  };

  // Handle back navigation with scroll to top
  const handleBack = () => {
    // Scroll to top before navigating
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    navigate(-1);
    // Also scroll after a short delay to ensure it works even if browser restores scroll position
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
  };

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <PageLoader label="Chargement du panier..." />
      </>
    );
  }

  // Handle both 'items' and 'result' field names from API
  const cartItems = cart?.items || cart?.result || [];
  const total = getTotal();
  const hasUnavailableItems = cartItems.some((item) => item?.product?.status !== true);
  
  if (!cart || cartItems.length === 0) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen bg-brandWhite flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl">
            <div className="text-center bg-white border border-brandRed/10 shadow-sm rounded-3xl px-6 sm:px-10 py-12 animate-fade-in-up">
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-brandRed/10 flex items-center justify-center animate-soft-float">
                <ShoppingCart size={36} className="text-brandRed" />
              </div>
              <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black mb-3">
                Votre panier est vide
              </h2>
              <p className="font-montserrat text-base sm:text-lg text-gray-600 mb-8">
                Commencez à ajouter des produits à votre panier pour les voir ici.
              </p>
              <Link
                to="/client/products"
                className="inline-flex text-sm cursor-pointer items-center justify-center bg-brandRed text-white px-10 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-semibold shadow-md hover:shadow-lg"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen mt-10 bg-brandWhite py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 md:pb-0">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center cursor-pointer gap-2 text-brandBrown hover:text-brandRed transition-colors duration-300 mb-6 font-montserrat"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black mb-6 sm:mb-8">
            Panier
          </h1>

          {hasUnavailable && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-montserrat text-base font-semibold text-amber-800">
                    {inactiveItems.length} produit{inactiveItems.length > 1 ? 's' : ''} indisponible{inactiveItems.length > 1 ? 's' : ''} dans votre panier
                  </p>
                  <p className="font-montserrat text-sm text-amber-700 mt-1">
                    {activeItems.length > 0 
                      ? 'Ces produits seront automatiquement retirés lors du passage en caisse. Vous pouvez aussi les supprimer maintenant.'
                      : 'Veuillez retirer ces produits ou continuer vos achats pour ajouter des produits disponibles.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="font-montserrat text-xs text-gray-600">Total</span>
            <span className="font-playfair text-lg font-bold text-brandRed">${total.toFixed(2)}</span>
            {hasUnavailable && (
              <span className="font-montserrat text-xs text-amber-600">
                {inactiveItems.length} indisponible{inactiveItems.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <button
            onClick={handleProceedToCheckout}
            disabled={activeItems.length === 0 || checkoutLoading}
            className={`inline-flex items-center justify-center px-5 py-3 rounded-lg transition-colors duration-300 font-montserrat font-semibold whitespace-nowrap ${activeItems.length > 0 && !checkoutLoading ? 'bg-brandRed text-white hover:bg-hoverBrandRed cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {checkoutLoading ? 'Validation...' : activeItems.length > 0 ? 'Commander' : 'Aucun article'}
          </button>
        </div>
        {hasUnavailableItems && (
          <div className="max-w-7xl mx-auto mt-2">
            <p className="font-montserrat text-xs text-red-600">
              Remove unavailable items to proceed to checkout.
            </p>
          </div>
        )}
      </div>

      <CartConflictModal
        isOpen={showConflictModal}
        onClose={() => setShowConflictModal(false)}
        conflicts={conflictData?.conflicts}
        newCart={conflictData?.newCart}
        onAccept={handleAcceptConflict}
        onReject={handleRejectConflict}
        loading={checkoutLoading}
      />
    </>
  );
}

