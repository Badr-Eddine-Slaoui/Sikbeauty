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
import Image from 'next/image';
import { COUNTRY_PHONE_CODES, validatePhoneForCode } from '../../utils/countryCodes';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const cartItems = cart?.items || cart?.result || [];
  const hasUnavailableItems = cartItems.some((item) => item?.product?.status !== true);
  const total = getTotal();

  const isPhoneValid = useMemo(() => {
    return address.phoneNumber ? validatePhoneForCode(address.phoneCountryCode, address.phoneNumber) : null;
  }, [address.phoneCountryCode, address.phoneNumber]);

  const canSubmit = useMemo(() => {
    if (cartItems.length === 0 || activeItems.length === 0) return false;
    return (
      address.fullName.trim().length >= 3 &&
      address.email.trim().length >= 3 &&
      isPhoneValid &&
      address.street.trim().length >= 3 &&
      address.city.trim().length >= 2 &&
      address.country.trim().length >= 2
    );
  }, [address, cartItems.length, activeItems.length, isPhoneValid]);

  const onChange = (key) => (e) => {
    setAddress((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const createOrder = async () => {
    const payload = { ...address };
    return await api.post(API_ENDPOINTS.ORDERS.CREATE, payload);
  };

  const validateCart = async () => {
    return await api.post(API_ENDPOINTS.CHECKOUT.VALIDATE);
  };

  const proceedToPayment = async (orderId) => {
    try {
      const response = await api.post(API_ENDPOINTS.PAYMENT.CREATE_CHECKOUT_SESSION, { orderId });
      if (response.data?.url) {
        window.location.href = response.data.url;
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
    if (e && e.preventDefault) e.preventDefault();
    if (!canSubmit) return;

    // Validate phone number
    if (!validatePhoneForCode(address.phoneCountryCode, address.phoneNumber)) {
      toast.error("Numéro de téléphone invalide pour ce code de pays");
      return;
    }

    setSubmitting(true);
    setConflict(null);

    try {
      await validateCart();
      const orderResponse = await createOrder();
      const orderId = orderResponse.data?.data?.id || orderResponse.data?.id;
      if (!orderId) throw new Error('ID de commande non reçu');
      toast.success('Commande créée, redirection vers le paiement...');
      await proceedToPayment(orderId);
    } catch (err) {
      if (err?.response?.status === 409) {
        setConflict(err.response.data);
      } else {
        toast.error(err?.response?.data?.message || 'Échec de la création de la commande');
      }
      setSubmitting(false);
    }
  };

  const handleResolveConflict = async (accept) => {
    setSubmitting(true);
    try {
      await api.post(API_ENDPOINTS.CHECKOUT.ACCEPT, { accept });
      if (accept) {
        await fetchCart();
        handleSubmit({ preventDefault: () => {} });
      } else {
        navigate('/cart');
      }
    } catch (err) {
      toast.error('Échec de la résolution du conflit');
      setSubmitting(false);
    }
  };

  if (loading) return <><ClientNavbar /><PageLoader label="Chargement..." /></>;

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <><ClientNavbar />
        <div className="min-h-screen bg-brandWhite flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm text-center">
            <h1 className="font-playfair text-3xl font-bold mb-4">Paiement</h1>
            <p className="text-gray-600 mb-8 font-montserrat">Votre panier est vide.</p>
            <Link to="/client/products" className="bg-brandRed text-white px-8 py-3 rounded-full font-bold">Continuer mes achats</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen mt-10 bg-brandWhite py-10">
        <div className="max-w-5xl mx-auto px-4">
          <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-brandBrown hover:text-brandRed mb-6 font-montserrat">
            <ArrowLeft size={20} /><span>Retour</span>
          </button>

          <h1 className="font-playfair text-3xl font-bold mb-8">Paiement</h1>

          {conflict && (
            <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-6">
              <h2 className="font-playfair text-xl font-bold mb-2">Conflit de panier détecté</h2>
              <p className="text-gray-600 mb-6 font-montserrat">{conflict.message || 'Le prix ou le stock a changé.'}</p>
              <div className="flex gap-4">
                <button onClick={() => handleResolveConflict(true)} className="bg-brandRed text-white px-6 py-2 rounded-lg font-bold">Accepter</button>
                <button onClick={() => handleResolveConflict(false)} className="bg-white border border-gray-300 px-6 py-2 rounded-lg font-bold">Annuler</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="font-playfair text-xl font-bold mb-6">Adresse de livraison</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold block mb-1">Nom Complet</label>
                    <input value={address.fullName} onChange={onChange('fullName')} className="w-full border rounded-lg p-3" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold block mb-1">Email</label>
                    <input value={address.email} onChange={onChange('email')} type="email" className="w-full border rounded-lg p-3" required />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex gap-2">
                      <select value={address.phoneCountryCode} onChange={onChange('phoneCountryCode')} className="w-40 border rounded-lg p-3 bg-white cursor-pointer text-sm">
                        {COUNTRY_PHONE_CODES.map((c) => (
                          <option key={`${c.country}-${c.code}`} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <input 
                        value={address.phoneNumber} 
                        onChange={onChange('phoneNumber')} 
                        className={`flex-1 border rounded-lg p-3 text-sm focus:outline-none transition-colors ${
                          address.phoneNumber
                            ? isPhoneValid
                              ? "border-emerald-500 focus:border-emerald-600 text-emerald-950"
                              : "border-rose-500 focus:border-rose-600 text-rose-950"
                            : "border-gray-200/80 focus:border-brandRed"
                        }`} 
                        placeholder="Téléphone" 
                        required 
                      />
                    </div>
                    {address.phoneNumber && (
                      <div className="mt-1 text-xs font-montserrat">
                        {isPhoneValid ? (
                          <span className="text-emerald-600 flex items-center gap-1">✓ Numéro de téléphone valide</span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">✗ Numéro de téléphone invalide pour ce pays</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-bold block mb-1">Rue</label>
                    <input value={address.street} onChange={onChange('street')} className="w-full border rounded-lg p-3" required />
                  </div>
                  <input value={address.city} onChange={onChange('city')} placeholder="Ville" className="border rounded-lg p-3" required />
                  <input value={address.state} onChange={onChange('state')} placeholder="Région" className="border rounded-lg p-3" required />
                  <input value={address.postalCode} onChange={onChange('postalCode')} placeholder="Code Postal" className="border rounded-lg p-3" />
                  <input value={address.country} onChange={onChange('country')} placeholder="Pays" className="border rounded-lg p-3" required />
                </div>
                <button type="submit" disabled={!canSubmit || submitting} className="w-full mt-8 bg-brandRed text-white py-4 rounded-xl font-bold text-lg disabled:bg-gray-300">
                  {submitting ? 'Traitement...' : `Payer $${total.toFixed(2)}`}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="font-playfair text-xl font-bold mb-4">Récapitulatif</h2>
                <div className="space-y-4 mb-6">
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                        <Image 
                          src={buildImageUrl(item.product?.thumbnailUrl) || '/placeholder.png'} 
                          alt={item.product?.title || 'Produit'}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.product?.title}</p>
                        <p className="text-xs text-gray-500">Qté: {item.quantity} × ${item.product?.finalPrice || item.product?.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600"><span className="font-montserrat">Sous-total</span><span>${total.toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t"><span>Total</span><span className="text-brandRed">${total.toFixed(2)}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
