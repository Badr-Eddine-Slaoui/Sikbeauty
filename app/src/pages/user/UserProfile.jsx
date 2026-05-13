"use client";
import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { User, Mail, Phone, MapPin, Heart, ShoppingBag, Calendar, Package } from 'lucide-react';
import { useNavigate, useSearchParams } from '@/utils/react-router-dom';
import ClientNavbar from '../../components/Client/ClientNavbar';

export default function UserProfile() {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [likedProducts, setLikedProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // Fetch profile data
      const profileRes = await api.get(API_ENDPOINTS.USER.PROFILE);
      setProfile(profileRes.data.data);
      
      // Fetch liked products
      try {
        const likedRes = await api.get(API_ENDPOINTS.USER.LIKED_PRODUCTS);
        setLikedProducts(likedRes.data.data);
      } catch (likedErr) {
        console.error('Error fetching liked products:', likedErr);
        setLikedProducts([]);
      }
      
      // Fetch orders
      try {
        const ordersRes = await api.get(API_ENDPOINTS.USER.ORDERS);
        setOrders(ordersRes.data.data || []);
      } catch (ordersErr) {
        console.error('Error fetching orders:', ordersErr);
        console.error('Orders error details:', ordersErr.response?.data);
        setOrders([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError('Échec du chargement des données du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLikedProduct = async (productId) => {
    try {
      await api.delete(API_ENDPOINTS.USER.REMOVE_LIKED_PRODUCT(productId));
      setLikedProducts(likedProducts.filter(item => item.product.id !== productId));
    } catch (err) {
      console.error('Error removing liked product:', err);
      alert('Échec de la suppression du produit');
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b5483a] mx-auto"></div>
          <p className="mt-4 text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Chargement...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-[#b5483a] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {profile?.fullName}
              </h1>
              <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Membre depuis {new Date(profile?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'info'
                    ? 'border-[#b5483a] text-[#b5483a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <User className="w-4 h-4 inline mr-2" />
                Informations
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'orders'
                    ? 'border-[#b5483a] text-[#b5483a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ShoppingBag className="w-4 h-4 inline mr-2" />
                Mes Commandes
              </button>
              <button
                onClick={() => setActiveTab('liked')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'liked'
                    ? 'border-[#b5483a] text-[#b5483a]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Produits Aimés ({likedProducts.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <Mail className="w-5 h-5 text-[#b5483a] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Email
                      </p>
                      <p className="text-gray-800 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {profile?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-[#b5483a] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Téléphone
                      </p>
                      <p className="text-gray-800 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {profile?.phoneCountryCode} {profile?.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#b5483a] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Pays
                      </p>
                      <p className="text-gray-800 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {profile?.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="w-5 h-5 text-[#b5483a] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Date d'inscription
                      </p>
                      <p className="text-gray-800 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {new Date(profile?.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Vous n'avez pas encore de commandes
                    </p>
                    <button
                      onClick={() => navigate('/client/products')}
                      className="mt-4 px-6 py-2 bg-[#b5483a] text-white rounded-lg hover:bg-[#9a3d31] transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Découvrir nos produits
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                              Commande #{order.id}
                            </h3>
                            <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                              order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {order.status === 'DELIVERED' ? 'Livré' :
                               order.status === 'PAID' ? 'Payé' :
                               order.status === 'CANCELLED' ? 'Annulé' :
                               'En attente'}
                            </span>
                          </div>
                        </div>
                        <div className="border-t border-gray-100 pt-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {order.order_items?.length || 0} article{(order.order_items?.length || 0) > 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-[#b5483a]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                €{((order.totalPrice || 0) / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/orders/${order.id}`)}
                            className="mt-4 w-full px-4 py-2 border border-[#b5483a] text-[#b5483a] rounded-lg hover:bg-[#b5483a] hover:text-white transition-colors"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            Voir les détails
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'liked' && (
              <div>
                {likedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Vous n'avez pas encore de produits aimés
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedProducts.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        <div 
                          className="relative cursor-pointer"
                          onClick={() => handleProductClick(item.product.id)}
                        >
                          <img
                            src={item.product.thumbnailUrl}
                            alt={item.product.title}
                            className="w-full h-48 object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveLikedProduct(item.product.id);
                            }}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                          >
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 
                            className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-[#b5483a]"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                            onClick={() => handleProductClick(item.product.id)}
                          >
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {item.product.category.name}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xl font-bold text-[#b5483a]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              €{item.product.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              Ajouté le {new Date(item.likedAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
