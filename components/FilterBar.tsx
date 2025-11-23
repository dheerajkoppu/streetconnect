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
    <div className="space-y-3">
      {/* Main filters row */}
      <div className="flex flex-wrap gap-2">
        {/* Open Now toggle */}
        <button
          onClick={() => updateFilter("openNow", !filters.openNow)}
          className={`
            px-4 py-2 rounded-full text-sm font-medium
            transition-colors duration-150
            ${
              filters.openNow
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 border border-gray-300"
            }
          `}
        >
          {filters.openNow ? "✓ Open now" : "Open now"}
        </button>

        {/* Distance selector - only show if we have location */}
        {hasLocation && (
          <select
            value={filters.maxDistance}
            onChange={(e) =>
              updateFilter(
                "maxDistance",
                e.target.value as FilterState["maxDistance"]
              )
            }
            className="px-4 py-2 rounded-full text-sm font-medium bg-white text-gray-700 border border-gray-300"
          >
            <option value="all">Any distance</option>
            <option value="near">Near (0-2 km)</option>
            <option value="medium">Medium (2-5 km)</option>
            <option value="far">Far (5+ km)</option>
          </select>
        )}
      </div>

      {/* Additional filters */}
      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="Pets OK"
          active={filters.petsAllowed}
          onClick={() => updateFilter("petsAllowed", !filters.petsAllowed)}
        />
        <FilterChip
          label="Wheelchair"
          active={filters.wheelchairAccessible}
          onClick={() =>
            updateFilter("wheelchairAccessible", !filters.wheelchairAccessible)
          }
        />
        <FilterChip
          label="No ID needed"
          active={filters.noIDRequired}
          onClick={() => updateFilter("noIDRequired", !filters.noIDRequired)}
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
      className={`
        px-3 py-1.5 rounded-full text-xs font-medium
        transition-colors duration-150
        ${
          active
            ? "bg-blue-100 text-blue-700 border border-blue-300"
            : "bg-gray-100 text-gray-600 border border-gray-200"
        }
      `}
    >
      {active && "✓ "}
      {label}
    </button>
  );
}
