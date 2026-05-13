"use client";
import React from 'react';

export default function StatGrid({ stats }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <article
          key={item.title}
          className="relative overflow-hidden rounded-xl border border-brandRed/10 bg-white p-4 shadow-sm transition duration-300 hover:shadow-md"
        >
          <div className="relative">
            <div className="flex items-center justify-between">
              <p
                className="text-xs uppercase tracking-wide text-gray-500"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {item.title}
              </p>
              {item.badge && (
                <span
                  className="rounded-full bg-brandRed/10 px-3 py-1 text-xs font-semibold text-brandRed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {item.badge}
                </span>
              )}
            </div>

            <p
              className="mt-3 text-2xl font-semibold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {item.value}
            </p>
            <p
              className="mt-1 text-xs text-gray-500"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {item.sublabel}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                  item.changeType === 'up'
                    ? 'bg-emerald-50 text-emerald-600'
                    : item.changeType === 'down'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-gray-100 text-gray-600'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {item.changeType === 'up' && '▲'}
                {item.changeType === 'down' && '▼'}
                {item.changeType === 'steady' && '●'}
                <span className="ml-1">{item.change}</span>
              </span>
              <span
                className="text-xs text-gray-500"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                vs période précédente
              </span>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

