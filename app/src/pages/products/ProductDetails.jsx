"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "@/utils/react-router-dom";
import { ShoppingCart, ArrowLeft, Heart, Share2, UserPlus } from "lucide-react";
import API_ENDPOINTS, { api } from "../../config/api";
import ClientNavbar from "../../components/Client/ClientNavbar";
import { useCart } from "../../contexts/CartContext";
import PageLoader from "../../components/ui/PageLoader";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Header/NavBar";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

export default function ProductDetails() {

  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const authenticated = isAuthenticated();

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/';

  // Helper function to build image URL
  const buildImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return apiBaseUrl ? `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}` : path;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
        const productData = response.data?.data || response.data;
        setProduct(productData);
        setQuantity(1);
        setActiveImageIndex(0);
        
        // Check if product is liked (only if authenticated)
        if (authenticated) {
          try {
            const likedResponse = await api.get(API_ENDPOINTS.USER.CHECK_LIKED_PRODUCT(id));
            setIsLiked(likedResponse.data.data.isLiked);
          } catch (err) {
            console.error('Error checking liked status:', err);
          }
        }
      } catch (error) {
        console.error("Error fetching product", error);
        setError(error.response?.data?.message || "Impossible de charger ce produit. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };
    if (!id) return;
    fetchProduct();
  }, [id, authenticated]);

  const handleToggleLike = async () => {
    if (!authenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      setIsTogglingLike(true);
      if (isLiked) {
        await api.delete(API_ENDPOINTS.USER.REMOVE_LIKED_PRODUCT(id));
        setIsLiked(false);
      } else {
        await api.post(API_ENDPOINTS.USER.ADD_LIKED_PRODUCT, { productId: id });
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Erreur lors de la mise à jour des favoris');
    } finally {
      setIsTogglingLike(false);
    }
  };

  // Helper function to get product title (fallback to description if title doesn't exist)
  const getProductTitle = (product) => {
    if (product?.title) return product.title;
    if (product?.description) {
      const firstSentence = product.description.split('.')[0];
      if (firstSentence.length <= 60) return firstSentence;
      return product.description.substring(0, 50).trim() + '...';
    }
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

  // Helper function to calculate old price based on discount
  const calculateOldPrice = (product) => {
    const originalPrice = toNumber(product?.price ?? 0);
    const finalPrice = toNumber(product?.finalPrice ?? 0);
    const discountValue = getDiscountValue(product);
    if (!originalPrice) return null;
    if (product?.discountType && discountValue > 0 && finalPrice > 0 && finalPrice < originalPrice) {
      return originalPrice;
    }
    return null;
  };

  // Helper function to check if product has discount
  const hasDiscount = (product) => {
    const discountValue = getDiscountValue(product);
    return !!product?.discountType && discountValue > 0;
  };

  // Build gallery images from thumbnailUrl and images array
  const galleryImages = product
    ? [
        ...(product.thumbnailUrl ? [buildImageUrl(product.thumbnailUrl)] : []),
        ...(Array.isArray(product.images)
          ? product.images.map(img => buildImageUrl(img)).filter(Boolean)
          : []),
      ].filter(Boolean)
    : [];

  const mainImage = galleryImages.length > 0 
    ? (galleryImages[activeImageIndex] || galleryImages[0])
    : (product?.thumbnailUrl ? buildImageUrl(product.thumbnailUrl) : PLACEHOLDER_IMAGE);

  if (loading) {
    return (
      <div>
        {authenticated ? <ClientNavbar /> : <Navbar />}
        <PageLoader label="Chargement du produit..." />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {authenticated ? <ClientNavbar /> : <Navbar />}
        <div className="flex flex-col gap-4 justify-center items-center min-h-screen">
          <p className="font-montserrat text-gray-500 text-center">{error}</p>
          {!authenticated && (
            <Link
              to="/login"
              className="px-6 cursor-pointer py-2 rounded-full bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat"
            >
              Connexion
            </Link>
          )}
          <button
            onClick={() => {
              window.scrollTo({
                top: 0,
                left: 0,
                behavior: 'instant'
              });
              navigate(-1);
            }}
            className="px-6 cursor-pointer py-2 rounded-full bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  // Get price based on available fields (prefer finalPrice when available)
  const currentPrice = product.finalPrice ?? product.price ?? 0;
  const priceValue = currentPrice 
    ? (typeof currentPrice === "number" ? currentPrice.toFixed(2) : currentPrice)
    : "N/A";
  
  // Calculate old price and check if discount exists
  const oldPrice = calculateOldPrice(product);
  const showDiscount = hasDiscount(product);

  const discountValue = getDiscountValue(product);
  
  // Calculate total price (price * quantity)
  const totalPrice = currentPrice * quantity;
  const displayTotalPrice = typeof totalPrice === "number" ? totalPrice.toFixed(2) : totalPrice;

  const isAvailable = product?.status === true;
  const canDecrease = quantity > 1;
  const canIncrease = quantity < 99;

  const canAddToCart = authenticated;

  const productTitle = getProductTitle(product);
  
  // Handle back navigation with scroll to top
  const handleBack = () => {
    // Scroll to top before navigating
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    navigate(-1);
    // Also scroll after a short delay to ensure it works even if browser restores scroll position
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }, 100);
  };
    
  return (
    <div>
      {authenticated ? <ClientNavbar /> : <Navbar />}
      <div className="px-4 mt-16 sm:px-6 lg:px-8 py-6 bg-brandWhite min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center cursor-pointer gap-2 text-brandBrown hover:text-brandRed transition-colors duration-300 mb-4 font-montserrat"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* Product Images */}
            <div className="space-y-3">
              {/* Main Image */}
              <div className="relative w-full max-w-lg mx-auto lg:mx-0 aspect-square overflow-hidden rounded-lg bg-brandSwhite">
                <img
                  src={mainImage}
                  alt={productTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
                {showDiscount && (
                  <div className="absolute top-3 right-3 bg-brandRed text-white px-4 py-1 rounded-md text-sm font-montserrat font-light">
                    {product.discountType === 'PERCENT'
                      ? `-${discountValue}%`
                      : product.discountType === 'PRICE'
                      ? `-${discountValue}$`
                      : ''}
                  </div>
                )}
              </div>
              
              {/* Secondary Images */}
              {galleryImages.length > 1 && (
                <div className="mt-4">
                  <p className="font-montserrat text-sm text-gray-500 mb-2">
                    Images secondaires
                  </p>
                  <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto lg:mx-0">
                    {galleryImages.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
                          activeImageIndex === index ? "border-brandRed" : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${productTitle} - ${index + 1}`}
                          className="w-full cursor-pointer h-full object-cover"
                          onError={(e) => {
                            e.target.src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-l_black mb-3">
                  {productTitle}
                </h1>

                <p className="font-montserrat text-base text-gray-700 mb-4 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-montserrat text-sm text-gray-500 uppercase tracking-widest">
                      Prix
                    </p>
                    {oldPrice ? (
                      <div>
                        <p className="font-playfair text-3xl text-brandRed font-semibold">
                          {priceValue}$
                        </p>
                        <p className="font-montserrat text-sm text-gray-400 line-through">
                          {typeof oldPrice === 'number' ? oldPrice.toFixed(2) : oldPrice}$
                        </p>
                      </div>
                    ) : (
                      <p className="font-playfair text-3xl text-brandRed font-semibold">
                        {priceValue}$
                      </p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {authenticated && (
                      <button
                        onClick={handleToggleLike}
                        disabled={isTogglingLike}
                        className={`w-11 h-11 cursor-pointer rounded-full border flex items-center justify-center transition-colors disabled:opacity-50 ${
                          isLiked 
                            ? 'border-red-500 bg-red-50 hover:bg-red-100' 
                            : 'border-gray-200 hover:border-brandRed hover:text-brandRed'
                        }`}
                        aria-label="Ajouter aux favoris"
                      >
                        <Heart 
                          size={20} 
                          className={isLiked ? 'text-red-500 fill-red-500' : ''}
                        />
                      </button>
                    )}
                    <button
                      className="w-11 h-11 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center hover:border-brandRed hover:text-brandRed transition-colors"
                      aria-label="Partager"
                    >
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Discount Information */}
                {showDiscount && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="font-montserrat text-sm text-gray-700">
                      <span className="font-semibold">Offre spéciale:</span>{" "}
                      {product.discountType === 'PERCENT'
                        ? `Réduction de ${discountValue}% appliquée!`
                        : product.discountType === 'PRICE'
                        ? `Réduction de ${discountValue}$ appliquée!`
                        : ''}
                    </p>
                  </div>
                )}

                {/* Availability */}
                <div className="mb-4">
                  <p className="font-montserrat text-sm text-gray-600">
                    Disponibilité:{" "}
                    <span className={`font-semibold ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                      {isAvailable ? 'Disponible' : 'Pas disponible (Bientôt disponible)'}
                    </span>
                  </p>
                </div>

                {/* Quantity Selector */}
                <div className="mb-6">
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block font-montserrat text-sm font-medium text-gray-700 mb-1">
                        Quantité:
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => canDecrease && setQuantity((prev) => Math.max(1, prev - 1))}
                          disabled={!canDecrease || !isAvailable}
                          className="w-10 cursor-pointer h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-montserrat font-semibold"
                        >
                          -
                        </button>
                        <span className="font-montserrat text-lg font-semibold w-12 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => canIncrease && setQuantity((prev) => prev + 1)}
                          disabled={!canIncrease || !isAvailable}
                          className="w-10 cursor-pointer h-10 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 font-montserrat font-semibold"
                        >
                          +
                        </button>
                      </div>
                      {/* Total Price Display */}
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-montserrat text-sm text-gray-600">Total:</span>
                          <span className="font-playfair text-2xl text-brandRed font-semibold">
                            {displayTotalPrice}$
                          </span>
                        </div>
                      </div>
                    </div>
                    {!authenticated && (
                      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="font-montserrat text-sm text-gray-700 text-center">
                          <span className="font-semibold">Créez un compte pour ajouter des produits au panier</span>
                        </p>
                      </div>
                    )}
                    {authenticated ? (
                      <button
                        onClick={async (e) => {
                          e.preventDefault();
                          if (!product || !product.id) return;
                          if (!isAvailable) return;
                          
                          setIsAddingToCart(true);
                          try {
                            await addToCart(product.id, quantity);
                          } catch (error) {
                            console.error('Error adding to cart:', error);
                          } finally {
                            setIsAddingToCart(false);
                          }
                        }}
                        disabled={isAddingToCart || !product || !isAvailable}
                        className="w-[90%] mx-auto sm:mx-0 cursor-pointer lg:w-[50%] flex items-center justify-center gap-2 bg-brandRed text-white px-7 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart size={20} />
                        <span>
                          {isAddingToCart
                            ? 'Ajout en cours...'
                            : isAvailable
                            ? 'Ajouter au panier'
                            : 'Bientôt disponible'}
                        </span>
                      </button>
                    ) : (
                      <Link
                        to={'/signup'}
                        className="w-[90%] mx-auto sm:mx-0 cursor-pointer lg:w-[50%] flex items-center justify-center gap-2 bg-brandRed text-white px-7 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-medium text-lg"
                      >
                        <UserPlus size={20} />
                        <span>S'inscrire pour acheter</span>
                      </Link>
                    )}
                  </div>
                </div>
                
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

