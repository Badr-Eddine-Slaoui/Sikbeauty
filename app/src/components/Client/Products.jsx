"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { api } from "../../config/api";
import API_ENDPOINTS from "../../config/api";
import { Link } from "@/utils/react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import { useCart } from "../../contexts/CartContext";
import PageLoader from "../ui/PageLoader";
import './Products.css';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

export default function Products({ 
  searchQuery = "", 
  priceFilter = "all", 
  sortBy = "default",
  selectedCategory = null,
  onCategoriesLoaded,
  initialCategories = [],
  initialCategoryProducts = {}
}) {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState(initialCategories);
  const [categoryProducts, setCategoryProducts] = useState(initialCategoryProducts);
  const [loading, setLoading] = useState(initialCategories.length === 0);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';

  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}` : path;
  };

  useEffect(() => {
    if (initialCategories.length > 0) return;
    
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || []);
        const activeCategories = categoriesData.filter(cat => cat.isActive !== false);
        setCategories(activeCategories);
        if (onCategoriesLoaded) {
          onCategoriesLoaded(activeCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || "Erreur lors du chargement des catégories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [initialCategories, onCategoriesLoaded]);

  useEffect(() => {
    if (Object.keys(initialCategoryProducts).length > 0) return;
    if (categories.length === 0) return;

    const fetchCategoryProducts = async () => {
      const productsMap = {};
      try {
        const categoriesToFetch = selectedCategory 
          ? categories.filter(cat => cat.id === selectedCategory)
          : categories;

        const promises = categoriesToFetch.map(async (category) => {
          try {
            const response = await api.get(API_ENDPOINTS.CATEGORIES.PRODUCTS(category.id, 1, 100));
            productsMap[category.id] = response.data?.data || [];
          } catch (err) {
            console.error(`Error fetching products for category ${category.id}:`, err);
            productsMap[category.id] = [];
          }
        });

        await Promise.all(promises);
        setCategoryProducts(productsMap);
      } catch (err) {
        console.error("Error fetching category products:", err);
      }
    };

    fetchCategoryProducts();
  }, [categories, selectedCategory, initialCategoryProducts]);

  const getFilteredProducts = useMemo(() => {
    return (products) => {
      let filtered = [...products];
      if (searchQuery.trim()) {
        filtered = filtered.filter(product => {
          const title = product.title || '';
          const description = product.description || '';
          return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 description.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }
      if (priceFilter !== "all") {
        filtered = filtered.filter(product => {
          const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
          switch (priceFilter) {
            case "under-25": return price < 25;
            case "25-50": return price >= 25 && price <= 50;
            case "50-100": return price > 50 && price <= 100;
            case "over-100": return price > 100;
            default: return true;
          }
        });
      }
      if (sortBy !== "default") {
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
          const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
          switch (sortBy) {
            case "price-low": return priceA - priceB;
            case "price-high": return priceB - priceA;
            case "name-asc": return (a.title || "").localeCompare(b.title || "");
            case "name-desc": return (b.title || "").localeCompare(a.title || "");
            default: return 0;
          }
        });
      }
      return filtered;
    };
  }, [searchQuery, priceFilter, sortBy]);

  const getProductTitle = (product) => product.title || 'Produit sans nom';

  const toNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getDiscountValue = (product) => {
    const raw = product?.discount;
    if (product?.discountType === 'PRICE') return typeof raw === 'number' ? raw / 100 : toNumber(raw);
    if (product?.discountType === 'PERCENT') return toNumber(raw);
    return 0;
  };

  const calculateOldPrice = (product) => {
    const price = toNumber(product?.price ?? 0);
    const finalPrice = toNumber(product?.finalPrice ?? 0);
    const discountValue = getDiscountValue(product);
    if (!price) return null;
    if (product?.discountType && discountValue > 0 && finalPrice > 0 && finalPrice < price) return price;
    return null;
  };

  const hasDiscount = (product) => getDiscountValue(product) > 0 && !!product?.discountType;

  const handleAddToCart = async (e, product) => {
    e.preventDefault(); e.stopPropagation();
    const productId = product.id || product._id;
    if (!productId || product?.status === false) return;
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try { await addToCart(productId, 1); } catch (error) { console.error('Error adding to cart:', error); }
    finally { setAddingToCart(prev => ({ ...prev, [productId]: false })); }
  };

  const ProductCard = ({ product }) => {
    const imagePath = product.thumbnailUrl || product.primaryImage || product.image || (product.secondaryImages?.[0]);
    const imageUrl = buildImageUrl(imagePath);
    const productTitle = getProductTitle(product);
    const oldPrice = calculateOldPrice(product);
    const showDiscount = hasDiscount(product);
    const currentPrice = product.finalPrice ?? product.price ?? 0;
    const discountValue = getDiscountValue(product);
    const productId = product.id || product._id;
    const isAdding = addingToCart[productId] || false;
    const isAvailable = product?.status === true;

    return (
      <Link to={`/products/${productId}`} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
        <div className="relative w-full aspect-square overflow-hidden bg-brandSwhite shrink-0">
          <Image src={imageUrl} alt={productTitle} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
          {showDiscount && (
            <div className="absolute top-4 right-4 bg-brandRed text-white px-5 py-1 rounded-md text-sm font-montserrat font-light z-10">
              {product.discountType === 'PERCENT' ? `-${discountValue}%` : `-${discountValue}$`}
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
              <span className="text-white text-sm font-montserrat px-4 py-2 rounded-full bg-black/40">Bientôt disponible</span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col justify-between bg-white flex-1">
          <h3 className="font-playfair text-xl font-bold text-l_black line-clamp-2">{productTitle}</h3>
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              {oldPrice ? (
                <>
                  <span className="font-montserrat text-xl font-bold text-brandRed">{toNumber(currentPrice).toFixed(2)}$</span>
                  <span className="font-montserrat text-sm text-gray-400 line-through">{toNumber(oldPrice).toFixed(2)}$</span>
                </>
              ) : (
                <span className="font-montserrat text-xl font-bold text-brandRed">{toNumber(currentPrice).toFixed(2)}$</span>
              )}
            </div>
            <button onClick={(e) => handleAddToCart(e, product)} disabled={isAdding || !isAvailable} className="flex text-xs items-center cursor-pointer gap-2 bg-brandRed text-white px-4 py-2 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
              <ShoppingCart size={18} />
              <span>{isAdding ? 'Ajout...' : isAvailable ? 'Ajouter' : 'Bientôt'}</span>
            </button>
          </div>
        </div>
      </Link>
    );
  };

  if (error) return (
    <div className="px-4 py-16 text-center">
      <p className="text-red-600 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-brandRed text-white rounded-md">Réessayer</button>
    </div>
  );

  if (loading) return <PageLoader label="Chargement des produits..." />;

  const totalFilteredProducts = categories.reduce((total, category) => {
    const products = categoryProducts[category.id] || [];
    return total + getFilteredProducts(products).length;
  }, 0);

  return (
    <div className="px-4 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <div className="text-sm text-gray-600">{totalFilteredProducts} produit{totalFilteredProducts !== 1 ? 's' : ''} trouvé{totalFilteredProducts !== 1 ? 's' : ''}</div>
        </div>
        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories.filter(cat => !selectedCategory || cat.id === selectedCategory).map((category) => {
              const filtered = getFilteredProducts(categoryProducts[category.id] || []);
              if (filtered.length === 0) return null;
              return (
                <div key={category.id} className="space-y-4">
                  <h2 className="font-playfair text-3xl font-bold text-l_black">{category.name}</h2>
                  <Swiper modules={[Navigation]} spaceBetween={24} slidesPerView={1} breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 4 } }} navigation={filtered.length > 4} className="products-swiper py-5">
                    {filtered.map(p => <SwiperSlide key={p.id || p._id}><ProductCard product={p} /></SwiperSlide>)}
                  </Swiper>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16"><p>Aucun produit disponible.</p></div>
        )}
      </div>
    </div>
  );
}
