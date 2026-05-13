"use client";
import React from "react";
import BrandLoader from "./BrandLoader";

function PageLoader({ label = "Chargement...", className = "" }) {
  return (
    <div className={`min-h-screen bg-brandWhite flex items-center justify-center ${className}`.trim()}>
      <div className="animate-fade-in-up">
        <BrandLoader label={label} size="lg" />
      </div>
    </div>
  );
}

export default PageLoader;
