"use client";

import Link from "next/link";

interface HeaderProps {
  cityName: string;
  onLocationChange?: () => void;
}

export function Header({ cityName, onLocationChange }: HeaderProps) {
  return (
    <header className="header-gradient safe-area-top sticky top-0 z-40">
      {/* Main header content */}
      <div className="px-5 pt-4 pb-5">
        {/* Top row: Brand and actions */}
        <div className="flex items-center justify-between mb-1">
          {/* Left: App name and city selector */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              StreetConnect
            </h1>
          </div>

          {/* Right: Info button */}
          <Link
            href="/about"
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors shadow-sm"
            aria-label="About and settings"
          >
            <svg
              className="w-5 h-5 text-white"
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

        {/* City selector pill */}
        <button
          onClick={onLocationChange}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 active:bg-white/30 transition-colors mt-1"
          aria-label={`Change location from ${cityName}`}
        >
          <svg
            className="w-4 h-4 text-white/90"
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
          <span className="text-sm font-medium text-white/95">{cityName}</span>
          <svg
            className="w-3 h-3 text-white/70"
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

        {/* Tagline */}
        <p className="text-white/80 text-sm mt-3 font-medium">
          Find shelter, food, and help near you today.
        </p>
      </div>

      {/* Subtle bottom curve overlay for depth */}
      <div
        className="absolute bottom-0 left-0 right-0 h-4 bg-[var(--bg-base)]"
        style={{
          borderRadius: '20px 20px 0 0',
          marginBottom: '-1px'
        }}
      />
    </header>
  );
}
