"use client";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from '@/utils/react-router-dom';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import ClientNavbar from '../../components/Client/ClientNavbar';

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=400&fit=crop&q=80';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const buildImageUrl = (path) => {
    if (!path) return PLACEHOLDER_IMAGE;
    if (path.startsWith('http') || path.startsWith('//')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${apiBaseUrl.replace(/\/$/, '')}/${cleanPath}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const estimateReadTime = (content) => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(API_ENDPOINTS.BLOGS.GET_BY_SLUG(slug));
        setBlog(response.data?.data || response.data);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError(err.response?.status === 404 ? 'Blog introuvable' : 'Échec du chargement du blog');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#fef7f5] via-white to-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8" />
            <div className="h-64 bg-gray-200 rounded-2xl mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fef7f5] via-white to-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1
            className="text-3xl font-bold text-gray-800 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {error === 'Blog introuvable' ? 'Blog introuvable' : 'Erreur'}
          </h1>
          <p
            className="text-gray-600 mb-8"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            L'article de blog que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brandRed text-white font-semibold rounded-full hover:bg-brandBrown transition-colors duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <ArrowLeft size={18} />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fef7f5] via-white to-white">
      <ClientNavbar />
      <article className="max-w-4xl mt-5 mx-auto px-4 py-8 sm:py-16 pt-24">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-brandRed hover:text-brandBrown transition-colors duration-300 mb-8"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          <ArrowLeft size={18} />
          Retour au blog
        </Link>

        <header className="mb-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {formatDate(blog.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {estimateReadTime(blog.content)} min de lecture
              </span>
            </div>
          </div>
        </header>

        <div className="w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-10 shadow-lg">
          <img
            src={buildImageUrl(blog.thumbnailUrl)}
            alt={blog.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        {blog.excerpt && (
          <p
            className="text-xl text-gray-600 mb-8 leading-relaxed border-l-4 border-brandRed pl-6 italic"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {blog.excerpt}
          </p>
        )}

        <div
          className="blog-content"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <style>{`
          .blog-content {
            font-size: 1.125rem;
            line-height: 1.8;
            color: #374151;
          }
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            margin: 32px auto;
            display: block;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .blog-content img:hover {
            transform: scale(1.02);
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
          }
          .blog-content h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            font-weight: 700;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #1f2937;
            border-bottom: 2px solid #fee2e2;
            padding-bottom: 0.5rem;
          }
          .blog-content h3 {
            font-family: 'Playfair Display', serif;
            font-size: 1.35rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #374151;
          }
          .blog-content ul {
            list-style-type: disc !important;
            margin: 1.5rem 0 !important;
            padding-left: 2rem !important;
            display: block !important;
          }
          .blog-content ol {
            list-style-type: decimal !important;
            margin: 1.5rem 0 !important;
            padding-left: 2rem !important;
            display: block !important;
          }
          .blog-content li {
            display: list-item !important;
            margin-bottom: 0.75rem !important;
            line-height: 1.8 !important;
            color: #374151 !important;
          }
          .blog-content strong, .blog-content b {
            font-weight: 700 !important;
            color: #1f2937 !important;
          }
          .blog-content em, .blog-content i {
            font-style: italic !important;
          }
          .blog-content blockquote {
            border-left: 4px solid #dc2626;
            padding-left: 1.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: #4b5563;
            background: #fef7f5;
            padding: 1rem 1.5rem;
            border-radius: 0 12px 12px 0;
          }
          .blog-content p {
            margin-bottom: 1.25rem;
            line-height: 1.8;
          }
          .blog-content a {
            color: #dc2626;
            text-decoration: underline;
            text-underline-offset: 2px;
            transition: color 0.2s;
          }
          .blog-content a:hover {
            color: #92400e;
          }
        `}</style>

        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-brandRed hover:text-brandBrown transition-colors duration-300"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <ArrowLeft size={18} />
              Voir plus d'articles
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
