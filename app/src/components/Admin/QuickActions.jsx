"use client";
import React from 'react';

export default function QuickActions({ actions = [], columnsClass = 'md:grid-cols-3' }) {
  return (
    <section className={`grid gap-3 ${columnsClass}`}>
      {actions.map((action) => (
        <article
          key={action.id}
          className="flex h-full flex-col rounded-xl border border-brandRed/10 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brandRed/10 text-base text-brandRed">
              {action.icon}
            </span>
            <h3
              className="text-base font-semibold text-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {action.title}
            </h3>
          </div>
          <p
            className="mt-2 flex-1 text-xs text-gray-600"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {action.description}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {(action.buttons ?? []).map((btn) => {
              const buttonText = typeof btn === 'string' ? btn : btn.text;
              const buttonOnClick = typeof btn === 'object' && btn.onClick ? btn.onClick : undefined;
              return (
                <button
                  key={buttonText}
                  onClick={buttonOnClick}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-brandRed/50 hover:text-brandRed"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {buttonText}
                </button>
              );
            })}
          </div>
        </article>
      ))}
    </section>
  );
}

