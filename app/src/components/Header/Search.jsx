"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react";

const PopOutSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSearch = () => setIsOpen(!isOpen);

  return (
    <div className="relative flex items-center">
      {/* Search Input */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? "w-48 sm:w-64 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <input
          type="text"
          placeholder="Rechercher..."
          className="font-playfair px-4 py-2 border border-gray-400 rounded-full focus:outline-none focus:border-brandBrown transition-all duration-300 text-sm w-full"
          autoFocus={isOpen}
        />
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleSearch}
        className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
        aria-label={isOpen ? "Fermer la recherche" : "Ouvrir la recherche"}
      >
        {isOpen ? (
          <X size={20} className="text-brandBrown" />
        ) : (
          <Search size={20} className="text-brandBrown" />
        )}
      </button>
    </div>
  );
};

export default PopOutSearch;