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
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-3 px-1">What do you need?</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4">
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
    </div>
  );
}
