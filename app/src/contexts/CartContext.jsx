"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../config/api';
import API_ENDPOINTS from '../config/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const toNumber = (value) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const computeTotal = (nextCart) => {
    const items = nextCart?.items || nextCart?.result || [];
    if (!Array.isArray(items) || items.length === 0) return '0.00';

    const total = items.reduce((sum, item) => {
      const product = item?.product || {};
      const unitPrice = toNumber(product.unitPrice ?? product.price ?? 0);
      const qty = toNumber(item?.quantity ?? 0);
      return sum + unitPrice * qty;
    }, 0);

    return total.toFixed(2);
  };

  // Fetch cart items from API
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(API_ENDPOINTS.CART.GET_ITEMS);
      // Handle both response formats: { data: {...} } or direct data
      const cartData = response.data?.data || response.data;
      setCart(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement du panier');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load cart on mount and when authentication changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour ajouter des articles au panier');
      return { success: false };
    }

    try {
      setMutating(true);
      setError(null);
      const response = await api.post(API_ENDPOINTS.CART.ADD_ITEM, {
        productId,
        quantity,
      });
      
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      toast.success(response.data?.message || 'Produit ajouté au panier avec succès');
      return { success: true, data: cartData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'ajout du produit au panier';
      toast.error(errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setMutating(false);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour modifier le panier');
      return { success: false };
    }

    const previousCart = cart;
    if (previousCart?.items && Array.isArray(previousCart.items)) {
      const nextItems = previousCart.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      );
      const nextCart = { ...previousCart, items: nextItems };
      setCart({ ...nextCart, total: computeTotal(nextCart) });
    }

    try {
      setMutating(true);
      setError(null);
      const response = await api.put(API_ENDPOINTS.CART.UPDATE_QUANTITY(itemId), {
        quantity,
      });
      
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      toast.success(response.data?.message || 'Panier mis à jour avec succès');
      return { success: true, data: cartData };
    } catch (err) {
      if (previousCart) setCart(previousCart);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du panier';
      toast.error(errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setMutating(false);
    }
  };

  // Increment or decrement quantity
  const incrementDecrementQuantity = async (itemId, action) => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour modifier le panier');
      return { success: false };
    }

    if (action !== 'increment' && action !== 'decrement') {
      return { success: false, error: 'Invalid action' };
    }

    const previousCart = cart;
    if (previousCart?.items && Array.isArray(previousCart.items)) {
      const delta = action === 'decrement' ? -1 : 1;
      const nextItems = previousCart.items.map((item) => {
        if (item.id !== itemId) return item;
        const currentQty = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 0;
        const nextQty = Math.max(1, currentQty + delta);
        return { ...item, quantity: nextQty };
      });
      const nextCart = { ...previousCart, items: nextItems };
      setCart({ ...nextCart, total: computeTotal(nextCart) });
    }

    try {
      setMutating(true);
      setError(null);
      const response = await api.patch(API_ENDPOINTS.CART.INCREMENT_DECREMENT(itemId), {
        action,
      });
      
      const cartData = response.data?.data || response.data;
      setCart(cartData);
      toast.success(response.data?.message || 'Panier mis à jour avec succès');
      return { success: true, data: cartData };
    } catch (err) {
      if (previousCart) setCart(previousCart);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la mise à jour du panier';
      toast.error(errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setMutating(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!isAuthenticated()) {
      toast.error('Veuillez vous connecter pour supprimer des articles du panier');
      return { success: false };
    }

    const previousCart = cart;
    if (previousCart?.items && Array.isArray(previousCart.items)) {
      const nextItems = previousCart.items.filter((item) => item.id !== itemId);
      const nextCart = { ...previousCart, items: nextItems };
      setCart({ ...nextCart, total: computeTotal(nextCart) });
    }

    try {
      setMutating(true);
      setError(null);
      await api.delete(API_ENDPOINTS.CART.DELETE_ITEM(itemId));
      
      // Refresh cart after deletion
      await fetchCart();
      toast.success('Article supprimé du panier');
      return { success: true };
    } catch (err) {
      if (previousCart) setCart(previousCart);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la suppression de l\'article';
      toast.error(errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setMutating(false);
    }
  };

  // Get cart item count
  const getItemCount = () => {
    if (!cart) return 0;
    // Handle both 'items' and 'result' field names from API
    const items = cart.items || cart.result || [];
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Check if cart has any inactive items
  const hasInactiveItems = () => {
    if (!cart) return false;
    const items = cart.items || cart.result || [];
    if (!Array.isArray(items)) return false;
    return items.some((item) => item?.product?.status !== true);
  };

  // Get list of inactive items
  const getInactiveItems = () => {
    if (!cart) return [];
    const items = cart.items || cart.result || [];
    if (!Array.isArray(items)) return [];
    return items.filter((item) => item?.product?.status !== true);
  };

  // Get only active items for total calculation
  const getActiveItems = () => {
    if (!cart) return [];
    const items = cart.items || cart.result || [];
    if (!Array.isArray(items)) return [];
    return items.filter((item) => item?.product?.status === true);
  };

  // Get cart total
  const getTotal = () => {
    if (!cart) return 0;

    // Backend already computes the total and returns it as `cart.total` (formatted string).
    if (cart.total !== undefined && cart.total !== null) {
      const parsed = typeof cart.total === 'number' ? cart.total : parseFloat(cart.total);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    const items = cart.items || cart.result || [];
    if (!Array.isArray(items) || items.length === 0) return 0;

    return items.reduce((sum, item) => {
      const product = item?.product || {};
      const unitPrice = toNumber(product.unitPrice ?? product.price ?? 0);
      const qty = toNumber(item?.quantity ?? 0);
      return sum + unitPrice * qty;
    }, 0);
  };

  const value = {
    cart,
    loading,
    mutating,
    error,
    addToCart,
    updateQuantity,
    incrementDecrementQuantity,
    removeFromCart,
    fetchCart,
    getItemCount,
    getTotal,
    hasInactiveItems,
    getInactiveItems,
    getActiveItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

