"use client";
import React, { useState, useEffect } from 'react';
import { api, API_ENDPOINTS } from '../../config/api';
import StatGrid from '../../components/Admin/StatGrid';
import TopSellingProducts from '../../components/Admin/TopSellingProducts';
import RecentActivities from '../../components/Admin/RecentActivities';
import QuickActions from '../../components/Admin/QuickActions';

export default function AdminOverview() {
  const [stats, setStats] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.ADMIN.DASHBOARD.GET_STATS);
      const data = response.data;

      // Format stats for StatGrid
      const formattedStats = [
        {
          title: 'Utilisateurs',
          value: data.users.totalUsers.toString(),
          sublabel: `${data.users.individualUsers} clients`,
          change: '',
          changeType: 'steady',
          badge: 'Communauté',
        },
        {
          title: 'Produits',
          value: data.products.totalProducts.toString(),
          sublabel: `${data.products.activeProducts} actifs, ${data.products.inactiveProducts} inactifs`,
          change: '',
          changeType: 'steady',
          badge: 'Inventaire',
        },
        {
          title: 'Catégories',
          value: data.categories.totalCategories.toString(),
          sublabel: `${data.categories.activeCategories} actives`,
          change: '',
          changeType: 'steady',
          badge: 'Organisation',
        },
        {
          title: 'Commandes',
          value: data.orders.totalOrders.toString(),
          sublabel: `${data.orders.pendingOrders} en attente`,
          change: '',
          changeType: data.orders.pendingOrders > 0 ? 'up' : 'steady',
          badge: 'Logistique',
        },
      ];

      // Remove revenue segments - not needed

      // Format top selling products by order count
      const formattedProducts = data.topSellingProducts.map(product => ({
        name: product.productTitle,
        category: product.categoryName,
        sales: `${product.orderCount} commandes`,
        revenue: `${product.totalQuantitySold} unités`,
        badge: 'Top vente',
        trend: '',
      }));

      // Format recent activities
      const formattedActivities = data.recentActivities.slice(0, 5).map(activity => ({
        label: `Commande #${activity.orderId} - ${activity.status} par ${activity.userName}`,
        time: new Date(activity.createdAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        }),
      }));

      setStats(formattedStats);
      setTopSellingProducts(formattedProducts);
      setRecentActivities(formattedActivities);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>{error}</p>
        <button
          onClick={fetchDashboardStats}
          className="mt-4 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="lg:col-span-2">
        <StatGrid stats={stats} />
      </div>
      <div>
        <TopSellingProducts products={topSellingProducts} />
      </div>
      <div>
        <RecentActivities activities={recentActivities} />
      </div>
    </div>
  );
}

