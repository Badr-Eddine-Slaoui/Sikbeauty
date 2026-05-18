"use client";
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from '@/utils/react-router-dom';
import { LayoutDashboard, BarChart3, Package, FolderTree, FileText, Users, ShoppingBag } from 'lucide-react';
import AdminSidebar from '../../components/Admin/AdminSidebar';
import AdminHeader from '../../components/Admin/AdminHeader';
import AdminOverview from './AdminOverview';
import AdminReports from './AdminReports';
import AdminProducts from './AdminProducts';
import AdminCategories from './AdminCategories';
import AdminUsers from './AdminUsers';
import AdminBlogs from './AdminBlogs';
import AdminOrders from './AdminOrders';

const navLinks = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
  { id: 'reports', label: 'Rapports', icon: BarChart3 },
  { id: 'products', label: 'Produits', icon: Package },
  { id: 'categories', label: 'Catégories', icon: FolderTree },
  { id: 'blogs', label: 'Blogs', icon: FileText },
  { id: 'orders', label: 'Commandes', icon: ShoppingBag },
  { id: 'users', label: 'Utilisateurs', icon: Users },
];

const stats = [
  {
    title: 'Utilisateurs individuels',
    value: '12 480',
    sublabel: 'Clients actifs ce mois-ci',
    change: '+8,2%',
    changeType: 'up',
    badge: 'Communauté',
  },
  {
    title: 'Partenaires professionnels',
    value: '3 215',
    sublabel: 'Comptes professionnels vérifiés',
    change: '+4,5%',
    changeType: 'up',
    badge: 'Gros',
  },
  {
    title: 'Articles du catalogue',
    value: '152',
    sublabel: 'Disponibles et prêts à la vente',
    change: '5 faibles stocks',
    changeType: 'stable',
    badge: 'Inventaire',
  },
  {
    title: 'Commandes en attente',
    value: '87',
    sublabel: 'En attente de traitement',
    change: '-12%',
    changeType: 'down',
    badge: 'Logistique',
  },
];

const revenueSegments = [
  {
    label: 'Achats individuels',
    amount: '€38 500',
    progress: 80,
    trend: '+9,4% par an',
  },
  {
    label: 'Comptes professionnels',
    amount: '€21 400',
    progress: 62,
    trend: '+6,1% par an',
  },
  {
    label: 'Campagnes marketing',
    amount: '€9 750',
    progress: 44,
    trend: 'Maintenir la fidélité',
  },
];

const topSellingProducts = [
  {
    name: 'Sérum de radiance',
    category: 'Soins de la peau',
    sales: '1 240 unités',
    revenue: '€24 800',
    badge: 'Meilleur vendeur',
    trend: '+18%',
  },
  {
    name: 'Crème hydratante Velvet',
    category: 'Soins de la peau',
    sales: '980 unités',
    revenue: '€19 600',
    badge: 'Choix du personnel',
    trend: '+11%',
  },
  {
    name: 'Fond de teint Luminous',
    category: 'Maquillage',
    sales: '860 unités',
    revenue: '€17 200',
    badge: 'Tendance',
    trend: '+7%',
  },
];

const topReviewedProducts = [
  {
    name: 'Masque essentiel apaisant',
    category: 'Soins de la peau',
    reviews: 214,
    rating: 4.9,
  },
  {
    name: 'Toner Hydro Glow',
    category: 'Soins de la peau',
    reviews: 186,
    rating: 4.7,
  },
  {
    name: 'Baume à lèvres Silk Touch',
    category: 'Maquillage',
    reviews: 167,
    rating: 4.8,
  },
];

const recentActivities = [
  {
    label: 'Nouveau compte professionnel approuvé',
    time: 'Il y a 2 heures',
  },
  {
    label: 'Alerte d\'inventaire pour « Masque de boue purifiant »',
    time: 'Il y a 5 heures',
  },
  {
    label: 'Avis de produit signalé par un client',
    time: 'Hier',
  },
];

const quickActions = [
  {
    id: 'products',
    title: 'Gestion des produits',
    description: 'Créez, mettez à jour ou supprimez des produits pour maintenir un catalogue précis.',
    buttons: ['Créer un produit', 'Voir tous les produits'],
    icon: '▪',
  },
  {
    id: 'categories',
    title: 'Gestion des catégories',
    description: 'Organisez les lignes de produits et maintenez une hiérarchie de navigation claire.',
    buttons: ['Ajouter une catégorie', 'Gérer les catégories'],
    icon: '▪',
  },
  {
    id: 'users',
    title: 'Gestion des utilisateurs',
    description: 'Gérez les comptes individuels et professionnels, les rôles et les accès.',
    buttons: ['Inviter un partenaire professionnel', 'Gérer les utilisateurs'],
    icon: '▪',
  },
];

const reportHighlights = [
  {
    title: 'Chiffre d\'affaires mensuel',
    amount: '€69 650',
    change: '+12,4%',
    descriptor: 'Streams individuels et professionnels combinés',
  },
  {
    title: 'Valeur moyenne des commandes',
    amount: '€58,30',
    change: '+5,2%',
    descriptor: 'Augmentation due aux bundles et aux abonnements',
  },
  {
    title: 'Taux de retour',
    amount: '1,8%',
    change: '-0,6%',
    descriptor: 'Programmes de qualité réduisant les remboursements',
  },
];

const categorySummary = [
  {
    name: 'Soins de la peau',
    products: 64,
    allocation: '42%',
    trend: '+8%',
    progress: 82,
  },
  {
    name: 'Maquillage',
    products: 38,
    allocation: '25%',
    trend: '+5%',
    progress: 58,
  },
  {
    name: 'Soins des cheveux',
    products: 26,
    allocation: '17%',
    trend: '+3%',
    progress: 43,
  },
  {
    name: 'Accessoires',
    products: 24,
    allocation: '16%',
    trend: '+2%',
    progress: 37,
  },
];

