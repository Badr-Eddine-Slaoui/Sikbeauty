"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from '@/utils/react-router-dom';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { Calendar, ChevronRight, ChevronLeft } from 'lucide-react';
import ClientNavbar from '../../components/Client/ClientNavbar';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&q=80';

import Image from 'next/image';

function BlogCard({ blog, apiBaseUrl }) {
  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
    >
      <div className="w-full h-48 sm:h-56 relative overflow-hidden">
        <Image
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          src={buildImageUrl(blog.thumbnailUrl)}
          alt={blog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar size={14} />
          <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {formatDate(blog.createdAt)}
          </span>
        </div>

        <h3
          className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-brandRed transition-colors duration-300"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {blog.title}
        </h3>

        <p
          className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {blog.excerpt || 'Découvrez nos conseils beauté et astuces pour sublimer votre peau...'}
        </p>

        <span
          className="inline-flex items-center text-brandRed text-sm font-medium group-hover:text-brandBrown transition-colors duration-300"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Lire l'article
          <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogListPage({ initialBlogsData = null }) {
  const [blogs, setBlogs] = useState(initialBlogsData?.data || []);
  const [loading, setLoading] = useState(!initialBlogsData);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: initialBlogsData?.pageInfo?.currentPage || 1,
    totalPages: initialBlogsData?.pageInfo?.totalPages || 1,
    totalItems: initialBlogsData?.pageInfo?.totalItems || 0,
  });

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const fetchBlogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.get(`${API_ENDPOINTS.BLOGS.GET_ALL}?page=${page}&limit=9`);
      const data = response.data;
      setBlogs(data.data || []);
      setPagination({
        currentPage: data.pageInfo?.currentPage || 1,
        totalPages: data.pageInfo?.totalPages || 1,
        totalItems: data.pageInfo?.totalItems || 0,
      });
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialBlogsData) {
      fetchBlogs();
    }
  }, [fetchBlogs, initialBlogsData]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBlogs(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [fetchBlogs, pagination.totalPages]);

  const handleRetry = useCallback(() => fetchBlogs(), [fetchBlogs]);

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fef7f5] via-white to-white">
      <ClientNavbar />
      <div className="max-w-7xl mt-20 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pt-24">
        <header className="text-center mb-12">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brandRed uppercase mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Blog Beauté
          </h1>
          <p
            className="text-gray-600 max-w-2xl mx-auto"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Découvrez nos conseils beauté, routines skincare et dernières tendances K-beauty pour sublimer votre peau au quotidien.
          </p>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg animate-pulse">
                <div className="h-56 bg-gray-200 rounded-t-2xl" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p
              className="text-gray-600 mb-4"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-brandRed text-white font-semibold rounded-full hover:bg-brandBrown transition-colors duration-300"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Réessayer
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Aucun article de blog pour le moment. Revenez bientôt !
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} apiBaseUrl={apiBaseUrl} />
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  aria-label="Page précédente"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <ChevronLeft size={18} />
                  Précédent
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Page ${page}`}
                      className={`w-10 h-10 rounded-full font-medium transition-colors ${
                        page === pagination.currentPage
                          ? 'bg-brandRed text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  aria-label="Page suivante"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Suivant
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
