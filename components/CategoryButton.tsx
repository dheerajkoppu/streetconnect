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
      className={`
        flex flex-col items-center justify-center
        min-w-[90px] h-[90px] p-3 rounded-xl
        transition-all duration-150
        no-select
        ${
          isSelected
            ? "bg-blue-600 text-white shadow-lg scale-105"
            : "bg-white text-gray-700 shadow-sm hover:shadow-md active:scale-95"
        }
      `}
      aria-pressed={isSelected}
    >
      <span className="text-3xl mb-1" role="img" aria-hidden="true">
        {category.icon}
      </span>
      <span className="text-sm font-medium text-center leading-tight">
        {category.label}
      </span>
    </button>
  );
}
