"use client";
import React from 'react';

export default function RevenueHighlights({ segments, summary }) {
  return (
    <section className="rounded-xl border border-brandRed/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Points forts des revenus
          </h2>
          <p
            className="mt-1 text-xs text-gray-600"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {summary}
          </p>
        </div>
        <span
          className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
          style={{ fontFamily: "'Montserrat', sans-serif" }}
        >
          +12,4% vs dernier trimestre
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {segments.map((segment) => (
          <div key={segment.label}>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{segment.label}</span>
              <span className="font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {segment.amount}
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-[#B5483A] via-[#c35a4c] to-[#f0d6d1]"
                style={{ width: `${segment.progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }}>{segment.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

