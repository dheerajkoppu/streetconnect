import { Service, ServiceCategory, FilterState } from "@/types";
import { isOpenNow } from "./hours";
import { calculateDistance } from "./location";

/**
 * Filter services based on filter state
 */
export function filterServices(
  services: Service[],
  filters: FilterState,
  selectedCategory: ServiceCategory | null,
  userLocation: { lat: number; lng: number } | null,
  searchQuery: string
): Service[] {
  return services.filter((service) => {
    // Category filter
    if (selectedCategory && !service.categories.includes(selectedCategory)) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = service.name.toLowerCase().includes(query);
      const matchesDescription = service.descriptionShort
        .toLowerCase()
        .includes(query);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }

    // Open now filter
    if (filters.openNow && !isOpenNow(service.hours)) {
      return false;
    }

    // Distance filter
    if (
      filters.maxDistance !== "all" &&
      userLocation &&
      service.address.lat &&
      service.address.lng
    ) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        service.address.lat,
        service.address.lng
      );

      switch (filters.maxDistance) {
        case "near":
          if (distance > 2) return false;
          break;
        case "medium":
          if (distance > 5) return false;
          break;
        case "far":
          // Show all for "far" but this could be used for >5km
          break;
      }
    }

    // Accessibility filters
    if (filters.petsAllowed && !service.accessibility.petsAllowed) {
      return false;
    }

    if (
      filters.wheelchairAccessible &&
      !service.accessibility.wheelchairAccessible
    ) {
      return false;
    }

    if (filters.noIDRequired && !service.flags.noIDRequired) {
      return false;
    }

    return true;
  });
}

/**
 * Sort services by distance or name
 */
export function sortServices(
  services: Service[],
  userLocation: { lat: number; lng: number } | null
): Service[] {
  if (!userLocation) {
    // Sort alphabetically if no location
    return [...services].sort((a, b) => a.name.localeCompare(b.name));
  }

  return [...services].sort((a, b) => {
    const distA =
      a.address.lat && a.address.lng
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.address.lat,
            a.address.lng
          )
        : Infinity;
    const distB =
      b.address.lat && b.address.lng
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.address.lat,
            b.address.lng
          )
        : Infinity;
    return distA - distB;
  });
}

/**
 * Get default filter state
 */
export function getDefaultFilters(): FilterState {
  return {
    openNow: false,
    maxDistance: "all",
    petsAllowed: false,
    wheelchairAccessible: false,
    noIDRequired: false,
  };
}
