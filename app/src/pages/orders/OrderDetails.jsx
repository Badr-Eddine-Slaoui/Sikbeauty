"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@/utils/react-router-dom';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { ArrowLeft, Package, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react';
import ClientNavbar from '../../components/Client/ClientNavbar';
import Image from 'next/image';

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
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'PAID': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'DELIVERED': return 'Livré';
      case 'PAID': return 'Payé';
      case 'CANCELLED': return 'Annulé';
      default: return 'En attente';
    }
  };

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed mx-auto"></div>
        </div>
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <ClientNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-16 p-4">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error || 'Commande introuvable'}</p>
            <button onClick={() => navigate('/profile?tab=orders')} className="bg-brandRed text-white px-6 py-2 rounded-lg font-bold">Retour</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-8 mt-16">
        <div className="max-w-5xl mx-auto px-4">
          <button onClick={() => navigate('/profile?tab=orders')} className="flex items-center gap-2 text-gray-600 hover:text-brandRed mb-6 font-montserrat transition-colors">
            <ArrowLeft size={20} /><span>Retour aux commandes</span>
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold font-playfair mb-1">Commande #{order.id}</h1>
                <p className="text-sm text-gray-500 font-montserrat">Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-600"><CreditCard size={18} /><span className="text-sm">Payé par {order.paymentMethod || 'Carte'}</span></div>
              <p className="text-2xl font-bold text-brandRed font-playfair">${((order.totalPrice || 0) / 100).toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-playfair text-xl font-bold mb-6">Articles</h2>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border rounded-xl hover:border-brandRed/30 transition-colors">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      <Image src={item.product?.images?.[0] || '/placeholder.png'} alt={item.product?.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500 mb-2">{item.product?.category?.name}</p>
                      <div className="flex justify-between items-end">
                        <span className="text-sm text-gray-600">Qté: {item.quantity}</span>
                        <p className="font-bold text-brandRed">${((item.unitPrice * item.quantity) / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-playfair text-xl font-bold mb-4">Livraison</h2>
                {order.orderAddress?.[0] && (
                  <div className="space-y-3 font-montserrat text-sm text-gray-600">
                    <p className="font-bold text-gray-900">{order.orderAddress[0].fullName}</p>
                    <p>{order.orderAddress[0].addressLine1}</p>
                    <p>{order.orderAddress[0].city}, {order.orderAddress[0].postalCode}</p>
                    <p>{order.orderAddress[0].country}</p>
                    <div className="pt-2 flex items-center gap-2 text-brandRed"><Phone size={14} /><span>{order.orderAddress[0].phoneCountryCode} {order.orderAddress[0].phoneNumber}</span></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
