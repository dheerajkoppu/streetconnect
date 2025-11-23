"use client";

import { FilterState } from "@/types";

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  hasLocation: boolean;
}

export function FilterBar({
  filters,
  onFilterChange,
  hasLocation,
}: FilterBarProps) {
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-3" role="group" aria-label="Filter options">
      {/* Primary filters row */}
      <div className="flex flex-wrap gap-2">
        {/* Open Now toggle - most important filter */}
        <button
          onClick={() => updateFilter("openNow", !filters.openNow)}
          className={`filter-chip ${filters.openNow ? "filter-chip-active" : "filter-chip-inactive"}`}
          aria-pressed={filters.openNow}
        >
          {filters.openNow && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          Open now
        </button>

        {/* Distance selector - only show if we have location */}
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
              className="filter-chip filter-chip-inactive appearance-none pr-8 cursor-pointer"
              aria-label="Filter by distance"
            >
              <option value="all">Any distance</option>
              <option value="near">Walking (0-2 km)</option>
              <option value="medium">Nearby (2-5 km)</option>
              <option value="far">Further (5+ km)</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Accessibility filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="No ID needed"
          active={filters.noIDRequired}
          onClick={() => updateFilter("noIDRequired", !filters.noIDRequired)}
        />
        <FilterChip
          label="Wheelchair OK"
          active={filters.wheelchairAccessible}
          onClick={() =>
            updateFilter("wheelchairAccessible", !filters.wheelchairAccessible)
          }
        />
        <FilterChip
          label="Pets OK"
          active={filters.petsAllowed}
          onClick={() => updateFilter("petsAllowed", !filters.petsAllowed)}
        />
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`filter-chip ${active ? "filter-chip-active" : "filter-chip-inactive"}`}
      aria-pressed={active}
    >
      {active && (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {label}
    </button>
  );
}
