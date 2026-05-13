"use client";
import React, { useState } from 'react';
import Pagination from './Pagination';

export default function TopSellingProducts({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <section className="rounded-xl border border-[#B5483A]/10 bg-white p-4 shadow-sm">
      <h2
        className="text-lg font-semibold text-gray-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Meilleurs produits
      </h2>
      <p
        className="mt-1 text-xs text-gray-600"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Basé sur la quantité vendue et le revenu total de cette période.
      </p>

      <ul className="mt-3 space-y-2">
        {currentProducts.map((product, index) => (
          <li
            key={product.name}
            className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 transition hover:border-[#B5483A]/50 hover:shadow-md"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brandRed/10 text-sm font-semibold text-brandRed">
              {startIndex + index + 1}
            </span>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <p
                    className="text-xs uppercase tracking-wide text-gray-500"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {product.category}
                  </p>
                  <p
                    className="text-base font-semibold text-gray-900"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {product.name}
                  </p>
                </div>
                <span
                  className="rounded-full bg-brandRed/10 px-3 py-1 text-xs font-medium text-brandRed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {product.badge}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{product.sales}</span>
                <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{product.revenue}</span>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {product.trend}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}

