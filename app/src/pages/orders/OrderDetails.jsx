"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@/utils/react-router-dom';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { ArrowLeft, Package, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react';
import ClientNavbar from '../../components/Client/ClientNavbar';

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.USER.ORDER_BY_ID(orderId));
      setOrder(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError('Échec du chargement des détails de la commande');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'PAID':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'Livré';
      case 'PAID':
        return 'Payé';
      case 'CANCELLED':
        return 'Annulé';
      default:
        return 'En attente';
    }
  };

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b5483a] mx-auto"></div>
            <p className="mt-4 text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Chargement...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-16">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-red-600 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              {error || 'Commande introuvable'}
            </p>
            <button
              onClick={() => navigate('/profile?tab=orders')}
              className="px-6 py-2 bg-[#b5483a] text-white rounded-lg hover:bg-[#9a3d31] transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Retour aux commandes
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/profile?tab=orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#b5483a] mb-6 transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <ArrowLeft size={20} />
            Retour aux commandes
          </button>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Commande #{order.id}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {getStatusText(order.status)}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <CreditCard size={20} />
                  <span className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Méthode de paiement: {order.paymentMethod || 'Carte bancaire'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Total
                  </p>
                  <p className="text-2xl font-bold text-[#b5483a]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    €{((order.totalPrice || 0) / 100).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Articles commandés
                </h2>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="w-20 h-20 flex-shrink-0">
                        <img
                          src={item.product?.images?.[0] || '/placeholder.png'}
                          alt={item.product?.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {item.product?.category?.name}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            Quantité: {item.quantity}
                          </span>
                          <span className="text-sm font-medium text-[#b5483a]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            €{((item.unitPrice || 0) / 100).toFixed(2)} / unité
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          €{(((item.unitPrice || 0) * item.quantity) / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Informations client
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#b5483a] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Email
                      </p>
                      <p className="text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {order.user?.email}
                      </p>
                    </div>
                  </div>
                  {order.user?.phoneNumber && (
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-[#b5483a] mt-1" />
                      <div>
                        <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Téléphone
                        </p>
                        <p className="text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {order.user.phoneCountryCode} {order.user.phoneNumber}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Delivery Address */}
              {order.orderAddress && order.orderAddress.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Adresse de livraison
                  </h2>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#b5483a] mt-1" />
                    <div>
                      <p className="text-gray-800 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {order.orderAddress[0].fullName}
                      </p>
                      <p className="text-gray-600 text-sm mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {order.orderAddress[0].addressLine1}
                      </p>
                      {order.orderAddress[0].addressLine2 && (
                        <p className="text-gray-600 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {order.orderAddress[0].addressLine2}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {order.orderAddress[0].city}, {order.orderAddress[0].postalCode}
                      </p>
                      <p className="text-gray-600 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {order.orderAddress[0].country}
                      </p>
                      {order.orderAddress[0].phoneNumber && (
                        <p className="text-gray-600 text-sm mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          Tel: {order.orderAddress[0].phoneCountryCode} {order.orderAddress[0].phoneNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
