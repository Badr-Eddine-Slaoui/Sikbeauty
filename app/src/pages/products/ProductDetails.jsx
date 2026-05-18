"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "@/utils/react-router-dom";
import { ShoppingCart, ArrowLeft, Heart, Share2, UserPlus, Play } from "lucide-react";
import API_ENDPOINTS, { api } from "../../config/api";
import ClientNavbar from "../../components/Client/ClientNavbar";
import { useCart } from "../../contexts/CartContext";
import PageLoader from "../../components/ui/PageLoader";
import { useAuth } from "../../contexts/AuthContext";
import Navbar from "../../components/Header/NavBar";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

export default function ProductDetails({ initialProduct = null }) {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(initialProduct);
  const [loading, setLoading] = useState(!initialProduct);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isTogglingLike, setIsTogglingLike] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const authenticated = isAuthenticated();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/';

  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (product && product.id === id) return;
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(id));
        const productData = response.data?.data || response.data;
        setProduct(productData);
        setQuantity(1);
        setActiveImageIndex(0);
      } catch (error) {
        console.error("Error fetching product", error);
        setError(error.response?.data?.message || "Impossible de charger ce produit. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    const checkLikedStatus = async () => {
      if (authenticated && id) {
        try {
          const likedResponse = await api.get(API_ENDPOINTS.USER.CHECK_LIKED_PRODUCT(id));
          setIsLiked(likedResponse.data.data.isLiked);
        } catch (err) {
          console.error('Error checking liked status:', err);
        }
      }
    };

    if (!id) return;
    if (!initialProduct) {
      fetchProduct();
    }
    checkLikedStatus();
  }, [id, authenticated, initialProduct]);

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
    } finally {
      setIsTogglingLike(false);
    }
  };

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

  const priceNum = toNumber(product?.finalPrice ?? product?.price ?? 0);
  const originalPriceNum = toNumber(product?.price ?? 0);
  const priceValue = priceNum.toFixed(2);
  const oldPrice = originalPriceNum > priceNum ? originalPriceNum : null;
  const showDiscount = !!product?.discountType && toNumber(product?.discount) > 0;
  const discountValue = toNumber(product?.discount || 0);
  
  const galleryItems = product
    ? [
        ...(product.thumbnailUrl ? [{ type: 'image', url: buildImageUrl(product.thumbnailUrl) }] : []),
        ...(Array.isArray(product.images)
          ? product.images.map(img => ({ type: 'image', url: buildImageUrl(img) })).filter(item => item.url)
          : []),
        ...(product.videoUrl ? [{ type: 'video', url: buildImageUrl(product.videoUrl) }] : []),
      ]
    : [];

  const activeItem = galleryItems.length > 0
    ? (galleryItems[activeImageIndex] || galleryItems[0])
    : { type: 'image', url: PLACEHOLDER_IMAGE };

  if (loading) {
    return (
      <div>
        {authenticated ? <ClientNavbar /> : <Navbar />}
        <PageLoader label="Chargement du produit..." />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div>
        {authenticated ? <ClientNavbar /> : <Navbar />}
        <div className="flex flex-col gap-4 justify-center items-center min-h-screen pt-20">
          <p className="font-montserrat text-gray-500 text-center">{error || "Produit non trouvé"}</p>
          <Link to="/" className="px-6 py-2 rounded-full bg-brandRed text-white hover:bg-hoverBrandRed transition-colors font-montserrat">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = product?.status === true;
  const displayTotalPrice = (priceNum * quantity).toFixed(2);

  return (
    <div>
      {authenticated ? <ClientNavbar /> : <Navbar />}
      <div className="px-4 mt-16 sm:px-6 lg:px-8 py-6 bg-brandWhite min-h-screen pt-20">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center cursor-pointer gap-2 text-brandBrown hover:text-brandRed transition-colors duration-300 mb-4 font-montserrat"
          >
            <ArrowLeft size={20} />
            <span>Retour</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            <div className="space-y-4">
              <div className="relative w-full max-w-lg mx-auto lg:mx-0 aspect-square overflow-hidden rounded-lg bg-brandSwhite shadow-md">
                {activeItem?.type === 'video' ? (
                  <video
                    src={activeItem.url}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={activeItem?.url || PLACEHOLDER_IMAGE}
                    alt={getProductTitle(product)}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 512px"
                  />
                )}
                {showDiscount && (
                  <div className="absolute top-3 right-3 bg-brandRed text-white px-4 py-1 rounded-md text-sm font-montserrat font-light z-10">
                    {product.discountType === 'PERCENT' ? `-${discountValue}%` : `-${discountValue}$`}
                  </div>
                )}
              </div>
              
              {galleryItems.length > 1 && (
                <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto lg:mx-0">
                  {galleryItems.map((item, index) => (
                    <button
                      key={`${item.url}-${index}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-colors duration-300 ${
                        activeImageIndex === index ? "border-brandRed shadow-sm" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {item.type === 'video' ? (
                        <div className="relative w-full h-full bg-black flex items-center justify-center">
                          <Play size={24} className="text-white opacity-85" />
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={`${getProductTitle(product)} - ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-l_black mb-3">
                {getProductTitle(product)}
              </h1>
              <p className="font-montserrat text-base text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-montserrat text-sm text-gray-500 uppercase tracking-widest mb-1">Prix</p>
                  <div className="flex items-baseline gap-3">
                    <p className="font-playfair text-3xl text-brandRed font-semibold">{priceValue}$</p>
                    {oldPrice && (
                      <p className="font-montserrat text-lg text-gray-400 line-through">{oldPrice.toFixed(2)}$</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-3">
                  {authenticated && (
                    <button
                      onClick={handleToggleLike}
                      disabled={isTogglingLike}
                      className={`w-11 h-11 cursor-pointer rounded-full border flex items-center justify-center transition-all ${
                        isLiked ? 'border-red-500 bg-red-50 text-red-500' : 'border-gray-200 hover:border-brandRed hover:text-brandRed'
                      }`}
                    >
                      <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                    </button>
                  )}
                  <button className="w-11 h-11 cursor-pointer rounded-full border border-gray-200 flex items-center justify-center hover:border-brandRed hover:text-brandRed transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              {showDiscount && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                  <p className="font-montserrat text-sm text-red-800">
                    <span className="font-bold">Offre spéciale:</span> Réduction de {product.discountType === 'PERCENT' ? `${discountValue}%` : `${discountValue}$`} appliquée!
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="font-montserrat text-sm text-gray-600 mb-2">
                  Disponibilité: <span className={`font-semibold ${isAvailable ? "text-green-600" : "text-red-500"}`}>
                    {isAvailable ? 'Disponible' : 'Bientôt disponible'}
                  </span>
                </p>
                {isAvailable && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-12">
                        <button
                          onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          className="px-4 h-full hover:bg-gray-100 transition-colors font-bold"
                        >-</button>
                        <span className="px-4 font-montserrat font-bold min-w-[3rem] text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(q => Math.min(99, q + 1))}
                          className="px-4 h-full hover:bg-gray-100 transition-colors font-bold"
                        >+</button>
                      </div>
                      <div className="flex-1 p-3 bg-gray-50 rounded-lg h-12 flex justify-between items-center px-4">
                        <span className="text-sm text-gray-500">Total:</span>
                        <span className="font-playfair text-xl font-bold text-brandRed">{displayTotalPrice}$</span>
                      </div>
                    </div>
                    
                    {authenticated ? (
                      <button
                        onClick={() => addToCart(product.id, quantity)}
                        className="w-full h-14 bg-brandRed text-white rounded-full hover:bg-hoverBrandRed transition-all font-montserrat font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl active:scale-95"
                      >
                        <ShoppingCart size={22} />
                        Ajouter au panier
                      </button>
                    ) : (
                      <Link
                        to="/signup"
                        className="w-full h-14 bg-brandRed text-white rounded-full hover:bg-hoverBrandRed transition-all font-montserrat font-bold text-lg flex items-center justify-center gap-3 shadow-lg"
                      >
                        <UserPlus size={22} />
                        S'inscrire pour commander
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