const categoryAlerts = [
  {
    label: 'Mise à jour des kits saisonniers',
    description: 'Actualisez les bundles d\'automne avec de nouveaux actifs et tarifs.',
    time: 'Dans 4 jours',
  },
  {
    label: 'Révision de la conformité des ingrédients',
    description: 'Vérifiez les certificats des fournisseurs pour le catalogue professionnel.',
    time: 'Prévu la semaine prochaine',
  },
];

const userDistribution = [
  {
    segment: 'Acheteurs individuels',
    count: '12 480',
    change: '+8,2%',
    badge: 'Actifs',
  },
  {
    segment: 'Partenaires professionnels',
    count: '3 215',
    change: '+4,5%',
    badge: 'Croissance',
  },
  {
    segment: 'Approbations en attente',
    count: '48',
    change: '+5 nouveaux',
    badge: 'Action requise',
  },
];

const userActivities = [
  {
    label: '3 demandes de compte professionnel en attente de révision',
    time: 'Aujourd\'hui',
  },
  {
    label: 'Niveau d\'accès mis à jour pour le compte professionnel « Glow Studio »',
    time: 'Il y a 4 heures',
  },
  {
    label: 'Deux réinitialisations de mot de passe demandées par des clients',
    time: 'Il y a 8 heures',
  },
];

const sectionHeaders = {
  overview: {
    title: 'Vue d\'ensemble',
    subtitle: 'Gérez votre communauté, catalogue et revenus avec des métriques et actions rapides.',
    insight: 'Les segments individuels continuent de surpasser les partenaires professionnels.',
  },
  reports: {
    title: 'Rapports',
    subtitle: 'Analysez les revenus, la santé des commandes et les performances des campagnes.',
    insight: 'Les rapports automatisés s\'exécutent chaque nuit à 02h00 CET.',
  },
  products: {
    title: 'Produits',
    subtitle: 'Maintenez la précision du catalogue, les prix et les priorités de merchandising.',
    insight: 'Cinq produits ont un stock faible—vérifiez les paramètres de réapprovisionnement.',
  },
  categories: {
    title: 'Catégories',
    subtitle: 'Façonnez l\'expérience de navigation et assurez l\'alignement avec la stratégie de marque.',
    insight: 'Les catégories de premier niveau sont équilibrées—concentrez-vous sur les accessoires.',
  },
  blogs: {
    title: 'Blogs',
    subtitle: 'Créez et publiez des articles pour engager votre audience et partager des conseils beauté.',
    insight: 'Les articles réguliers améliorent le SEO et maintiennent l\'engagement client.',
  },
  orders: {
    title: 'Commandes',
    subtitle: 'Gérez toutes les commandes clients avec détails complets et statuts.',
    insight: 'Consultez les informations client, produits et adresses de livraison.',
  },
  users: {
    title: 'Utilisateurs',
    subtitle: 'Approuvez les partenaires professionnels et gérez les accès aux comptes.',
    insight: 'Les approbations en attente ont augmenté de 5 aujourd\'hui.',
  },
};

// Map URL paths to section IDs
const pathToSection = (pathname) => {
  if (pathname.includes('/products')) return 'products';
  if (pathname.includes('/reports')) return 'reports';
  if (pathname.includes('/categories')) return 'categories';
  if (pathname.includes('/blogs')) return 'blogs';
  if (pathname.includes('/orders')) return 'orders';
  if (pathname.includes('/users')) return 'users';
  if (pathname.includes('/overview') || pathname === '/admin/dashboard') return 'overview';
  return 'overview';
};

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeSection = pathToSection(location.pathname);
  const mainScrollRef = useRef(null);

  const currentHeader = sectionHeaders[activeSection] || sectionHeaders.overview;

  // Redirect exact /admin/dashboard to /admin/dashboard/overview
  useEffect(() => {
    if (location.pathname === '/admin/dashboard') {
      navigate('/admin/dashboard/overview', { replace: true });
    }
  }, [location.pathname, navigate]);

  // Scroll to top when pathname changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
    // Also scroll window in case it's needed
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [location.pathname]);

  const handleSectionChange = (sectionId) => {
    const basePath = '/admin/dashboard';
    const routes = {
      overview: `${basePath}/overview`,
      reports: `${basePath}/reports`,
      products: `${basePath}/products`,
      categories: `${basePath}/categories`,
      blogs: `${basePath}/blogs`,
      orders: `${basePath}/orders`,
      users: `${basePath}/users`,
    };
    navigate(routes[sectionId] || `${basePath}/overview`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'reports':
        return <AdminReports />;
      case 'products':
        return <AdminProducts />;
      case 'categories':
        return <AdminCategories />;
      case 'blogs':
        return <AdminBlogs />;
      case 'orders':
        return <AdminOrders />;
      case 'users':
        return <AdminUsers />;
      case 'overview':
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fef7f5] via-white to-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar
          navLinks={navLinks}
          activeSection={activeSection}
          onSelect={handleSectionChange}
        />

        <main ref={mainScrollRef} className="flex-1 lg:max-h-screen lg:overflow-y-auto">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 lg:px-6 lg:py-6 pt-16 lg:pt-4">
            <AdminHeader
              title={currentHeader.title}
              subtitle={currentHeader.subtitle}
              insight={currentHeader.insight}
              actions={currentHeader.actions}
            />

            <section className="space-y-4">
              {renderSection()}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;