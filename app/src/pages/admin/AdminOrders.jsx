"use client";
import React, { useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../../config/api';
import { Package, User, MapPin, Calendar, DollarSign, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewingDetails, setViewingDetails] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    fetchOrders(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_ALL(page, pagination.pageSize));
      setOrders(response.data.data || []);
      setPagination(response.data.pageInfo || pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.ORDERS.GET_BY_ID(orderId));
      setSelectedOrder(response.data);
      setViewingDetails(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch order details');
      console.error('Error fetching order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (viewingDetails && selectedOrder) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => {
            setViewingDetails(false);
            setSelectedOrder(null);
          }}
          className="flex items-center gap-2 text-brandRed hover:text-brandBrown transition-colors"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <ChevronLeft size={20} />
          Retour aux commandes
        </button>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Commande #{selectedOrder.id}
              </h2>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {formatDate(selectedOrder.createdAt)}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
              {selectedOrder.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="text-brandRed" size={20} />
                <h3 className="font-semibold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Client
                </h3>
              </div>
              <p className="text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {selectedOrder.user?.fullName || 'N/A'}
              </p>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {selectedOrder.user?.email || 'N/A'}
              </p>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {selectedOrder.user?.phoneCountryCode} {selectedOrder.user?.phoneNumber || 'N/A'}
              </p>
            </div>

            {/* Delivery Address */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-brandRed" size={20} />
                <h3 className="font-semibold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Adresse de livraison
                </h3>
              </div>
              {selectedOrder.orderAddress && (
                <div className="text-gray-700 text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <p>{selectedOrder.orderAddress.street}</p>
                  <p>{selectedOrder.orderAddress.city}, {selectedOrder.orderAddress.postalCode}</p>
                  <p>{selectedOrder.orderAddress.country}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Articles commandés
            </h3>
            <div className="space-y-3">
              {selectedOrder.order_items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {item.product?.title || 'Produit inconnu'}
                    </p>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Quantité: {item.quantity}
                    </p>
                    {item.discount > 0 && (
                      <p className="text-sm text-green-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Réduction: {item.discountType === 'PERCENTAGE' ? `${item.discount}%` : `€${item.discount}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      €{item.unitPrice}
                    </p>
                    {item.price !== item.unitPrice && (
                      <p className="text-sm text-gray-500 line-through" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        €{item.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t mt-6 pt-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Total
              </span>
              <span className="text-2xl font-bold text-brandRed" style={{ fontFamily: "'Playfair Display', serif" }}>
                €{selectedOrder.totalPrice}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Total des commandes
              </p>
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {pagination.totalItems}
              </p>
            </div>
            <Package className="text-brandRed" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Page actuelle
              </p>
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {pagination.currentPage} / {pagination.totalPages}
              </p>
            </div>
            <Calendar className="text-brandRed" size={40} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Par page
              </p>
              <p className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                {pagination.pageSize}
              </p>
            </div>
            <DollarSign className="text-brandRed" size={40} />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Chargement...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      <div className="text-sm text-gray-900">{order.user?.fullName || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{order.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      €{order.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => fetchOrderDetails(order.id)}
                        className="text-brandRed hover:text-brandBrown flex items-center gap-1 transition-colors"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <Eye size={16} />
                        Voir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div className="text-sm text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Affichage de {((pagination.currentPage - 1) * pagination.pageSize) + 1} à{' '}
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} sur{' '}
              {pagination.totalItems} commandes
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 border rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
