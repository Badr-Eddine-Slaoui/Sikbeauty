"use client";
import React from 'react';

export default function RecentActivities({ activities }) {
  return (
    <section className="rounded-xl border border-brandRed/10 bg-white p-4 shadow-sm">
      <h2
        className="text-lg font-semibold text-gray-900"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Activités récentes
      </h2>
      <p
        className="mt-1 text-xs text-gray-600"
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Suivez les dernières actions de votre équipe et de la communauté.
      </p>

      <ul className="mt-3 space-y-3">
        {activities.map((activity) => (
          <li key={activity.label} className="flex gap-4">
            <div className="relative flex flex-col items-center">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brandRed/10 text-xs font-semibold text-brandRed">
                •
              </span>
              <span className="mt-1 h-full w-px flex-1 bg-linear-to-b from-[#B5483A]/20 to-transparent" aria-hidden="true" />
            </div>
            <div className="flex-1 rounded-lg bg-brandRed/5 px-3 py-2">
              <p className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>{activity.label}</p>
              <p className="mt-2 text-xs uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

