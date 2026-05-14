"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, API_ENDPOINTS } from '../config/api';

const LatestProductsContext = createContext(null);

export const useLatestProducts = () => {
  const ctx = useContext(LatestProductsContext);
  if (!ctx) throw new Error('useLatestProducts must be used within a LatestProductsProvider');
  return ctx;
};

export const LatestProductsProvider = ({ children, limit = 4, fetchLimit = 20, initialProducts = [] }) => {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLatestProducts = useCallback(async () => {
    // Only fetch if we don't have initial products or if we want to refetch
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_LATEST);

      const payload = response.data?.data ?? response.data;
      const list = Array.isArray(payload)
        ? payload
        : (Array.isArray(payload?.products)
          ? payload.products
          : (Array.isArray(payload?.data)
            ? payload.data
            : []));

      const sorted = [...list].sort((a, b) => {
        const aId = Number(a?.id ?? a?._id ?? 0);
        const bId = Number(b?.id ?? b?._id ?? 0);
        return bId - aId;
      });

      setProducts(sorted.slice(0, limit));
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    // Only fetch if we don't have a valid array of products
    const hasInitialProducts = Array.isArray(initialProducts) && initialProducts.length > 0;
    if (!hasInitialProducts) {
      fetchLatestProducts();
    }
  }, [fetchLatestProducts, initialProducts]);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      refetch: fetchLatestProducts,
    }),
    [error, fetchLatestProducts, loading, products]
  );

  return <LatestProductsContext.Provider value={value}>{children}</LatestProductsContext.Provider>;
};
