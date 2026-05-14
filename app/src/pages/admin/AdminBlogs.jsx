"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { Plus, Edit, Trash2, X, Save, Eye, EyeOff, Image, Bold, Italic, List, ListOrdered, Heading, ArrowLeft } from 'lucide-react';
import Pagination from '../../components/Admin/Pagination';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'form'
  const [editingBlog, setEditingBlog] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    isPublished: false,
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const editorRef = useRef(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}`;
  };

  // Fetch blogs
  const fetchBlogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`${API_ENDPOINTS.ADMIN.BLOGS.GET_ALL}?page=${page}&limit=5&published=all`);
      const data = response.data;
      setBlogs(data.data || []);
      setPagination({
        currentPage: data.pageInfo?.currentPage || 1,
        totalPages: data.pageInfo?.totalPages || 1,
        totalItems: data.pageInfo?.totalItems || 0,
      });
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Échec du chargement des blogs');
      toast.error('Échec du chargement des blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      isPublished: false,
    });
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setEditingBlog(null);
    setViewMode('list');
    setError(null);
    setValidationErrors({});
  };

  const handleCreateBlog = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Le titre est requis';
    }
    if (!formData.content.trim() || formData.content === '<br>') {
      errors.content = 'Le contenu est requis';
    }
    if (!thumbnailFile) {
      errors.thumbnail = 'L\'image miniature est requise';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Veuillez corriger les erreurs de validation');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('content', formData.content);
      if (formData.excerpt.trim()) {
        formDataToSend.append('excerpt', formData.excerpt.trim());
      }
      formDataToSend.append('isPublished', formData.isPublished.toString());
      formDataToSend.append('thumbnail', thumbnailFile);

      await api.post(API_ENDPOINTS.ADMIN.BLOGS.CREATE, formDataToSend);
      toast.success('Blog créé avec succès');
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error('Error creating blog:', err);
      const errorMessage = err.response?.data?.message || 'Échec de la création du blog';
      const apiErrors = err.response?.data?.errors || {};
      setError(errorMessage);
      setValidationErrors(apiErrors);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Le titre est requis';
    }
    if (!formData.content.trim() || formData.content === '<br>') {
      errors.content = 'Le contenu est requis';
    }
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Veuillez corriger les erreurs de validation');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);

      const payload = {};
      if (formData.title.trim()) payload.title = formData.title.trim();
      if (formData.content) payload.content = formData.content;
      if (formData.excerpt.trim()) payload.excerpt = formData.excerpt.trim();
      payload.isPublished = formData.isPublished;

      await api.put(API_ENDPOINTS.ADMIN.BLOGS.UPDATE(editingBlog.id), payload);

      // Update thumbnail if new file selected
      if (thumbnailFile) {
        const thumbnailFormData = new FormData();
        thumbnailFormData.append('thumbnail', thumbnailFile);
        await api.patch(API_ENDPOINTS.ADMIN.BLOGS.UPDATE_THUMBNAIL(editingBlog.id), thumbnailFormData);
      }

      toast.success('Blog mis à jour avec succès');
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error('Error updating blog:', err);
      const errorMessage = err.response?.data?.message || 'Échec de la mise à jour du blog';
      const apiErrors = err.response?.data?.errors || {};
      setError(errorMessage);
      setValidationErrors(apiErrors);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce blog ?')) return;

    try {
      await api.delete(API_ENDPOINTS.ADMIN.BLOGS.DELETE(id));
      toast.success('Blog supprimé avec succès');
      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
      toast.error(err.response?.data?.message || 'Échec de la suppression du blog');
    }
  };

  const handleEdit = async (blog) => {
    try {
      const response = await api.get(API_ENDPOINTS.ADMIN.BLOGS.GET_BY_ID(blog.id));
      const fullBlog = response.data?.data || response.data;
      
      setEditingBlog(fullBlog);
      setFormData({
        title: fullBlog.title || '',
        content: fullBlog.content || '',
        excerpt: fullBlog.excerpt || '',
        isPublished: fullBlog.isPublished || false,
      });
      setThumbnailPreview(buildImageUrl(fullBlog.thumbnailUrl));
      setThumbnailFile(null);
      setViewMode('form');
    } catch (err) {
      console.error('Error fetching blog details:', err);
      toast.error('Échec du chargement des détails du blog');
    }
  };

  // Initialize editor content when switching to form view
  useEffect(() => {
    if (viewMode === 'form' && editorRef.current) {
      editorRef.current.innerHTML = formData.content || '';
    }
  }, [viewMode]);

  // Execute formatting command on contentEditable
  const execFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    syncEditorContent();
  };

  // Sync contentEditable content to state
  const syncEditorContent = () => {
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Render Form View
  const renderForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={resetForm}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft size={20} />
          <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Retour à la liste</span>
        </button>
      </div>

      <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
        <h2
          className="text-xl font-semibold text-gray-900 mb-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {editingBlog ? 'Modifier l\'article' : 'Créer un nouvel article'}
        </h2>

        <form onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Entrez le titre de l'article..."
                className={`w-full rounded-xl border px-4 py-3 text-sm focus:border-brandRed focus:outline-none focus:ring-2 focus:ring-brandRed/20 ${
                  validationErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
              {validationErrors.title && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.title}</p>
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-medium text-gray-700"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Extrait <span className="text-gray-400 text-xs">(Courte description pour les aperçus)</span>
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brève description de l'article..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-brandRed focus:outline-none focus:ring-2 focus:ring-brandRed/20 resize-none"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
            </div>

            {/* Content Editor - WYSIWYG */}
            <div>
              <label
                className="mb-2 block text-sm font-medium text-gray-700"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Contenu <span className="text-red-500">*</span>
              </label>
              <div className={`rounded-xl border overflow-hidden ${
                validationErrors.content ? 'border-red-500' : 'border-gray-300'
              }`}>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => execFormat('bold')}
                    className="p-2 rounded hover:bg-gray-200 transition font-bold"
                    title="Gras (Ctrl+B)"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('italic')}
                    className="p-2 rounded hover:bg-gray-200 transition italic"
                    title="Italique (Ctrl+I)"
                  >
                    <Italic size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => execFormat('formatBlock', 'h2')}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    title="Titre 2"
                  >
                    <Heading size={18} />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => execFormat('insertUnorderedList')}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    title="Liste à puces"
                  >
                    <List size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => execFormat('insertOrderedList')}
                    className="p-2 rounded hover:bg-gray-200 transition"
                    title="Liste numérotée"
                  >
                    <ListOrdered size={18} />
                  </button>
                </div>
                
                {/* Editor Area */}
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={syncEditorContent}
                  onBlur={syncEditorContent}
                  className="min-h-[350px] w-full p-4 bg-white focus:outline-none text-sm overflow-auto blog-editor"
                  style={{ 
                    fontFamily: "'Montserrat', sans-serif",
                    direction: 'ltr',
                    textAlign: 'left'
                  }}
                  suppressContentEditableWarning={true}
                >
                </div>
                <style>{`
                  .blog-editor img {
                    max-width: 200px;
                    height: auto;
                    border-radius: 8px;
                    margin: 8px 0;
                  }
                  .blog-editor h2 {
                    font-size: 1.25rem;
                    font-weight: 600;
                    margin: 16px 0 8px;
                  }
                  .blog-editor ul {
                    list-style-type: disc !important;
                    padding-left: 32px !important;
                    margin: 12px 0 !important;
                    display: block !important;
                  }
                  .blog-editor ol {
                    list-style-type: decimal !important;
                    padding-left: 32px !important;
                    margin: 12px 0 !important;
                    display: block !important;
                  }
                  .blog-editor li {
                    display: list-item !important;
                    margin-bottom: 6px !important;
                    line-height: 1.6 !important;
                  }
                  .blog-editor strong, .blog-editor b {
                    font-weight: 700 !important;
                  }
                  .blog-editor em, .blog-editor i {
                    font-style: italic !important;
                  }
                  .blog-editor a {
                    color: #dc2626;
                    text-decoration: underline;
                  }
                  .blog-editor p {
                    margin: 8px 0;
                  }
                `}</style>
              </div>
              {validationErrors.content && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.content}</p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                <strong>Conseils de formatage :</strong> Sélectionnez le texte et cliquez sur <strong>G</strong> pour gras ou <strong>I</strong> pour italique. Cliquez sur les boutons de liste pour créer des listes à puces ou numérotées. Cliquez sur titre pour les titres de section.
              </p>
            </div>

            {/* Thumbnail and Publish Options */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-gray-700"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Image miniature {!editingBlog && <span className="text-red-500">*</span>}
                </label>
                {validationErrors.thumbnail && (
                  <p className="mb-2 text-xs text-red-600">{validationErrors.thumbnail}</p>
                )}
                <div className="flex items-start gap-4">
                  <div className="relative h-32 w-32 rounded-xl border border-gray-300 bg-gray-100 overflow-hidden shrink-0">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Aperçu de la miniature"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Image size={32} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleThumbnailChange}
                        className="hidden"
                      />
                      <Image size={16} />
                      Choisir une image
                    </label>
                    <p className="mt-2 text-xs text-gray-500">Max 2 Mo. JPEG, PNG ou WebP.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition w-full">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="h-5 w-5 rounded border-gray-300 text-brandRed focus:ring-brandRed"
                  />
                  <div>
                    <span
                      className="text-sm font-medium text-gray-700 block"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Publier immédiatement
                    </span>
                    <span className="text-xs text-gray-500">
                      Rendre cet article visible au public
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting}
                className="flex-1 rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brandRed px-6 py-3 text-sm font-semibold text-white transition hover:bg-brandRed/90 disabled:opacity-50"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {submitting ? (
                  'Enregistrement...'
                ) : editingBlog ? (
                  <>
                    <Save size={18} />
                    Mettre à jour
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    Créer l'article
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );

  // Render List View
  const renderList = () => (
    <section className="rounded-3xl border border-brandRed/10 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="text-xl font-semibold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gestion des blogs
          </h2>
          <p
            className="mt-2 text-sm text-gray-600"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Créez et gérez les articles de blog pour votre site web.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setViewMode('form');
          }}
          className="flex items-center gap-2 rounded-xl bg-brandRed px-4 py-2 text-sm font-semibold text-white transition hover:bg-brandRed/90"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <Plus size={16} />
          Nouvel article
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-gray-500">Chargement des blogs...</div>
      ) : error && blogs.length === 0 ? (
        <div className="py-8 text-center text-red-500">{error}</div>
      ) : blogs.length === 0 ? (
        <div className="py-12 text-center">
          <Image size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Aucun blog trouvé. Créez votre premier article !
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="flex flex-col sm:flex-row gap-3 rounded-xl border border-gray-100 p-3 hover:border-gray-200 transition"
              >
                <div className="w-full sm:w-28 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <img
                    src={buildImageUrl(blog.thumbnailUrl)}
                    alt={blog.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3
                        className="text-sm font-semibold text-gray-900 truncate"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {blog.title}
                      </h3>
                      <p
                        className="mt-1 text-xs text-gray-500 line-clamp-2"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {blog.excerpt || 'Aucun extrait'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="rounded p-2 text-brandRed transition hover:bg-gray-100"
                        title="Modifier le blog"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="rounded p-2 text-red-500 transition hover:bg-red-50"
                        title="Supprimer le blog"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="text-gray-400">{formatDate(blog.createdAt)}</span>
                    <span
                      className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                        blog.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {blog.isPublished ? (
                        <>
                          <Eye size={12} />
                          Publié
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} />
                          Brouillon
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={fetchBlogs}
          />
        </>
      )}
    </section>
  );

  return (
    <div>
      {viewMode === 'form' ? renderForm() : renderList()}
    </div>
  );
}
