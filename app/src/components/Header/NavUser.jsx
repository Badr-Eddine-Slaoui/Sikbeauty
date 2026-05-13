"use client";
// Navbar.jsx
import { useState } from "react";
import { Link, useNavigate } from "@/utils/react-router-dom";
import { Menu, X, UserPlus, LogOut, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getDashboardPath } from "../../utils/auth";
import PopOutSearch from "./Search";
import Logo from "../../assets/Logo/SI-K-Beauty-logo.png";

function NavUser() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navItems = ["Home", "Nos valeurs", "À propos", "CGV", "FAQ", "Contact"];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const dashboardPath = getDashboardPath(user?.role);

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between px-12 py-4 bg-white shadow-sm z-50">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={Logo?.src || Logo}
          alt="SI-K-Beauty-logo"
          className="w-12 sm:h-12 object-contain"
        />
      </div>

      {/* Desktop Nav */}
      <nav className="hidden sticky md:flex gap-6 text-base font-medium text-gray-800">
        {navItems.map((item) => (
          <a
            key={item}
            href="#"
            className="relative group transition duration-300"
          >
            <span className="group-hover:text-brandBrown transition duration-300">
              {item}
            </span>
            <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-brandBrown transition-all duration-300 group-hover:w-full"></span>
          </a>
        ))}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <PopOutSearch />
        
        {/* Register Button */}
        <Link
          to="/signup"
          className="hover:text-brandBrown transition-colors duration-300"
          aria-label="Register"
        >
          <UserPlus size={24} className="w-6 h-6" />
        </Link>
        
        {/* Cart */}
        <button
          className="hover:text-brandBrown transition-colors duration-300"
          aria-label="Cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
        </button>

        {/* Burger Menu (mobile only) */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
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

      {/* Mobile Menu (Slide Down) */}
      <div
        className={`absolute top-full left-0 w-full bg-white shadow-md border-t transition-all duration-500 ease-in-out md:hidden overflow-hidden ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center py-4 gap-4 text-gray-800 font-medium">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              onClick={() => setIsMenuOpen(false)} // close on click
              className="hover:text-brandBrown transition-colors duration-300"
            >
              {item}
            </a>
          ))}
          
          {/* Mobile Authentication Section */}
          <div className="border-t pt-4 mt-4 w-full">
            {isAuthenticated() ? (
              <div className="flex flex-col items-center gap-3">
                <p className="text-sm text-gray-600">Welcome, {user?.fullName}</p>
                <Link
                  to={dashboardPath}
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-brandRed text-white px-4 py-2 rounded-md hover:bg-brandBrown transition-colors duration-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-red-600 hover:text-red-800 transition-colors duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-brandRed text-white px-4 py-2 rounded-md hover:bg-brandBrown transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-brandRed hover:text-brandBrown transition-colors duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default NavUser;
