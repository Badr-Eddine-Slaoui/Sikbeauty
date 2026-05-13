"use client";
// Navbar.jsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "@/utils/react-router-dom";
import { Menu, X, UserPlus, LogOut, User, LogIn } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardPath } from "../../utils/auth";
import PopOutSearch from "./Search";
import Logo from "../../assets/Logo/SI-K-Beauty-logo.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Accueil", id: "accueil" },
    { label: "Sélection", id: "selection" },
    { label: "Découvrir", id: "decouvrir" },
    { label: "Valeurs", id: "valeurs" },
    { label: "Histoire", id: "histoire" },
    { label: "Routines", id: "routines" },
    { label: "Avis", id: "avis" },
    { label: "Instagram", id: "instagram" },
    { label: "Newsletter", id: "newsletter" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath = isAuthenticated() ? getDashboardPath(user?.role) : '/';

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleNavClick = (sectionId) => (e) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(sectionId), 50);
      return;
    }

    scrollToSection(sectionId);
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3 bg-white/95 backdrop-blur-md shadow-sm z-50">
      {/* Logo */}
      <a href="#accueil" onClick={handleNavClick("accueil")} className="flex items-center">
        <img
          src={Logo?.src || Logo}
          alt="SI-K-Beauty-logo"
          className="w-12 sm:h-12 object-contain"
        />
      </a>

      {/* Desktop Nav */}
      <nav className="hidden sticky lg:flex gap-5 xl:gap-6 text-sm xl:text-base font-medium text-gray-800">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={handleNavClick(item.id)}
            className="relative group transition duration-300"
          >
            <span className="group-hover:text-brandBrown transition duration-300">
              {item.label}
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-brandBrown transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated() ? (
            <>
              <Link
                to={dashboardPath}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandRed text-white hover:bg-brandBrown transition-colors duration-300 text-sm font-medium"
              >
                <User size={18} />
                Tableau de bord
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-red-200 text-red-600 hover:bg-red-50 transition-colors duration-300 text-sm font-medium"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors duration-300 text-sm font-medium"
              >
                <LogIn size={18} />
                Connexion
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brandRed text-white hover:bg-brandBrown transition-colors duration-300 text-sm font-medium"
              >
                <UserPlus size={18} />
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Burger Menu (mobile only) */}
        <button
          className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        >
          {isMenuOpen ? (
            <X size={24} className="text-brandBrown" />
          ) : (
            <Menu size={24} className="text-brandBrown" />
          )}
        </button>
      </div>

      {/* Mobile Menu (Fullscreen) */}
      <div
        className={`fixed inset-0 top-0 left-0 w-full h-screen bg-white lg:hidden overflow-y-auto transition-all duration-300 ease-out ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        style={{ zIndex: 40 }}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
          <img src={Logo?.src || Logo} alt="SI-K-Beauty-logo" className="w-10 h-10 object-contain" />
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
            <X size={28} className="text-brandRed" />
          </button>
        </div>
        
        <nav className="flex flex-col items-center py-4 gap-2 text-gray-800 font-medium">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick(item.id)}
              className="text-xl font-medium text-gray-800 hover:text-brandRed transition-colors duration-300 py-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.label}
            </a>
          ))}
          
          {/* Mobile Authentication Section */}
          <div className="border-t border-gray-200 pt-8 mt-4 w-full px-8">
            {isAuthenticated() ? (
              <div className="flex flex-col items-center gap-4 w-full">
                <p className="text-base text-gray-600 mb-2">Bienvenue, {user?.fullName}</p>
                <Link
                  to={dashboardPath}
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full max-w-xs flex items-center justify-center gap-3 bg-brandRed text-white px-6 py-3 rounded-full hover:bg-brandBrown transition-colors duration-300 text-base font-medium"
                >
                  <User size={20} />
                  Tableau de bord
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors duration-300 text-base"
                >
                  <LogOut size={20} />
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 w-full">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full max-w-xs flex items-center justify-center gap-3 bg-brandRed text-white px-6 py-3 rounded-full hover:bg-brandBrown transition-colors duration-300 text-base font-medium"
                >
                  <LogIn size={20} />
                  Connexion
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full max-w-xs flex items-center justify-center gap-3 border-2 border-brandRed text-brandRed px-6 py-3 rounded-full hover:bg-brandRed hover:text-white transition-colors duration-300 text-base font-medium"
                >
                  <UserPlus size={20} />
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
