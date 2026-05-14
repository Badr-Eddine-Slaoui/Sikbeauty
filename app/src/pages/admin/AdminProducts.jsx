"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import ScrollToTop from '../../components/ScrollTop';

import { X, Plus, Edit, Trash2, Save, XCircle } from 'lucide-react';
import Pagination from '../../components/Admin/Pagination';

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=500&fit=crop";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productCategoryMap, setProductCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    discountType: '',
    discount: 0,
    categoryId: '',
    status: true,
    images: [],
    video: null,
  });
  const [existingImages, setExistingImages] = useState([]); // Track existing images from product
  const [imagesToRemove, setImagesToRemove] = useState([]); // Track images to delete

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
        const categoriesData = Array.isArray(response.data)
          ? response.data
          : (response.data?.data || []);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  // Fetch products using admin endpoint
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.ADMIN.PRODUCTS.GET_ALL, {
          params: {
            page: '1',
            limit: '1000',
          },
        });
 
        // Endpoint returns { pageInfo, data }
        setProducts(response.data?.data || response.data?.products || response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Build a map productId -> category info (because /api/v1/products doesn't return categoryId/category)
  useEffect(() => {
    const buildProductCategoryMap = async () => {
      if (!Array.isArray(categories) || categories.length === 0) return;
      if (!Array.isArray(products) || products.length === 0) return;

      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const categoryId = category?.id ?? category?._id;
            if (!categoryId) return [];

            const response = await api.get(API_ENDPOINTS.CATEGORIES.PRODUCTS(categoryId, 1, 1000));
            const categoryProducts = response.data?.data || response.data?.products || response.data || [];
            if (!Array.isArray(categoryProducts)) return [];

            return categoryProducts
              .map((p) => {
                const productId = p?.id ?? p?._id;
                if (!productId) return null;
                return [productId.toString(), { categoryId: categoryId.toString(), categoryName: category.name }];
              })
              .filter(Boolean);
          })
        );

        const nextMap = {};
        results.flat().forEach(([productId, value]) => {
          // First match wins if duplicates exist
          if (!nextMap[productId]) nextMap[productId] = value;
        });
        setProductCategoryMap(nextMap);
      } catch (err) {
        console.error('Error building product category map:', err);
      }
    };

    buildProductCategoryMap();
  }, [categories, products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle discount type change - clear the other discount field
    if (name === 'discountType') {
      setFormData((prev) => ({
        ...prev,
        discountType: value,
        discount: 0,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'categoryId' ? value : name.includes('price') || name.includes('discount') 
        ? parseFloat(value) || 0 
        : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxAllowed = editingProduct ? Math.max(0, 5 - existingImages.length) : 5;
    const totalImages = formData.images.length + files.length;
    if (totalImages > maxAllowed) {
      toast.error(`Maximum ${maxAllowed} images allowed. Please remove some images first.`);
      return;
    }
    
    // Validate image sizes (max 2MB each as per backend)
    const oversized = files.filter(file => file.size > 2 * 1024 * 1024);
    if (oversized.length > 0) {
      toast.error(`Image size exceeds 2MB: ${oversized.map(f => f.name).join(', ')}`);
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
    setError(null);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate video size (max 10MB as per backend)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Video size exceeds 10MB: ${file.name}`);
        return;
      }
      
      // Validate video type (mp4 only as per backend schema)
      if (file.type !== 'video/mp4') {
        toast.error('Only MP4 video format is allowed');
        return;
      }
      
      setFormData((prev) => ({
        ...prev,
        video: file,
      }));
      setError(null);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Remove existing image (mark for deletion)
  const removeExistingImage = (imageItem) => {
    // Add to imagesToRemove
    setImagesToRemove((prev) => [...prev, imageItem.index]);
    // Remove from existingImages
    setExistingImages((prev) => prev.filter(img => img.index !== imageItem.index));
  };

  const removeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: null,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      discountType: '',
      discount: 0,
      categoryId: '',
      status: true,
      images: [],
      video: null,
    });
    setExistingImages([]);
    setImagesToRemove([]);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const showValidationError = (message) => {
      toast.error(message);
    };

    try {
      if (editingProduct) {
        // UPDATE EXISTING PRODUCT
        // Validate required fields for update
        if (!formData.title?.trim() || !formData.description?.trim() || !formData.categoryId) {
          showValidationError('Please fill in all required fields');
          setLoading(false);
          return;
        }

        // First, delete images marked for removal
        const imagesToDelete = [...imagesToRemove].sort((a, b) => b - a);
        for (const imageToRemove of imagesToDelete) {
          try {
            if (typeof imageToRemove === 'number' && imageToRemove >= 0) {
              // Delete image using imageId (1-based index)
              await api.delete(API_ENDPOINTS.ADMIN.PRODUCTS.DELETE_IMAGE(editingProduct.id, imageToRemove + 1));
            }
          } catch (err) {
            console.error(`Error deleting image:`, err);
            // Continue with other operations even if one deletion fails
          }
        }

        // Update product info
        const nextDiscountType = formData.discountType ? formData.discountType : undefined;
        const nextDiscountRaw = parseFloat(formData.discount) || 0;
        const nextDiscount = nextDiscountType === 'PRICE'
          ? Math.round(nextDiscountRaw * 100)
          : Math.round(nextDiscountRaw);

        const updateData = {
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          ...(nextDiscountType ? { discountType: nextDiscountType } : {}),
          discount: nextDiscount,
          categoryId: parseInt(formData.categoryId, 10),
          status: formData.status,
        };

        await api.put(
          API_ENDPOINTS.ADMIN.PRODUCTS.UPDATE(editingProduct.id), 
          updateData
        );

        // Add new images (one at a time since backend only accepts maxCount: 1)
        if (formData.images.length > 0) {
          for (const image of formData.images) {
            const imageFormData = new FormData();
            imageFormData.append('image', image);
            await api.post(
              API_ENDPOINTS.ADMIN.PRODUCTS.ADD_IMAGE_OR_VIDEO(editingProduct.id),
              imageFormData
            );
          }
        }

        resetForm();
        // Refresh products list
        const productsResponse = await api.get(API_ENDPOINTS.ADMIN.PRODUCTS.GET_ALL, {
          params: {
            page: '1',
            limit: '1000',
          },
        });
        setProducts(productsResponse.data?.data || productsResponse.data?.products || productsResponse.data || []);
        
        // Show success message
        setError(null);
        toast.success('Product updated successfully!');
      } else {
        // CREATE NEW PRODUCT - Send FormData (with images/video)
        // Validate required fields for create
        if (!formData.title?.trim() || !formData.description?.trim() || !formData.categoryId || formData.images.length === 0) {
          showValidationError('Please fill in all required fields and upload at least one image');
          setLoading(false);
          return;
        }

        const formDataToSend = new FormData();
        
        // Append basic fields - match the API schema exactly
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('price', formData.price.toString());
        if (formData.discountType) {
          formDataToSend.append('discountType', formData.discountType);
        }
        formDataToSend.append('discount', (parseFloat(formData.discount) || 0).toString());
        formDataToSend.append('categoryId', formData.categoryId.toString());
        // Do NOT send status on create: backend create schema is strict and doesn't accept it.

        // Append images - backend expects field name 'images' with multiple files
        // Max 5 images as per backend validation
        formData.images.slice(0, 5).forEach((image) => {
          formDataToSend.append('images', image);
        });

        // Append video if exists - backend expects field name 'video' with single file
        if (formData.video) {
          formDataToSend.append('video', formData.video);
        }

        // Create new product
        const response = await api.post(
          API_ENDPOINTS.ADMIN.PRODUCTS.CREATE, 
          formDataToSend
        );

        resetForm();
        // Refresh products list
        const productsResponse = await api.get(API_ENDPOINTS.ADMIN.PRODUCTS.GET_ALL, {
          params: {
            page: '1',
            limit: '1000',
          },
        });
        setProducts(productsResponse.data?.data || productsResponse.data?.products || productsResponse.data || []);
        
        // Show success message
        setError(null);
        toast.success('Product created successfully!');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      const backendFieldErrors = err.response?.data?.errors?.fieldErrors;
      const firstFieldError = backendFieldErrors
        ? Object.values(backendFieldErrors).flat().filter(Boolean)[0]
        : null;

      const errorMessage = firstFieldError ||
                          err.response?.data?.message ||
                          err.response?.data?.error ||
                          err.message ||
                          'Failed to save product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    const openEditor = async () => {
      const productId = product?._id || product?.id;
      if (!productId) return;

      setLoading(true);
      try {
        const response = await api.get(API_ENDPOINTS.PRODUCTS.GET_BY_ID(productId));
        const detailedProduct = response.data?.data || response.data;
        setEditingProduct(detailedProduct);

        // Determine discount type based on existing values
        const discountType = detailedProduct.discountType || '';
        const rawDiscount = detailedProduct.discount ?? 0;
        const parsedDiscount = typeof rawDiscount === 'string' ? parseFloat(rawDiscount) || 0 : rawDiscount;
        const discount = discountType === 'PRICE' ? (parsedDiscount / 100) : parsedDiscount;

        const existingImgs = [];
        if (Array.isArray(detailedProduct.images)) {
          detailedProduct.images.forEach((img, idx) => {
            existingImgs.push({ url: img, index: idx });
          });
        }

        setExistingImages(existingImgs);
        setImagesToRemove([]);

        const productIdForMap = (detailedProduct?.id ?? detailedProduct?._id)?.toString();
        const mappedCategoryId = productIdForMap ? productCategoryMap[productIdForMap]?.categoryId : '';

        setFormData({
          title: detailedProduct.title || '',
          description: detailedProduct.description || '',
          price: typeof detailedProduct.price === 'string' ? parseFloat(detailedProduct.price) || 0 : (detailedProduct.price || 0),
          discountType: discountType,
          discount: discount || 0,
          categoryId: (detailedProduct.categoryId ?? detailedProduct.category?.id ?? detailedProduct.category?._id ?? detailedProduct.category ?? mappedCategoryId ?? '')?.toString(),
          status: detailedProduct.status !== undefined ? detailedProduct.status : true,
          images: [],
          video: null,
        });

        setShowForm(true);
      } catch (err) {
        console.error('Error fetching product details:', err);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    openEditor();
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      setIsDeleting(true);
      const productId = productToDelete._id || productToDelete.id;
      await api.delete(API_ENDPOINTS.ADMIN.PRODUCTS.DELETE(productId));
      // Refresh products list
      const response = await api.get(API_ENDPOINTS.ADMIN.PRODUCTS.GET_ALL, {
        params: {
          page: '1',
          limit: '1000',
        },
      });
      setProducts(response.data?.data || response.data?.products || response.data || []);
      setProductToDelete(null);
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete product';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith("http") || path.startsWith("//")) return path;
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    // Paths from backend are like "uploads/images/..." so we need to ensure proper URL construction
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiBaseUrl.replace(/\/$/, '')}${cleanPath}`;
  };

  // Get category name from categoryId
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'N/A';
    const categoryIdStr = categoryId?.toString();
    const category = categories.find(cat => (cat.id ?? cat._id)?.toString() === categoryIdStr);
    return category ? category.name : 'N/A';
  };

  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);
  const remainingImageSlots = editingProduct ? Math.max(0, 5 - existingImages.length) : 5;

  // Reset to page 1 when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  return (
    <>
    <ScrollToTop />
      {/* Products List */}
      <div className="space-y-4">

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {error}
          </div>
        )}

        {loading && !showForm && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed mx-auto"></div>
          </div>
        )}

        {/* Products Table */}
        {!showForm && products.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Produits ({products.length})
                  </h2>
                  <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Gérez votre catalogue de produits
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <Plus size={18} />
                  Ajouter un produit
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Prix
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Réduction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product) => {
                    // Use thumbnailUrl from the product, or first image from images array
                    const imagePath = product.thumbnailUrl || (product.images && product.images.length > 0 ? product.images[0] : null);
                    const imageUrl = imagePath ? buildImageUrl(imagePath) : PLACEHOLDER_IMAGE;
                    const productIdForMap = (product?.id ?? product?._id)?.toString();
                    const mappedCategory = productIdForMap ? productCategoryMap[productIdForMap] : null;
                    const categoryId = product.categoryId ?? product.category?.id ?? product.category?._id ?? product.category ?? mappedCategory?.categoryId;
                    const categoryName = product.category?.name || mappedCategory?.categoryName || getCategoryName(categoryId);

                    return (
                      <tr key={product._id || product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img src={imageUrl} alt={product.title} className="w-12 h-12 object-cover rounded-lg" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {product.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {product.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {categoryName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            ${product.price || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.discountType === 'PERCENT' && (parseFloat(product.discount) || 0) > 0 ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              {parseFloat(product.discount) || 0}%
                            </span>
                          ) : product.discountType === 'PRICE' && (parseFloat(product.discount) || 0) > 0 ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              ${parseFloat(product.discount).toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400" style={{ fontFamily: "'Montserrat', sans-serif" }}>Aucune</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.status === false ? (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              Inactif
                            </span>
                          ) : (
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                              Actif
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1.5 text-brandRed hover:bg-brandRed/10 rounded-lg transition cursor-pointer"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {!showForm && products.length === 0 && !loading && (
          <div className="text-center py-12 rounded-3xl border border-brandRed/10 bg-white">
            <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              No products found. Create your first product!
            </p>
          </div>
        )}
      </div>

      {/* Product Form */}
      {showForm && (
        <div className="rounded-3xl border border-brandRed/10 bg-white shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-2xl font-semibold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Category *
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id || category._id} value={(category.id ?? category._id)?.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Individual */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              {/* Discount Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Discount Type
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="">No Discount</option>
                  <option value="PERCENT">Discount Percentage (%)</option>
                  <option value="PRICE">Discount Amount ($)</option>
                </select>
              </div>

              {/* Discount Percentage - Only show if percentage is selected */}
              {formData.discountType === 'PERCENT' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Discount Percentage *
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    placeholder="Enter percentage (e.g., 5 for 5%)"
                  />
                </div>
              )}

              {/* Discount Threshold - Only show if threshold is selected */}
              {formData.discountType === 'PRICE' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Discount Amount ($) *
                  </label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                    placeholder="Enter amount (e.g., 5 for $5 off)"
                  />
                </div>
              )}

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value === 'true' }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>

              {/* Images */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Product Images {!editingProduct && '*'} (Max 5 images, 2MB each)
                  {editingProduct && (
                    <span className="text-xs text-gray-500 font-normal ml-2">
                      (You can add up to {remainingImageSlots} more)
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  disabled={remainingImageSlots === 0 || formData.images.length >= remainingImageSlots}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                {editingProduct && remainingImageSlots === 0 && (
                  <p className="mt-2 text-xs text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                    Maximum images reached. Remove an existing image to add a new one.
                  </p>
                )}
                {editingProduct && editingProduct.thumbnailUrl && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Current Thumbnail:
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="relative border-2 rounded-lg overflow-hidden border-gray-200">
                        <img
                          src={buildImageUrl(editingProduct.thumbnailUrl)}
                          alt="Current thumbnail"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {editingProduct && existingImages.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Current Images:
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {existingImages.map((imageItem) => (
                        <div
                          key={`existing-${imageItem.index}`}
                          className="relative border-2 rounded-lg overflow-hidden border-gray-200"
                        >
                          <img
                            src={buildImageUrl(imageItem.url)}
                            alt={`Current image ${imageItem.index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute bottom-2 left-2 right-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imageItem)}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                              title="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      New Images Selected: {formData.images.length} of 5
                    </p>
                    <div className="grid grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div
                          key={index}
                          className="relative border-2 rounded-lg overflow-hidden border-gray-200"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute bottom-2 left-2 right-2 flex justify-end">
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                              title="Remove image"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-2 truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Video */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Product Video (MP4 only, Max 10MB)
                  {editingProduct && <span className="text-xs text-gray-500 font-normal ml-2">(Leave empty to keep existing video)</span>}
                </label>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleVideoChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5483A] focus:border-transparent"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                {editingProduct && editingProduct.videoUrl && !formData.video && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        Current video: {editingProduct.videoUrl.split('/').pop()}
                      </span>
                    </div>
                  </div>
                )}
                {formData.video && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700 flex-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        New video: {formData.video.name} ({(formData.video.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Remove video"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-brandRed text-white rounded-xl hover:bg-[#a04034] transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold text-gray-900"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Delete Product
                </h3>
                <p className="text-sm text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  This action cannot be undone
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Are you sure you want to delete <span className="font-semibold text-gray-900">"{productToDelete.title}"</span>? 
                This will permanently remove the product and all associated files.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={cancelDelete}
                disabled={isDeleting}
                className="px-4 py-2 cursor-pointer border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

