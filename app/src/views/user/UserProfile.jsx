"use client";
import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, MapPin, Heart, ShoppingBag, Calendar, Package } from 'lucide-react';
import { useNavigate, useSearchParams } from '@/utils/react-router-dom';
import ClientNavbar from '../../components/Client/ClientNavbar';
import Image from 'next/image';

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
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get(API_ENDPOINTS.USER.PROFILE);
      setProfile(profileRes.data.data);
      
      try {
        const likedRes = await api.get(API_ENDPOINTS.USER.LIKED_PRODUCTS);
        setLikedProducts(likedRes.data.data);
      } catch (e) { setLikedProducts([]); }
      
      try {
        const ordersRes = await api.get(API_ENDPOINTS.USER.ORDERS);
        setOrders(ordersRes.data.data || []);
      } catch (e) { setOrders([]); }
      
      setError(null);
    } catch (err) {
      setError('Échec du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLikedProduct = async (productId) => {
    try {
      await api.delete(API_ENDPOINTS.USER.REMOVE_LIKED_PRODUCT(productId));
      setLikedProducts(prev => prev.filter(item => item.product.id !== productId));
    } catch (err) {
      toast.error('Échec de la suppression du favori');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed"></div></div>;

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gray-50 py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 flex items-center gap-6">
            <div className="w-20 h-20 bg-brandRed rounded-full flex items-center justify-center shrink-0">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-playfair">{profile?.fullName}</h1>
              <p className="text-gray-500 font-montserrat">Membre depuis {new Date(profile?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b">
              {['info', 'orders', 'liked'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider transition-all border-b-2 ${
                    activeTab === tab ? 'border-brandRed text-brandRed bg-red-50/50' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'info' ? 'Profil' : tab === 'orders' ? 'Commandes' : `Favoris (${likedProducts.length})`}
                </button>
              ))}
            </div>

            <div className="p-8">
              {activeTab === 'info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-600"><Mail size={18} className="text-brandRed" /><span>{profile?.email}</span></div>
                    <div className="flex items-center gap-3 text-gray-600"><Phone size={18} className="text-brandRed" /><span>{profile?.phoneCountryCode} {profile?.phoneNumber}</span></div>
                    <div className="flex items-center gap-3 text-gray-600"><MapPin size={18} className="text-brandRed" /><span>{profile?.country}</span></div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-10"><Package className="mx-auto w-12 h-12 text-gray-300 mb-4" /><p className="text-gray-500">Aucune commande</p></div>
                  ) : (
                    orders.map(order => (
                      <div key={order.id} className="border rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-brandRed/30 transition-colors">
                        <div>
                          <p className="font-bold font-playfair text-lg">Commande #{order.id}</p>
                          <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="font-bold text-brandRed text-xl">${((order.totalPrice || 0) / 100).toFixed(2)}</p>
                          <button onClick={() => navigate(`/orders/${order.id}`)} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-brandRed mt-2">Détails</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'liked' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {likedProducts.map(item => (
                    <div key={item.id} className="group border rounded-2xl overflow-hidden hover:shadow-lg transition-all relative">
                      <div className="relative aspect-square cursor-pointer" onClick={() => navigate(`/products/${item.product.id}`)}>
                        <Image src={item.product.thumbnailUrl} alt={item.product.title} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <button onClick={() => handleRemoveLikedProduct(item.product.id)} className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-red-500 hover:bg-red-50 shadow-sm transition-colors"><Heart size={18} fill="currentColor" /></button>
                      <div className="p-4">
                        <h3 className="font-bold font-playfair truncate">{item.product.title}</h3>
                        <p className="text-brandRed font-bold mt-1">${item.product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  {likedProducts.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">Aucun favori</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
