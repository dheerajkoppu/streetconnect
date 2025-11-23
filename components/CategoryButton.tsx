"use client";

import { CategoryInfo } from "@/types";

interface CategoryButtonProps {
  category: CategoryInfo;
  isSelected: boolean;
  onClick: () => void;
}

export function CategoryButton({
  category,
  isSelected,
  onClick,
}: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`category-btn no-select ${isSelected ? "category-btn-selected" : ""}`}
      aria-pressed={isSelected}
      aria-label={`${category.label}${isSelected ? " (selected)" : ""}`}
    >
      <span className="category-btn-icon" role="img" aria-hidden="true">
        {category.icon}
      </span>
      <span className="category-btn-label">
        {category.label}
      </span>
    </button>
  );
}
