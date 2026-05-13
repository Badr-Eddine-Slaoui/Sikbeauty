"use client";
import React from 'react';

export default function AdminHeader({ title, subtitle, insight, actions = [] }) {
  return (
    <header className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#fdf4f2] via-white to-white border border-brandRed/10">

      <div className="relative flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p
            className="text-xs uppercase tracking-[0.35em] text-brandRed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Admin
          </p>
          <h1
            className="mt-2 text-2xl font-semibold text-gray-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </h1>
          <p
            className="mt-2 max-w-2xl text-xs text-gray-600"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {subtitle}
          </p>

          {insight && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs text-gray-700 shadow-sm">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brandRed/10 text-brandRed text-xs">
                i
              </span>
              <p style={{ fontFamily: "'Montserrat', sans-serif" }}>{insight}</p>
            </div>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition ${
                  action.variant === 'primary'
                    ? 'bg-brandRed text-white hover:bg-[#a04034]'
                    : 'border border-brandRed/60 text-brandRed hover:bg-brandRed/10'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

