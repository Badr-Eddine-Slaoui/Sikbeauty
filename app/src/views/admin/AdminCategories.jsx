"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { Plus, Edit, X, Save } from 'lucide-react';
import QuickActions from '../../components/Admin/QuickActions';
import Pagination from '../../components/Admin/Pagination';

const categoryActions = [
  {
    id: 'categories',
    title: 'Category Management',
    description: 'Organise product lines and maintain a clear browsing hierarchy.',
    buttons: ['Add Category', 'Manage Categories'],
    icon: '🧭',
  },
];

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [categoryProductCounts, setCategoryProductCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.ADMIN.CATEGORIES.GET_ALL);
        const categoriesData = Array.isArray(response.data)
          ? response.data
          : (response.data?.data || []);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Échec du chargement des catégories');
        toast.error('Échec du chargement des catégories');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch product totals per category (because /api/v1/products doesn't include categoryId)
  useEffect(() => {
    const fetchCounts = async () => {
      if (!Array.isArray(categories) || categories.length === 0) return;

      try {
        const results = await Promise.all(
          categories.map(async (category) => {
            const categoryId = category?.id ?? category?._id;
            if (!categoryId) return null;

            const response = await api.get(API_ENDPOINTS.CATEGORIES.PRODUCTS(categoryId, 1, 1));
            const totalItems = response.data?.pageInfo?.totalItems;
            const count = typeof totalItems === 'number' ? totalItems : 0;
            return [categoryId.toString(), count];
          })
        );

        const nextCounts = {};
        results.filter(Boolean).forEach(([categoryId, count]) => {
          nextCounts[categoryId] = count;
        });
        setCategoryProductCounts(nextCounts);
      } catch (err) {
        console.error('Error fetching category product counts:', err);
      }
    };

    fetchCounts();
  }, [categories]);

  // Calculate product counts per category
  const getProductCount = (categoryId) => {
    const key = categoryId?.toString();
    if (!key) return 0;
    return categoryProductCounts[key] ?? 0;
  };

  // Calculate progress bar width (normalized to max category count)
  const getProgress = (categoryId) => {
    if (categories.length === 0) return 0;
    const counts = categories.map((cat) => getProductCount(cat.id));
    const maxCount = Math.max(...counts, 1);
    const count = getProductCount(categoryId);
    return Math.round((count / maxCount) * 100);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
    });
    setEditingCategory(null);
    setShowForm(false);
    setError(null);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const payload = {
        name: formData.name.trim(),
        ...(formData.slug.trim() && { slug: formData.slug.trim() }),
      };

      const response = await api.post(API_ENDPOINTS.ADMIN.CATEGORIES.CREATE, payload);
      toast.success('Catégorie créée avec succès');
      setCategories((prev) => [...prev, response.data.data]);
      resetForm();
    } catch (err) {
      console.error('Error creating category:', err);
      const errorMessage = err.response?.data?.message || 'Échec de la création de la catégorie';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const payload = {};
      if (formData.name.trim()) payload.name = formData.name.trim();
      if (formData.slug.trim()) payload.slug = formData.slug.trim();

      if (Object.keys(payload).length === 0) {
        setError('Please provide at least one field to update');
        return;
      }

      await api.put(API_ENDPOINTS.ADMIN.CATEGORIES.UPDATE(editingCategory.id), payload);
      toast.success('Catégorie mise à jour avec succès');
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...payload } : cat
        )
      );
      resetForm();
    } catch (err) {
      console.error('Error updating category:', err);
      const errorMessage = err.response?.data?.message || 'Échec de la mise à jour de la catégorie';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
    });
    setShowForm(true);
  };

  const handleQuickAction = (buttonText) => {
    if (buttonText === 'Add Category') {
      resetForm();
      setShowForm(true);
    } else if (buttonText === 'Manage Categories') {
      setShowForm(true);
    }
  };

  const categorySummary = categories.map((category) => {
    const productCount = getProductCount(category.id);
    return {
      ...category,
      products: productCount,
    };
  });

  // Pagination logic
  const totalPages = Math.ceil(categorySummary.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categorySummary.slice(startIndex, endIndex);

  return (
    <>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-[#B5483A]/10 bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2
                className="text-xl font-semibold text-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>
              <button
                onClick={resetForm}
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              {error && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!editingCategory}
                  placeholder="e.g., Skincare, Makeup"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-[#B5483A] focus:outline-none focus:ring-2 focus:ring-[#B5483A]/20"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Slug <span className="text-gray-400 text-xs">(Optional - auto-generated if empty)</span>
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="e.g., skincare, makeup"
                  pattern="^[a-z0-9-]+$"
                  title="Slug must only contain lowercase letters, numbers, and hyphens"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:border-[#B5483A] focus:outline-none focus:ring-2 focus:ring-[#B5483A]/20"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Only lowercase letters, numbers, and hyphens allowed
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brandRed px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandRed/90"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {editingCategory ? (
                    <>
                      <Save size={16} />
                      Update
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                Catégories ({categorySummary.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Gérez vos catégories de produits
              </p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <Plus size={18} />
              Ajouter une catégorie
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandRed mx-auto mb-4"></div>
              <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>Chargement des catégories...</p>
            </div>
          </div>
        ) : error && categories.length === 0 ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>{error}</p>
          </div>
        ) : categorySummary.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Aucune catégorie trouvée. Créez votre première catégorie!
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Nom
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Produits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {category.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {category.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-brandRed/10 text-brandRed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                          {category.products} produit{category.products !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEdit(category)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors cursor-pointer"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          <Edit size={16} />
                          Modifier
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

    </>
  );
}