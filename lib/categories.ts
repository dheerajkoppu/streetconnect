import { CategoryInfo, ServiceCategory } from "@/types";

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "shelter",
    label: "Shelter",
    icon: "🏠",
    color: "bg-blue-500",
  },
  {
    id: "food",
    label: "Food",
    icon: "🍽️",
    color: "bg-orange-500",
  },
  {
    id: "showers",
    label: "Showers",
    icon: "🚿",
    color: "bg-cyan-500",
  },
  {
    id: "laundry",
    label: "Laundry",
    icon: "👕",
    color: "bg-purple-500",
  },
  {
    id: "medical",
    label: "Medical",
    icon: "🏥",
    color: "bg-red-500",
  },
  {
    id: "mental_health",
    label: "Mental Health",
    icon: "🧠",
    color: "bg-pink-500",
  },
  {
    id: "day_center",
    label: "Day Centers",
    icon: "☀️",
    color: "bg-yellow-500",
  },
  {
    id: "id_legal",
    label: "ID & Legal",
    icon: "📋",
    color: "bg-green-500",
  },
];

export function getCategoryInfo(id: ServiceCategory): CategoryInfo | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function getCategoryLabel(id: ServiceCategory): string {
  return getCategoryInfo(id)?.label || id;
}
