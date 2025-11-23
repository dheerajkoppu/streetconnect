"use client";

import { useState, useEffect } from "react";
import { FilterState } from "@/types";

interface SearchFiltersCardProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  hasLocation: boolean;
}

export function SearchFiltersCard({
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  hasLocation,
}: SearchFiltersCardProps) {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearchValue, onSearchChange]);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="card-elevated p-4 space-y-4">
      {/* Search bar */}
      <div className="relative">
        {/* Search icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-[var(--slate-400)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input */}
        <input
          type="search"
          value={localSearchValue}
          onChange={(e) => setLocalSearchValue(e.target.value)}
          placeholder="Search services..."
          className="input-search"
          aria-label="Search services"
        />

        {/* Clear button */}
        {localSearchValue && (
          <button
            onClick={() => {
              setLocalSearchValue("");
              onSearchChange("");
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center w-10"
            aria-label="Clear search"
          >
            <svg
              className="h-5 w-5 text-[var(--slate-400)] hover:text-[var(--slate-600)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter options">
        {/* Open Now - uses accent color */}
        <button
          onClick={() => updateFilter("openNow", !filters.openNow)}
          className={`chip chip-filter no-select ${
            filters.openNow ? "chip-accent-active" : "chip-filter-inactive"
          }`}
          aria-pressed={filters.openNow}
        >
          {filters.openNow && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M12 6v6l4 2" />
          </svg>
          Open now
        </button>

        {/* No ID needed */}
        <button
          onClick={() => updateFilter("noIDRequired", !filters.noIDRequired)}
          className={`chip chip-filter no-select ${
            filters.noIDRequired ? "chip-filter-active" : "chip-filter-inactive"
          }`}
          aria-pressed={filters.noIDRequired}
        >
          {filters.noIDRequired && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={2} />
            <circle cx="9" cy="10" r="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M15 9h2M15 13h2" />
          </svg>
          No ID
        </button>

        {/* Wheelchair accessible */}
        <button
          onClick={() => updateFilter("wheelchairAccessible", !filters.wheelchairAccessible)}
          className={`chip chip-filter no-select ${
            filters.wheelchairAccessible ? "chip-filter-active" : "chip-filter-inactive"
          }`}
          aria-pressed={filters.wheelchairAccessible}
        >
          {filters.wheelchairAccessible && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="12" cy="6" r="2" strokeWidth={2} />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 22l2-8h4l2 4m-6-4V9a2 2 0 012-2h0" />
            <circle cx="8" cy="18" r="3" strokeWidth={2} />
          </svg>
          Accessible
        </button>

        {/* Pets OK */}
        <button
          onClick={() => updateFilter("petsAllowed", !filters.petsAllowed)}
          className={`chip chip-filter no-select ${
            filters.petsAllowed ? "chip-filter-active" : "chip-filter-inactive"
          }`}
          aria-pressed={filters.petsAllowed}
        >
          {filters.petsAllowed && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 5.172C10 3.782 8.423 2.679 6.5 3.172c-1.924.493-2.424 2.41-1.5 3.828C6.5 9 9 11 12 14c3-3 5.5-5 7-6.828.923-1.417.423-3.335-1.5-3.828-1.923-.493-3.5.61-3.5 2-.001.333-.001.667 0 1M7 16c-1.5 1-3 2.5-3 4.5 0 1 .5 1.5 1.5 1.5H12m5 0h3.5c1 0 1.5-.5 1.5-1.5 0-2-1.5-3.5-3-4.5" />
          </svg>
          Pets OK
        </button>

        {/* Distance filter - only show with location */}
        {hasLocation && (
          <div className="relative">
            <select
              value={filters.maxDistance}
              onChange={(e) =>
                updateFilter(
                  "maxDistance",
                  e.target.value as FilterState["maxDistance"]
                )
              }
              className="chip chip-filter chip-filter-inactive appearance-none pr-8 cursor-pointer min-w-[120px]"
              aria-label="Filter by distance"
            >
              <option value="all">Any distance</option>
              <option value="near">Walking (2km)</option>
              <option value="medium">Nearby (5km)</option>
              <option value="far">Further (5km+)</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
