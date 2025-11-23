"use client";

import Link from "next/link";

interface HeaderProps {
  cityName: string;
  onLocationChange?: () => void;
}

export function Header({ cityName, onLocationChange }: HeaderProps) {
  return (
    <header className="header safe-area-top sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Logo and location */}
        <div className="flex-1 min-w-0">
          <h1 className="header-title">StreetConnect</h1>
          <button
            onClick={onLocationChange}
            className="flex items-center gap-1.5 text-blue-100 hover:text-white transition-colors mt-0.5 min-h-[44px] -my-1"
            aria-label={`Change location from ${cityName}`}
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
            <span className="text-sm font-medium truncate">{cityName}</span>
            <svg
              className="w-3 h-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        {/* About/Info button */}
        <Link
          href="/about"
          className="flex items-center justify-center w-12 h-12 -mr-2 hover:bg-white/10 active:bg-white/20 rounded-xl transition-colors"
          aria-label="About and settings"
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
