"use client";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "@/utils/react-router-dom";
import { useLatestProducts } from "../../contexts/LatestProductsContext";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&h=1000&fit=crop";

export default function MainComponent() {
  const { products, loading } = useLatestProducts();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState({});

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${apiBaseUrl.replace(/\/$/, "")}${cleanPath}`;
  };

  const toNumber = (value) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getDiscountValue = (product) => {
    const raw = product?.discount;
    if (product?.discountType === "PRICE") {
      if (typeof raw === "number") return raw / 100;
      return toNumber(raw);
    }
    if (product?.discountType === "PERCENT") {
      return toNumber(raw);
    }
    return 0;
  };

  const getUnitPrice = (product) => {
    const value = product?.finalPrice ?? product?.price ?? 0;
    return toNumber(value);
  };

  const getOldPrice = (product, unitPrice) => {
    const original = toNumber(product?.price ?? 0);
    const final = toNumber(product?.finalPrice ?? unitPrice);
    const discountValue = getDiscountValue(product);
    if (product?.discountType && discountValue > 0 && final > 0 && original > 0 && final < original) {
      return original;
    }
    return null;
  };

  const items = useMemo(() => {
    const list = Array.isArray(products) ? products : [];
    const safe = list.slice(0, 4);
    while (safe.length < 4) safe.push(null);
    return safe;
  }, [products]);

  const handleAddToCart = async (productId) => {
    if (!productId) return;
    setAdding((prev) => ({ ...prev, [productId]: true }));
    try {
      await addToCart(productId, 1);
    } finally {
      setAdding((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const truncateText = (text, maxLength = 110) => {
    const raw = (text || "").toString().trim();
    if (raw.length <= maxLength) return raw;
    return `${raw.slice(0, maxLength).trim()}...`;
  };

  const handleOpenDetails = (product) => {
    const productId = product?.id;
    if (!productId) return;
    try {
      sessionStorage.setItem(`product_details_${productId}`, JSON.stringify(product));
    } catch {
      // ignore
    }
    navigate(`/products/${productId}`, { state: { product } });
  };

  const renderCard = (product, idx) => {
    const id = product?.id ?? product?._id ?? `placeholder-${idx}`;
    const unitPrice = getUnitPrice(product);
    const oldPrice = product ? getOldPrice(product, unitPrice) : null;
    const discountValue = getDiscountValue(product);
    const hasDiscount = !!product?.discountType && discountValue > 0 && oldPrice !== null;
    const imageSrc = buildImageUrl(product?.thumbnailUrl);
    const title = (product?.title || "Nom du produit").toUpperCase();
    const description = truncateText(product?.description || "");

    const canAddToCart = isAuthenticated();

    return (
      <div
        key={id}
        className="group bg-white/60 border border-white/70 shadow-sm overflow-hidden"
        role={product ? "button" : undefined}
        tabIndex={product ? 0 : -1}
        onClick={() => handleOpenDetails(product)}
        onKeyDown={(e) => {
          if (!product) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpenDetails(product);
          }
        }}
      >
        <div className="relative h-[280px] sm:h-80 bg-white cursor-pointer">
          <img
            src={imageSrc}
            alt={product?.title || "Produit"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = PLACEHOLDER_IMAGE;
            }}
          />

          <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            {product ? (
              <>
                {hasDiscount && (
                  <p className="font-montserrat text-xs tracking-[0.25em] text-white/80">
                    -{discountValue}{product?.discountType === "PERCENT" ? "%" : "$"} Offre
                  </p>
                )}
                <h3 className="mt-2 font-playfair text-2xl font-bold text-white">
                  {title}
                </h3>
                <p className="mt-4 font-montserrat text-xs leading-5 text-white/80 max-h-[110px] overflow-hidden">
                  {description}
                </p>
              </>
            ) : (
              <div className="w-full">
                <div className="h-4 w-2/3 bg-white/25 mx-auto" />
                <div className="mt-3 h-7 w-4/5 bg-white/25 mx-auto" />
                <div className="mt-5 h-3 w-full bg-white/20" />
                <div className="mt-2 h-3 w-11/12 bg-white/20" />
                <div className="mt-2 h-3 w-10/12 bg-white/20" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#efefef] px-5 py-4 flex items-center justify-between">
          {product ? (
            <>
              <button
                type="button"
                disabled={!canAddToCart || !!adding[product?.id] || loading}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!canAddToCart) return;
                  handleAddToCart(product?.id);
                }}
                className="font-montserrat cursor-pointer text-sm text-gray-700 hover:text-brandRed transition-colors disabled:opacity-50"
              >
                Ajouter au panier
              </button>
              <div className="flex items-baseline gap-2">
                {oldPrice !== null && (
                  <span className="font-montserrat text-xs text-gray-500 line-through">
                    {oldPrice.toFixed(2)}€
                  </span>
                )}
                <span className="font-montserrat text-sm font-semibold text-gray-800">
                  {unitPrice.toFixed(2)}$
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="h-4 w-24 bg-gray-300/80" />
              <div className="h-4 w-16 bg-gray-300/80" />
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-[#fbf4f2] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-brandRed tracking-wide">
            SÉLECTION D’ESSENTIELS K-BEAUTY
          </h2>
          <div className="mt-6 h-[2px] w-full bg-[#d4cfd0]" />
        </div>

        <div className="mt-10 sm:hidden">
          <Swiper
            spaceBetween={16}
            slidesPerView={1.15}
            centeredSlides={false}
            className="pb-2!"
          >
            {items.map((product, idx) => (
              <SwiperSlide key={product?.id ?? product?._id ?? `m-${idx}`} className="h-auto!">
                <div className="h-full">{renderCard(product, idx)}</div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden sm:grid mt-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product, idx) => renderCard(product, idx))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to={"/client/products"}
            className="inline-flex items-center justify-center bg-brandRed text-white px-12 py-3 font-montserrat tracking-widest hover:bg-hoverBrandRed transition-colors"
          >
            Voir Plus
          </Link>
        </div>
      </div>
    </section>
  );
}
