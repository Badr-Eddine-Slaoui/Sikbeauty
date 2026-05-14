"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@/utils/react-router-dom';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

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
      className="shrink-0 w-[300px] mb-5 h-[420px] bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group flex flex-col"
    >
      <div className="w-full h-[180px] relative overflow-hidden shrink-0">
        <Image
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          src={buildImageUrl(blog.thumbnailUrl)}
          alt={blog.title}
          fill
          sizes="300px"
        />
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <Calendar size={14} />
          <span style={{ fontFamily: "'Montserrat', sans-serif" }}>
            {formatDate(blog.createdAt)}
          </span>
        </div>

        <h3
          className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-brandRed transition-colors duration-300 h-14"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {blog.title}
        </h3>

        <p
          className="text-gray-600 text-sm line-clamp-2 leading-relaxed mb-4 h-10"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          {blog.excerpt || 'Découvrez nos conseils beauté et astuces pour sublimer votre peau...'}
        </p>

        <span
          className="inline-flex items-center text-brandRed text-sm font-medium group-hover:text-brandBrown transition-colors duration-300 mt-auto"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Lire l'article
          <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-300" />
        </span>
      </div>
    </Link>
  );
}

export default function BlogSlider({ initialBlogs = [] }) {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [loading, setLoading] = useState(initialBlogs.length === 0);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (initialBlogs.length > 0) return;
    
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.get(`${API_ENDPOINTS.BLOGS.GET_LATEST}?limit=6`);
        setBlogs(response.data?.data || []);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Échec du chargement des blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [initialBlogs]);

  const checkScrollButtons = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        slider.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [blogs]);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-center text-3xl sm:text-4xl mb-14 text-brandRed uppercase font-semibold"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            BLOG BEAUTÉ
          </h2>
          <div className="flex justify-center items-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[300px] h-[420px] bg-white rounded-2xl shadow-lg animate-pulse flex flex-col">
                <div className="h-[180px] bg-gray-200 rounded-t-2xl shrink-0" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || blogs.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-center text-3xl sm:text-4xl mb-4 text-brandRed uppercase font-semibold"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          BLOG BEAUTÉ
        </h2>
        <p
          className="text-center text-gray-600 mb-12 max-w-2xl mx-auto"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          Découvrez nos conseils beauté, routines skincare et dernières tendances K-beauty
        </p>

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-brandRed hover:text-white transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {blogs.map((blog) => (
              <div key={blog.id} className="snap-start">
                <BlogCard blog={blog} apiBaseUrl={apiBaseUrl} />
              </div>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-brandRed hover:text-white transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brandRed text-white font-semibold rounded-full hover:bg-brandBrown transition-colors duration-300"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Voir tous les articles
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
