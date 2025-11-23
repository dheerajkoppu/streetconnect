"use client";

import { ServiceCategory } from "@/types";
import { CATEGORIES } from "@/lib/categories";

interface CategorySelectorProps {
  selectedCategory: ServiceCategory | null;
  onSelectCategory: (category: ServiceCategory | null) => void;
}

export function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <section className="w-full" aria-labelledby="category-heading">
      <h2
        id="category-heading"
        className="text-lg font-bold text-[var(--text-primary)] mb-3 px-1"
      >
        What do you need?
      </h2>

      {/* Horizontal scrollable tab strip */}
      <div
        className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory"
        role="tablist"
        aria-label="Service categories"
      >
        {/* "All" tab */}
        <button
          onClick={() => onSelectCategory(null)}
          className={`chip chip-tab no-select snap-start flex-shrink-0 ${
            selectedCategory === null
              ? "chip-tab-active"
              : "chip-tab-inactive"
          }`}
          role="tab"
          aria-selected={selectedCategory === null}
          aria-controls="service-list"
        >
          <span className="text-base" role="img" aria-hidden="true">
            ✨
          </span>
          <span>All</span>
        </button>

        {/* Category tabs */}
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() =>
                onSelectCategory(isSelected ? null : category.id)
              }
              className={`chip chip-tab no-select snap-start flex-shrink-0 ${
                isSelected
                  ? "chip-tab-active"
                  : "chip-tab-inactive"
              }`}
              role="tab"
              aria-selected={isSelected}
              aria-controls="service-list"
            >
              <span className="text-base" role="img" aria-hidden="true">
                {category.icon}
              </span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
