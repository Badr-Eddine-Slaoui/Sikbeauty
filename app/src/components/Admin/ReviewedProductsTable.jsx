"use client";
import React, { useState } from 'react';
import Pagination from './Pagination';

export default function ReviewedProductsTable({ products }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  return (
    <section className="rounded-xl border border-brandRed/10 bg-white p-4 shadow-sm">
      <h2
        className="text-lg font-semibold text-gray-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Produits les plus évalués
      </h2>
      <p
        className="mt-1 text-xs text-gray-600"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Identifiez les favoris de la communauté et surveillez les sentiments.
      </p>

      <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-brandRed/5 text-xs uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-4 py-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Produit</th>
              <th className="px-4 py-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Catégorie</th>
              <th className="px-4 py-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Avis</th>
              <th className="px-4 py-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {currentProducts.map((product) => (
              <tr key={product.name} className="transition hover:bg-brandRed/5">
                <td className="px-4 py-3 font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>{product.name}</td>
                <td className="px-4 py-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>{product.category}</td>
                <td className="px-4 py-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>{product.reviews}</td>
                <td className="px-4 py-3" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span className="inline-flex items-center rounded-full bg-brandRed/10 px-3 py-1 text-xs font-semibold text-brandRed">
                    {product.rating.toFixed(1)} / 5
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}

