"use client";

import Link from "next/link";

interface HeaderProps {
  cityName: string;
  onLocationChange?: () => void;
}

export function Header({ cityName, onLocationChange }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white px-4 py-4 safe-area-top">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">StreetConnect</h1>
          <button
            onClick={onLocationChange}
            className="text-blue-100 text-sm flex items-center gap-1 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {cityName}
          </button>
        </div>
        <Link
          href="/about"
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
          aria-label="About and settings"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </Link>
      </div>
    </header>
  );
}
