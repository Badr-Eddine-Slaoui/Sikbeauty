"use client";
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from '@/utils/react-router-dom';
import toast from 'react-hot-toast';
import ClientNavbar from '../../components/Client/ClientNavbar';
import PageLoader from '../../components/ui/PageLoader';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { useCart } from '../../contexts/CartContext';
import { ArrowLeft, ShoppingCart, AlertTriangle, Package } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Helper function to build image URL
const buildImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http") || path.startsWith("//")) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBase}/${cleanPath}`;
};

const initialAddress = {
  fullName: '',
  email: '',
  phoneCountryCode: '+212',
  phoneNumber: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'Morocco',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, loading, fetchCart, getTotal, hasInactiveItems, getInactiveItems, getActiveItems } = useCart();
  const hasUnavailable = hasInactiveItems();
  const inactiveItems = getInactiveItems();
  const activeItems = getActiveItems();

  const [address, setAddress] = useState(initialAddress);
  const [submitting, setSubmitting] = useState(false);
  const [conflict, setConflict] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItems = cart?.items || cart?.result || [];
  const hasUnavailableItems = cartItems.some((item) => item?.product?.status !== true);
  const total = getTotal();

  const canSubmit = useMemo(() => {
    if (cartItems.length === 0) return false;
    if (activeItems.length === 0) return false;
    return (
      address.fullName.trim().length >= 3 &&
      address.email.trim().length >= 3 &&
      address.phoneCountryCode.trim().length >= 2 &&
      address.phoneNumber.trim().length >= 4 &&
      address.street.trim().length >= 3 &&
      address.city.trim().length >= 2 &&
      address.state.trim().length >= 2 &&
      address.country.trim().length >= 2
    );
  }, [address, cartItems.length, activeItems.length]);

  const onChange = (key) => (e) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const createOrder = async () => {
    const payload = {
      fullName: address.fullName.trim(),
      email: address.email.trim(),
      phoneCountryCode: address.phoneCountryCode.trim(),
      phoneNumber: address.phoneNumber.trim(),
      street: address.street.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      postalCode: address.postalCode?.trim() || undefined,
      country: address.country.trim(),
    };

    const res = await api.post(API_ENDPOINTS.ORDERS.CREATE, payload);
    return res;
  };

  const validateCart = async () => {
    const res = await api.post(API_ENDPOINTS.CHECKOUT.VALIDATE);
    return res;
  };

  const proceedToPayment = async (orderId) => {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, {
        orderId: orderId,
      });
      
      const checkoutUrl = response.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error('Impossible de créer la session de paiement');
        setSubmitting(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Erreur lors de la création de la session de paiement');
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setConflict(null);
    setOrderSuccess(false);

    try {
      await validateCart();
      const orderResponse = await createOrder();
      const orderId = orderResponse.data?.data?.id || orderResponse.data?.id;
      
      if (!orderId) {
        throw new Error('ID de commande non reçu');
      }
      
      setCreatedOrderId(orderId);
      toast.success('Commande créée, redirection vers le paiement...');
      
      await proceedToPayment(orderId);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        const data = err.response?.data;
        setConflict({
          status: data?.status,
          message: data?.message,
          conflicts: data?.conflicts || [],
          newCart: data?.newCart || null,
        });
      } else {
        toast.error(err?.response?.data?.message || 'Échec de la création de la commande');
      }
      setSubmitting(false);
    }
  };

  const handleResolveConflict = async (accept) => {
    setSubmitting(true);
    try {
      const response = await api.post(API_ENDPOINTS.CHECKOUT.ACCEPT, { accept });
      if (accept) {
        toast.success(response?.data?.message || 'Panier mis à jour avec succès');
        await fetchCart();
        try {
          const orderResponse = await createOrder();
          const orderId = orderResponse.data?.data?.id || orderResponse.data?.id;
          
          if (!orderId) {
            throw new Error('ID de commande non reçu');
          }
          
          setCreatedOrderId(orderId);
          setConflict(null);
          toast.success('Commande créée, redirection vers le paiement...');
          
          await proceedToPayment(orderId);
        } catch (err) {
          const status = err?.response?.status;
          if (status === 409) {
            const data = err.response?.data;
            setConflict({
              status: data?.status,
              message: data?.message,
              conflicts: data?.conflicts || [],
              newCart: data?.newCart || null,
            });
          } else {
            toast.error(err?.response?.data?.message || 'Échec de la création de la commande');
          }
          setSubmitting(false);
        }
      } else {
        toast.error(response?.data?.message || 'Commande annulée');
        setConflict(null);
        navigate('/cart');
        setSubmitting(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Échec de la résolution des conflits du panier');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <PageLoader label="Chargement..." />
      </>
    );
  }

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen bg-brandWhite flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl bg-white border border-brandRed/10 shadow-sm rounded-3xl px-6 sm:px-10 py-12">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black mb-3 text-center">Paiement</h1>
            <p className="font-montserrat text-gray-600 text-center mb-8">Votre panier est vide.</p>
            <div className="flex justify-center">
              <Link
                to="/client/products"
                className="inline-flex items-center justify-center bg-brandRed text-white px-10 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-semibold"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (orderSuccess) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen bg-brandWhite flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-xl bg-white border border-brandRed/10 shadow-sm rounded-3xl px-6 sm:px-10 py-12 text-center">
            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black mb-3">Commande confirmée</h1>
            <p className="font-montserrat text-gray-600 mb-8">Merci. Votre commande a été créée.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/client/products"
                className="inline-flex items-center justify-center bg-brandRed text-white px-8 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-semibold"
              >
                Continuer mes achats
              </Link>
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="inline-flex items-center justify-center bg-white border border-brandRed text-brandRed px-8 py-3 rounded-full hover:bg-brandRed/5 transition-colors duration-300 font-montserrat font-semibold"
              >
                <ShoppingCart size={24} />
                Retour au panier
              </button>
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 mb-6">
            
            <button
                onClick={() => navigate('/cart')}
                className="flex items-center cursor-pointer gap-2 text-brandBrown hover:text-brandRed transition-colors duration-300 mb-4 font-montserrat"
            >
                <ArrowLeft size={20} />
                <span>Retour</span>
            </button>

            <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black">Paiement</h1>
          </div>
           

          {conflict && (
            <div className="mb-6 bg-white border border-brandRed/20 rounded-2xl p-5">
              <div className="flex flex-col gap-1 mb-4">
                <p className="font-montserrat text-xs uppercase tracking-widest text-brandRed">{conflict.status || 'REQUIRES_CONFIRMATION'}</p>
                <h2 className="font-playfair text-2xl font-bold text-l_black">Votre panier nécessite une confirmation</h2>
                <p className="font-montserrat text-sm text-gray-600">{conflict.message || 'Certains articles de votre panier ont changé'}</p>
              </div>

              {Array.isArray(conflict.conflicts) && conflict.conflicts.length > 0 && (
                <div className="mb-4">
                  <div className="space-y-2">
                    {conflict.conflicts.map((c, idx) => (
                      <div key={`${c.itemId || idx}-${idx}`} className="flex items-start justify-between gap-3 bg-brandRed/5 rounded-xl p-3">
                        <div className="min-w-0">
                          <p className="font-montserrat text-sm font-semibold text-l_black">{c.type || 'Conflict'}</p>
                          <p className="font-montserrat text-sm text-gray-700 wrap-break-word">{c.message}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-montserrat text-xs text-gray-600">Ancien : {c.oldQuantity}</p>
                          <p className="font-montserrat text-xs text-gray-600">Nouveau : {c.newQuantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleResolveConflict(false)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-montserrat font-semibold disabled:opacity-60"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleResolveConflict(true)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat font-semibold disabled:opacity-60"
                >
                  Accepter les modifications et continuer
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
              {hasUnavailableItems && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="font-montserrat text-sm text-red-700">
                    Some items in your cart are unavailable. Please remove them before checkout.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Nom complet</label>
                  <input
                    value={address.fullName}
                    onChange={onChange('fullName')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Email</label>
                  <input
                    value={address.email}
                    onChange={onChange('email')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="email"
                    type="email"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Indicatif pays</label>
                  <input
                    value={address.phoneCountryCode}
                    onChange={onChange('phoneCountryCode')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    placeholder="+212"
                    inputMode="tel"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Numéro de téléphone</label>
                  <input
                    value={address.phoneNumber}
                    onChange={onChange('phoneNumber')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    placeholder="6xxxxxxxx"
                    inputMode="numeric"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Adresse</label>
                  <input
                    value={address.street}
                    onChange={onChange('street')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="street-address"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Ville</label>
                  <input
                    value={address.city}
                    onChange={onChange('city')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="address-level2"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Région</label>
                  <input
                    value={address.state}
                    onChange={onChange('state')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="address-level1"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Code postal (optionnel)</label>
                  <input
                    value={address.postalCode}
                    onChange={onChange('postalCode')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="postal-code"
                  />
                </div>

                <div>
                  <label className="block font-montserrat text-sm font-semibold text-l_black mb-2">Pays</label>
                  <input
                    value={address.country}
                    onChange={onChange('country')}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 font-montserrat focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                    autoComplete="country-name"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-montserrat font-semibold"
                >
                  Retour
                </Link>
                <button
                  type="submit"
                  disabled={!canSubmit || submitting || !!conflict}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Redirection vers le paiement...' : 'Procéder au paiement'}
                </button>
              </div>
            </form>

            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 sticky top-24">
                <h2 className="font-playfair text-2xl font-bold text-l_black mb-4">Récapitulatif</h2>
                
                {/* Cart Items List */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {activeItems.map((item) => {
                    const thumbnailPath = item.product?.thumbnailUrl || item.product?.thumbnail;
                    const imageUrl = thumbnailPath ? buildImageUrl(thumbnailPath) : null;
                    const unitPrice = item.product?.unitPrice ?? item.product?.price ?? 0;
                    const formattedPrice = typeof unitPrice === 'string' ? unitPrice : unitPrice.toFixed(2);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={item.product?.title || 'Produit'} 
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package size={18} className="text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-montserrat text-sm font-medium text-l_black truncate">
                            {item.product?.title || 'Product'}
                          </p>
                          <p className="font-montserrat text-xs text-gray-600">
                            Qté : {item.quantity} × ${formattedPrice}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span className="font-montserrat text-sm text-gray-600">Articles</span>
                  <span className="font-montserrat text-sm font-semibold text-l_black">{activeItems.length} / {cartItems.length}</span>
                </div>
                {hasUnavailable && (
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-montserrat text-xs font-semibold text-amber-800">
                          {inactiveItems.length} produit{inactiveItems.length > 1 ? 's' : ''} indisponible{inactiveItems.length > 1 ? 's' : ''}
                        </p>
                        <p className="font-montserrat text-xs text-amber-700 mt-0.5">
                          {activeItems.length > 0 
                            ? 'Sera retiré lors de la validation.'
                            : 'Aucun produit disponible.'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                  <span className="font-playfair text-xl font-bold text-l_black">Total</span>
                  <span className="font-playfair text-2xl font-bold text-brandRed">${total.toFixed(2)}</span>
                </div>
                <div className="mt-4 text-xs text-gray-500 font-montserrat">
                  En passant votre commande, vous acceptez que votre panier puisse être mis à jour si les produits ont changé.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
