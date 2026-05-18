import axios from 'axios';

// API Configuration
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_BASE_URL = rawApiUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '');

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,
  },
  CHECKOUT: {
    VALIDATE: `${API_BASE_URL}/api/v1/checkout`,
    ACCEPT: `${API_BASE_URL}/api/v1/checkout/accept`,
  },
  ADMIN: {
    DASHBOARD: {
      GET_STATS: `${API_BASE_URL}/api/v1/admin/dashboard`,
    },
    REPORTS: `${API_BASE_URL}/api/v1/admin/reports`,
    PRODUCTS: {
      GET_ALL: `${API_BASE_URL}/api/v1/products`,
      CREATE: `${API_BASE_URL}/api/v1/admin/products`,
      UPDATE: (id) => `${API_BASE_URL}/api/v1/admin/products/${id}`,
      DELETE: (id) => `${API_BASE_URL}/api/v1/admin/products/${id}`,
      UPDATE_IMAGE: (id, imageId) => `${API_BASE_URL}/api/v1/admin/products/${id}/images/${imageId}`,
      DELETE_IMAGE: (id, imageId) => `${API_BASE_URL}/api/v1/admin/products/${id}/images/${imageId}`,
      UPDATE_THUMBNAIL: (id) => `${API_BASE_URL}/api/v1/admin/products/${id}/thumbnail`,
      ADD_IMAGE_OR_VIDEO: (id) => `${API_BASE_URL}/api/v1/admin/products/${id}/images`,
    },
    CATEGORIES: {
      GET_ALL: `${API_BASE_URL}/api/v1/categories`,
      CREATE: `${API_BASE_URL}/api/v1/admin/categories`,
      UPDATE: (id) => `${API_BASE_URL}/api/v1/admin/categories/${id}`,
    },
    ORDERS: {
      GET_ALL: `${API_BASE_URL}/api/v1/cart/orders`,
      GET_BY_ID: (id) => `${API_BASE_URL}/api/v1/cart/orders/${id}`,
      CREATE: `${API_BASE_URL}/api/v1/cart/orders`,
    },
    USERS: {
      GET_ALL: `${API_BASE_URL}/api/v1/admin/users`,
      GET_USER_ORDERS: (userId) => `${API_BASE_URL}/api/v1/admin/users/${userId}/orders`,
    },
    BLOGS: {
      GET_ALL: `${API_BASE_URL}/api/v1/admin/blogs`,
      GET_BY_ID: (id) => `${API_BASE_URL}/api/v1/admin/blogs/${id}`,
      CREATE: `${API_BASE_URL}/api/v1/admin/blogs`,
      UPDATE: (id) => `${API_BASE_URL}/api/v1/admin/blogs/${id}`,
      UPDATE_THUMBNAIL: (id) => `${API_BASE_URL}/api/v1/admin/blogs/${id}/thumbnail`,
      DELETE: (id) => `${API_BASE_URL}/api/v1/admin/blogs/${id}`,
    },
  },
  PRODUCTS: {
    DETAILS: (id) => `${API_BASE_URL}/api/v1/products/${id}`,
    GET_ALL: `${API_BASE_URL}/api/v1/products`,
    GET_LATEST: `${API_BASE_URL}/api/v1/products/latest`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/v1/products/${id}`,
  },
  CATEGORIES: {
    LIST: `${API_BASE_URL}/api/v1/categories`,
    PRODUCTS: (id, page = 1, limit = 12) => `${API_BASE_URL}/api/v1/categories/${id}/products?page=${page}&limit=${limit}`,
  },
  CART: {
    GET_ITEMS: `${API_BASE_URL}/api/v1/cart/items`,
    ADD_ITEM: `${API_BASE_URL}/api/v1/cart/items`,
    UPDATE_QUANTITY: (id) => `${API_BASE_URL}/api/v1/cart/items/${id}`,
    INCREMENT_DECREMENT: (id) => `${API_BASE_URL}/api/v1/cart/items/${id}`,
    DELETE_ITEM: (id) => `${API_BASE_URL}/api/v1/cart/items/${id}`,
  },
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/v1/cart/orders`,
    GET_ALL: (page = 1, limit = 10) => `${API_BASE_URL}/api/v1/cart/orders?page=${page}&limit=${limit}`,
    GET_BY_ID: (id) => `${API_BASE_URL}/api/v1/cart/orders/${id}`,
  },
  BLOGS: {
    GET_ALL: `${API_BASE_URL}/api/v1/blogs`,
    GET_LATEST: `${API_BASE_URL}/api/v1/blogs/latest`,
    GET_BY_SLUG: (slug) => `${API_BASE_URL}/api/v1/blogs/${slug}`,
  },
  PAYMENT: {
    CREATE_CHECKOUT_SESSION: `${API_BASE_URL}/api/v1/payment/checkout`,
  },
  USER: {
    PROFILE: `${API_BASE_URL}/api/v1/user/profile`,
    LIKED_PRODUCTS: `${API_BASE_URL}/api/v1/user/liked-products`,
    ADD_LIKED_PRODUCT: `${API_BASE_URL}/api/v1/user/liked-products`,
    REMOVE_LIKED_PRODUCT: (productId) => `${API_BASE_URL}/api/v1/user/liked-products/${productId}`,
    CHECK_LIKED_PRODUCT: (productId) => `${API_BASE_URL}/api/v1/user/liked-products/${productId}/check`,
    ORDERS: `${API_BASE_URL}/api/v1/user/orders`,
    ORDER_BY_ID: (orderId) => `${API_BASE_URL}/api/v1/user/orders/${orderId}`,
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
      'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Store reference to auth functions (will be set by AuthContext)
let getAccessTokenFn = null;
let setAccessTokenFn = null;
let refreshAccessTokenFn = null;

export const setAuthFunctions = (getToken, setToken, refreshToken) => {
  getAccessTokenFn = getToken;
  setAccessTokenFn = setToken;
  refreshAccessTokenFn = refreshToken;
};

// Request interceptor - add access token to requests
api.interceptors.request.use((config) => {
  // Skip adding token for auth endpoints
  const isAuthEndpoint = config.url?.includes('/auth/login') || 
                        config.url?.includes('/auth/register') ||
                        config.url?.includes('/auth/refresh');

  if (!isAuthEndpoint && getAccessTokenFn) {
    const token = getAccessTokenFn();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // If sending FormData, let the browser set Content-Type with boundary
  if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
  }
  
  return config;
});

// Response interceptor - handle token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Wait for the current refresh to complete
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessTokenFn();
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Refresh token expired - redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default API_ENDPOINTS;
