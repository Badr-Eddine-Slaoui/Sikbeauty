"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { api } from "../../config/api";
import API_ENDPOINTS from "../../config/api";
import { Link } from "@/utils/react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
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
  onCategoriesLoaded
}) {
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState({});

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

  // Helper function to build image URL
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}` : path;
  };

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
        // API returns array directly or wrapped in data
        const categoriesData = Array.isArray(response.data) 
          ? response.data 
          : (response.data?.data || []);
        // Filter only active categories
        const activeCategories = categoriesData.filter(cat => cat.isActive !== false);
        setCategories(activeCategories);
        // Notify parent component about loaded categories
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
  }, []);

  // Fetch products for each category
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (categories.length === 0) return;

      const productsMap = {};
      
      try {
        // If a category is selected, only fetch products for that category
        const categoriesToFetch = selectedCategory 
          ? categories.filter(cat => cat.id === selectedCategory)
          : categories;

        const promises = categoriesToFetch.map(async (category) => {
          try {
            const response = await api.get(API_ENDPOINTS.CATEGORIES.PRODUCTS(category.id, 1, 100));
            const products = response.data?.data || [];
            console.log("products", products);
            
            productsMap[category.id] = products;
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
  }, [categories, selectedCategory]);

  // Filter and search products for a given category
  const getFilteredProducts = useMemo(() => {
    return (products) => {
      let filtered = [...products];

      // Search filter
      if (searchQuery.trim()) {
        filtered = filtered.filter(product => {
          const title = product.title || '';
          const description = product.description || '';
          return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 description.toLowerCase().includes(searchQuery.toLowerCase());
        });
      }

      // Price filter
      if (priceFilter !== "all") {
        filtered = filtered.filter(product => {
          const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;
          switch (priceFilter) {
            case "under-25":
              return price < 25;
            case "25-50":
              return price >= 25 && price <= 50;
            case "50-100":
              return price > 50 && price <= 100;
            case "over-100":
              return price > 100;
            default:
              return true;
          }
        });
      }

      // Sort products
      if (sortBy !== "default") {
        filtered.sort((a, b) => {
          const priceA = typeof a.price === 'number' ? a.price : parseFloat(a.price) || 0;
          const priceB = typeof b.price === 'number' ? b.price : parseFloat(b.price) || 0;
          
          switch (sortBy) {
            case "price-low":
              return priceA - priceB;
            case "price-high":
              return priceB - priceA;
            case "name-asc":
              const titleA = a.title || a.description?.substring(0, 50) || "";
              const titleB = b.title || b.description?.substring(0, 50) || "";
              return titleA.localeCompare(titleB);
            case "name-desc":
              const titleADesc = a.title || a.description?.substring(0, 50) || "";
              const titleBDesc = b.title || b.description?.substring(0, 50) || "";
              return titleBDesc.localeCompare(titleADesc);
            default:
              return 0;
          }
        });
      }

      return filtered;
    };
  }, [searchQuery, priceFilter, sortBy]);

  // Helper function to get product title (title is only available for admin users)
  const getProductTitle = (product) => {
    if (product.title) return product.title;
    // if (product.description) {
    //   // Extract first sentence or first 50 characters from description
    //   const firstSentence = product.description.split('.')[0];
    //   if (firstSentence.length <= 60) return firstSentence;
    //   return product.description.substring(0, 50).trim() + '...';
    // }
    return 'Produit sans nom';
  };

  const toNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getDiscountValue = (product) => {
    const raw = product?.discount;
    if (product?.discountType === 'PRICE') {
      if (typeof raw === 'number') return raw / 100;
      return toNumber(raw);
    }
    if (product?.discountType === 'PERCENT') {
      return toNumber(raw);
    }
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

  const hasDiscount = (product) => {
    const discountValue = getDiscountValue(product);
    return !!product?.discountType && discountValue > 0;
  };

  // Handle add to cart
  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = product.id || product._id;
    if (!productId) return;
    if (product?.status === false) return;

    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await addToCart(productId, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Product Card Component - matches the exact style from reference
  const ProductCard = ({ product }) => {
    // Get image URL with priority: thumbnailUrl > primaryImage > image > secondaryImages[0] > placeholder
    const imagePath = product.thumbnailUrl ||
                     product.primaryImage || 
                     product.image || 
                     (product.secondaryImages && product.secondaryImages.length > 0 
                       ? product.secondaryImages[0] 
                       : null);
    const imageUrl = imagePath ? buildImageUrl(imagePath) : PLACEHOLDER_IMAGE;
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
          <img 
            src={imageUrl} 
            alt={productTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
          {showDiscount && (
            <div className="absolute top-4 right-4 bg-brandRed text-white px-5 py-1 rounded-md text-sm font-montserrat font-light">
              {product.discountType === 'PERCENT'
                ? `-${discountValue}%`
                : product.discountType === 'PRICE'
                ? `-${discountValue}$`
                : ''}
            </div>
          )}
          {!isAvailable && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-sm font-montserrat px-4 py-2 rounded-full bg-black/40">
                Bientôt disponible
              </span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col justify-between bg-white flex-1">
          <div className="flex-1 flex flex-col">
            <h3 className="font-playfair text-xl font-bold text-l_black line-clamp-2">
              {productTitle}
            </h3>
          </div>
          
          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex flex-col">
              {oldPrice ? (
                <>
                  <span className="font-montserrat text-xl font-bold text-brandRed">
                    {typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}$
                  </span>
                  <span className="font-montserrat text-sm text-gray-400 line-through">
                    {typeof oldPrice === 'number' ? oldPrice.toFixed(2) : oldPrice}$
                  </span>
                </>
              ) : (
                <span className="font-montserrat text-xl font-bold text-brandRed">
                  {typeof currentPrice === 'number' ? currentPrice.toFixed(2) : currentPrice}$
                </span>
              )}
            </div>
            
            <button 
              onClick={(e) => handleAddToCart(e, product)}
              disabled={isAdding || !isAvailable}
              className="flex text-xs items-center cursor-pointer gap-2 bg-brandRed text-white px-4 py-2 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={18} />
              <span>{isAdding ? 'Ajout...' : isAvailable ? 'Ajouter' : 'Bientôt'}</span>
            </button>
          </div>
        </div>
      </Link>
    );
  };

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-brandWhite min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-montserrat text-lg text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-brandRed text-white rounded-md hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <PageLoader label="Chargement des produits..." />
    );
  }

  // Calculate total filtered products count
  const totalFilteredProducts = categories.reduce((total, category) => {
    const products = categoryProducts[category.id] || [];
    const filtered = getFilteredProducts(products);
    return total + filtered.length;
  }, 0);

  return (
    <div className="px-4 sm:px-6 lg:px-2 py-10  min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Results Count */}
        <div className=" flex justify-end">
          <div className="font-montserrat text-sm text-gray-600">
            {totalFilteredProducts} produit{totalFilteredProducts !== 1 ? 's' : ''} trouvé{totalFilteredProducts !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Categories with Product Swipers */}
        {categories.length > 0 ? (
          <div className="space-y-12">
            {categories
              .filter(category => !selectedCategory || category.id === selectedCategory)
              .map((category) => {
                const products = categoryProducts[category.id] || [];
                const filteredProducts = getFilteredProducts(products);

                if (filteredProducts.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-0">
                    {/* Category Title */}
                    <h2 className="font-playfair text-3xl font-bold text-l_black">
                      {category.name || 'Catégorie'}
                    </h2>

                    {/* Product Swiper */}
                    <div className="relative">
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={24}
                        slidesPerView={1}
                        breakpoints={{
                          640: {
                            slidesPerView: 2,
                          },
                          1024: {
                            slidesPerView: 4,
                          },
                        }}
                        navigation={filteredProducts.length > 4 ? true : false}
                        className="products-swiper py-5"
                      >
                        {filteredProducts.map((product) => (
                          <SwiperSlide key={product.id || product._id}>
                            <ProductCard product={product} />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-montserrat text-lg text-gray-600">
              {searchQuery || priceFilter !== "all"
                ? "Aucun produit ne correspond à vos critères de recherche."
                : "Aucun produit disponible pour le moment."}
            </p>
          </div>
        )}

        {/* Empty State - No categories or all filtered out */}
        {categories.length > 0 && totalFilteredProducts === 0 && (
          <div className="text-center py-16">
            <p className="font-montserrat text-lg text-gray-600">
              Aucun produit ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

