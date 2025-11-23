"use client";

import { ServiceCategory } from "@/types";
import { CATEGORIES } from "@/lib/categories";
import { CategoryButton } from "./CategoryButton";

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
        className="section-title px-1"
      >
        What do you need?
      </h2>
      <div
        className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar -mx-5 px-5"
        role="group"
        aria-label="Service categories"
      >
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onClick={() =>
              onSelectCategory(
                selectedCategory === category.id ? null : category.id
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
