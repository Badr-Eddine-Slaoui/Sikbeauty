"use client";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "@/utils/react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Filter, Package, House, ChevronDown, SlidersHorizontal, UserCircle, Heart, ShoppingBag, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import Logo from "../../assets/Logo/SI-K-Beauty-logo.png";
import Image from "next/image";

function ClientNavbar({ 
  searchTerm = "", 
  onSearchChange = () => {}, 
  categories = [], 
  selectedCategory = null, 
  onCategoryChange = () => {},
  priceFilter = "all",
  onPriceFilterChange = () => {},
  sortBy = "default",
  onSortByChange = () => {},
  cartCount 
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getItemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const canSearchAndFilter = location.pathname.startsWith("/client/products");
  
  // Use cart count from context if not provided as prop
  const displayCartCount = cartCount !== undefined ? cartCount : getItemCount();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navbar */}
        <div className="flex items-center justify-between py-2 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <Image
              src={Logo}
              alt="SI-K-Beauty-logo"
              width={48}
              height={48}
              style={{ height: 'auto' }}
              className="object-contain"
            />
          </Link>

          {/* Mobile Search & Filter - Inline */}
          {canSearchAndFilter && (
            <div className="flex md:hidden flex-1 items-center gap-2 mx-2">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:border-brandRed focus:outline-none focus:bg-white transition-all"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              
              {/* Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className={`p-2 rounded-full transition-all ${
                  selectedCategory !== null || priceFilter !== 'all' || sortBy !== 'default'
                    ? 'bg-brandRed text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
                aria-label="Filtrer"
              >
                <SlidersHorizontal size={18} />
              </button>
            </div>
          )}

          {/* Search Bar - Desktop */}
          {canSearchAndFilter && (
            <div className="hidden lg:flex flex-1 max-w-2xl mx-6 xl:mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="w-full pl-12 pr-4 py-2 border-2 border-gray-200 focus:border-brandRed focus:outline-none transition-colors"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Filter Dropdown - Desktop */}
          {canSearchAndFilter && (
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 border-2 transition-colors ${
                  selectedCategory !== null
                    ? 'border-brandRed text-brandRed bg-brandRed/5'
                    : 'border-gray-200 text-gray-700 hover:border-brandRed'
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                <Filter size={18} />
                <span className="text-sm font-medium">Filtrer</span>
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsFilterOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white shadow-xl border-2 border-gray-100 z-50 max-h-96 overflow-y-auto">
                    <div className="p-4 space-y-4">
                    {/* Categories Section */}
                    <div>
                      <h3
                        className="text-sm font-semibold mb-3 text-gray-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Catégories
                      </h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            onCategoryChange(null);
                            setIsFilterOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                            selectedCategory === null
                              ? 'bg-brandRed text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Tous les produits
                        </button>
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => {
                              onCategoryChange(category.id);
                              setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                              selectedCategory === category.id
                                ? 'bg-brandRed text-white'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Filter Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3
                        className="text-sm font-semibold mb-3 text-gray-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Prix
                      </h3>
                      <select
                        value={priceFilter}
                        onChange={(e) => onPriceFilterChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent font-montserrat text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <option value="all">Tous les prix</option>
                        <option value="under-25">Moins de 25$</option>
                        <option value="25-50">25$ - 50$</option>
                        <option value="50-100">50$ - 100$</option>
                        <option value="over-100">Plus de 100$</option>
                      </select>
                    </div>

                    {/* Sort Section */}
                    <div className="border-t border-gray-200 pt-4">
                      <h3
                        className="text-sm font-semibold mb-3 text-gray-800"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        Trier par
                      </h3>
                      <select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent font-montserrat text-sm"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <option value="default">Par défaut</option>
                        <option value="price-low">Prix: Croissant</option>
                        <option value="price-high">Prix: Décroissant</option>
                        <option value="name-asc">Nom: A-Z</option>
                        <option value="name-desc">Nom: Z-A</option>
                      </select>
                    </div>
                  </div>
                  </div>
                </>
              )}
            </div>
          )}


          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop Nav Actions */}
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <House size={18} className="text-brandRed" />
                Accueil
              </Link>

              <Link
                to="/client/products"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Package size={18} className="text-brandRed" />
                Produits
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors relative"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <ShoppingCart size={18} className="text-brandRed" />
                Panier
                {displayCartCount > 0 && (
                  <span className="ml-1 bg-brandRed text-white text-xs font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                    {displayCartCount > 9 ? '9+' : displayCartCount}
                  </span>
                )}
              </Link>

              {/* Profil with Dropdown */}
              <div className="relative">
                <button
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  aria-label="Profil"
                  type="button"
                >
                  <User size={18} className="text-brandRed" />
                  Profil
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

              {/* Profil Dropdown - Desktop */}
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl border border-gray-100 z-50 rounded-2xl overflow-hidden">
                    <div className="p-2">
                      {user && (
                        <div className="px-3 py-3 border-b border-gray-100 mb-1">
                          <p
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {user.fullName}
                          </p>
                          <p
                            className="text-xs text-gray-500"
                            style={{ fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {user.email}
                          </p>
                        </div>
                      )}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <UserCircle size={18} className="text-brandRed" />
                        Mon Profil
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <ShoppingBag size={18} className="text-brandRed" />
                        Mes Commandes
                      </Link>
                      <Link
                        to="/profile?tab=liked"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        <Heart size={18} className="text-brandRed" />
                        Mes Favoris
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <LogOut size={18} />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            </nav>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-brandBrown" />
              ) : (
                <Menu size={24} className="text-brandBrown" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Filter Dropdown Panel */}
        {canSearchAndFilter && isMobileFilterOpen && (
          <div className="lg:hidden border-t border-gray-100 px-4 py-3 bg-white">
            <div className="space-y-3">
              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Catégories</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedCategory === null
                        ? 'bg-brandRed text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    Tous
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => onCategoryChange(category.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === category.id
                          ? 'bg-brandRed text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price & Sort */}
              <div className="flex gap-3">
                <select
                  value={priceFilter}
                  onChange={(e) => onPriceFilterChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brandRed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="all">Tous les prix</option>
                  <option value="under-25">- 25$</option>
                  <option value="25-50">25-50$</option>
                  <option value="50-100">50-100$</option>
                  <option value="over-100">+ 100$</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => onSortByChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brandRed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="default">Trier: Défaut</option>
                  <option value="price-low">Prix ↑</option>
                  <option value="price-high">Prix ↓</option>
                  <option value="name-asc">A-Z</option>
                  <option value="name-desc">Z-A</option>
                </select>
              </div>
              
              {/* Reset */}
              {(selectedCategory !== null || priceFilter !== 'all' || sortBy !== 'default') && (
                <button
                  onClick={() => {
                    onCategoryChange(null);
                    onPriceFilterChange('all');
                    onSortByChange('default');
                    setIsMobileFilterOpen(false);
                  }}
                  className="w-full py-2 text-xs font-medium text-brandRed bg-brandRed/10 rounded-lg"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Menu (Fullscreen) */}
        <div
          className={`fixed inset-0 top-0 left-0 w-full h-screen bg-white lg:hidden overflow-y-auto transition-all duration-300 ease-out ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
          style={{ zIndex: 100 }}
        >
          {/* Header with Logo and Close */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Image src={Logo} alt="SI-K-Beauty-logo" width={40} height={40} style={{ height: 'auto' }} className="object-contain" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fermer le menu"
            >
              <X size={28} className="text-brandRed" />
            </button>
          </div>
          
          <div className="px-6 py-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 bg-gray-50 hover:bg-brandRed hover:text-white rounded-xl transition-all duration-300 group"
              >
                <House size={22} className="text-brandRed group-hover:text-white transition-colors" />
                <span className="text-base font-medium text-gray-800 group-hover:text-white transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Accueil
                </span>
              </Link>
              <Link
                to="/client/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 bg-gray-50 hover:bg-brandRed hover:text-white rounded-xl transition-all duration-300 group"
              >
                <Package size={22} className="text-brandRed group-hover:text-white transition-colors" />
                <span className="text-base font-medium text-gray-800 group-hover:text-white transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Produits
                </span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between gap-3 px-4 py-4 bg-gray-50 hover:bg-brandRed rounded-xl transition-all duration-300 group"
              >
                <span className="flex items-center gap-3">
                  <ShoppingCart size={22} className="text-brandRed group-hover:text-white transition-colors" />
                  <span className="text-base font-medium text-gray-800 group-hover:text-white transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Panier
                  </span>
                </span>
                {displayCartCount > 0 && (
                  <span className="bg-brandRed group-hover:bg-white group-hover:text-brandRed text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center transition-colors">
                    {displayCartCount > 9 ? '9+' : displayCartCount}
                  </span>
                )}
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 bg-gray-50 hover:bg-brandRed rounded-xl transition-all duration-300 group"
              >
                <User size={22} className="text-brandRed group-hover:text-white transition-colors" />
                <span className="text-base font-medium text-gray-800 group-hover:text-white transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Profil
                </span>
              </Link>
            </div>

            {canSearchAndFilter && (
              <>
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Rechercher un produit..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-brandRed focus:outline-none transition-colors text-base"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3
                      className="text-sm font-semibold mb-2 text-gray-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Catégories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => {
                          onCategoryChange(null);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`px-3 py-1 text-sm transition-colors ${
                          selectedCategory === null
                            ? 'bg-brandRed text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Tous
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            onCategoryChange(category.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`px-3 py-1 text-sm transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-brandRed text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-semibold mb-2 text-gray-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Prix
                    </h3>
                    <select
                      value={priceFilter}
                      onChange={(e) => onPriceFilterChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <option value="all">Tous les prix</option>
                      <option value="under-25">Moins de 25$</option>
                      <option value="25-50">25$ - 50$</option>
                      <option value="50-100">50$ - 100$</option>
                      <option value="over-100">Plus de 100$</option>
                    </select>
                  </div>

                  <div>
                    <h3
                      className="text-sm font-semibold mb-2 text-gray-800"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      Trier par
                    </h3>
                    <select
                      value={sortBy}
                      onChange={(e) => onSortByChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent text-sm"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <option value="default">Par défaut</option>
                      <option value="price-low">Prix: Croissant</option>
                      <option value="price-high">Prix: Décroissant</option>
                      <option value="name-asc">Nom: A-Z</option>
                      <option value="name-desc">Nom: Z-A</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {user && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="mb-4">
                  <p
                    className="text-base font-semibold text-gray-800"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {user.fullName}
                  </p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <Link
                    to="/profile?tab=orders"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-brandRed hover:text-white rounded-xl transition-all duration-300 group"
                  >
                    <ShoppingBag size={20} className="text-brandRed group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-800 group-hover:text-white transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Mes Commandes
                    </span>
                  </Link>
                  <Link
                    to="/profile?tab=liked"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-brandRed hover:text-white rounded-xl transition-all duration-300 group"
                  >
                    <Heart size={20} className="text-brandRed group-hover:text-white transition-colors" />
                    <span className="text-sm font-medium text-gray-800 group-hover:text-white transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Mes Favoris
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-300"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default ClientNavbar;

