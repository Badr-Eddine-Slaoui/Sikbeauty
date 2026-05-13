"use client";
import React from "react";

function BrandLoader({ label, size = "md", className = "" }) {
  const sizeMap = {
    sm: {
      ring: "h-8 w-8",
      ringBorder: "border-2",
      label: "text-sm",
    },
    md: {
      ring: "h-12 w-12",
      ringBorder: "border-4",
      label: "text-base",
    },
    lg: {
      ring: "h-16 w-16",
      ringBorder: "border-4",
      label: "text-lg",
    },
  };

  const cfg = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`.trim()}>
      <div className={`relative ${cfg.ring}`} aria-label="Loading">
        <div className={`absolute inset-0 rounded-full ${cfg.ringBorder} border-brandRed/15`} />
        <div
          className={`absolute inset-0 rounded-full ${cfg.ringBorder} border-brandRed border-t-transparent animate-spin`}
        />
        <div
          className={`absolute inset-1 rounded-full ${cfg.ringBorder} border-brandBrown/25 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.2s]`}
        />
      </div>

      {label ? (
        <p className={`font-montserrat text-gray-600 ${cfg.label}`}>{label}</p>
      ) : null}
    </div>
  );
}

export default BrandLoader;
