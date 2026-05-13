"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";

function SearchBar({ onSearch, placeholder = "Search products..." }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Real-time search (optional - can be debounced)
    if (value === "") {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-4 pl-12 pr-4 border-2 border-gray-300 focus:border-brandRed focus:outline-none transition-colors bg-white"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        />
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

export default SearchBar;

