"use client";
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from '@/utils/react-router-dom';
import { Menu, X } from 'lucide-react';

export default function AdminSidebar({ navLinks, activeSection, onSelect }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden rounded-lg bg-brandRed p-2 text-white shadow-lg"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-white shadow-lg transition-all duration-300 overflow-y-auto ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 ${
        isCollapsed ? 'lg:w-20' : 'lg:w-72'
      } w-72`}>
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-br from-[#B5483A] via-[#c35a4c] to-[#f0d6d1] opacity-90" aria-hidden="true" />
      <div className="relative px-6 pt-10 pb-4 text-white">
        {!isCollapsed && (
          <p
            className="text-xl text-center uppercase tracking-[0.3em] text-white/80"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Sikbeauty
          </p>
        )}
        
        {/* Desktop Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute right-4 top-4  text-white transition-all duration-200 items-center justify-center"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      <nav className="relative border-t bg-gray-50 border-white/10 px-3 py-3 lg:mt-2">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const IconComponent = link.icon;
            return (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect?.(link.id);
                    if (window.innerWidth < 1024) {
                      setIsOpen(false);
                    }
                  }}
                  className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-brandRed text-white shadow-md'
                      : 'text-gray-700 hover:bg-brandRed/10 hover:text-brandRed'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                  aria-current={isActive ? 'page' : undefined}
                  title={isCollapsed ? link.label : ''}
                >
                  <span className={`flex items-center gap-3`}>
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-brandRed/10 text-brandRed group-hover:bg-brandRed/20'
                      }`}
                    >
                      <IconComponent size={16} />
                    </span>
                    <span className={isCollapsed ? 'hidden lg:hidden' : ''}>{link.label}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-sm transition ${isActive ? 'translate-x-1 opacity-100' : 'opacity-60 group-hover:translate-x-1 group-hover:opacity-100'} ${isCollapsed ? 'hidden' : ''}`}
                  >
                    →
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative border-t border-white/10 mt-auto px-4 py-3">
        {!isCollapsed && (
          <>
            <p
              className="text-xs uppercase tracking-wide text-gray-500"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Besoin d'aide ?
            </p>
            <p
              className="mt-2 text-xs text-gray-600"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Contactez l'équipe de support.
            </p>
          </>
        )}
        <button
          className={`mt-3 cursor-pointer w-full rounded-lg bg-brandRed px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a04034] ${isCollapsed ? 'text-center' : ''}`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          title={isCollapsed ? 'Support' : ''}
        >
          {isCollapsed ? 'S' : 'Support'}
        </button>

        <button onClick={handleLogout}
          className={`mt-2 w-full cursor-pointer rounded-lg bg-brandRed px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#a04034] ${isCollapsed ? 'text-center' : ''}`}
          style={{ fontFamily: "'Montserrat', sans-serif" }}
          title={isCollapsed ? 'Déconnexion' : ''}
        >
          {isCollapsed ? 'D' : 'Déconnexion'}
        </button>
      </div>
    </aside>
    </>
  );
}

