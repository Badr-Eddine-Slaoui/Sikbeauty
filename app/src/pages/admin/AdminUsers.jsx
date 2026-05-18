"use client";
import React, { useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../../config/api';
import toast from 'react-hot-toast';
import { Eye, X, Search } from 'lucide-react';
import Pagination from '../../components/Admin/Pagination';


export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '5',
        ...(searchQuery && { search: searchQuery })
      });
      const response = await api.get(`${API_ENDPOINTS.ADMIN.USERS.GET_ALL}?${params}`);
      setUsers(response.data.data || []);
      setPagination({
        currentPage: response.data.pageInfo?.currentPage || 1,
        totalPages: response.data.pageInfo?.totalPages || 1,
        totalItems: response.data.pageInfo?.totalItems || 0,
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Échec du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const fetchUserOrders = async (userId) => {
    try {
      setLoadingOrders(true);
      const response = await api.get(API_ENDPOINTS.ADMIN.USERS.GET_USER_ORDERS(userId));
      setUserOrders(response.data);
    } catch (err) {
      console.error('Error fetching user orders:', err);
      toast.error(err.response?.data?.message || 'Échec du chargement des commandes');
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleViewOrders = async (user) => {
    setSelectedUser(user);
    setUserOrders(null);
    await fetchUserOrders(user.id);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserOrders(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Utilisateurs ({pagination.totalItems})
              </h2>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Liste de tous les utilisateurs (hors administrateurs)
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, email, pays..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brandRed/30"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Rechercher
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Nom complet
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Téléphone
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Commandes
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {user.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {user.phoneCountryCode} {user.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {user.country}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-brandRed/10 text-brandRed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {user.orderCount} commande{user.orderCount !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleViewOrders(user)}
                      className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                      disabled={user.orderCount === 0}
                    >
                      <Eye size={16} />
                      Voir commandes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Aucun utilisateur trouvé
            </p>
          </div>
        )}

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={fetchUsers}
        />
      </div>

      {/* Orders Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Commandes de {selectedUser.fullName}
                </h3>
                <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {selectedUser.email}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingOrders ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed"></div>
                </div>
              ) : userOrders && userOrders.orders && userOrders.orders.length > 0 ? (
                <div className="space-y-4">
                  {userOrders.orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Commande #{order.id}
                          </h4>
                          <p className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'DELIVERED' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {order.status}
                          </span>
                          <p className="text-lg font-bold text-brandRed mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            €{order.totalPrice}
                          </p>
                        </div>
                      </div>

                      {order.orderAddress && order.orderAddress.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-gray-700 mb-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>Adresse de livraison:</p>
                          <p className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {order.orderAddress[0].street}, {order.orderAddress[0].city}, {order.orderAddress[0].state} {order.orderAddress[0].postalCode}, {order.orderAddress[0].country}
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Produits:</p>
                        {order.order_items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                {item.product.title}
                              </p>
                              <p className="text-xs text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                                Qté: {item.quantity} × €{item.unitPrice}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Aucune commande trouvée pour cet utilisateur
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

