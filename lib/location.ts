import { UserLocation } from "@/types";

const LOCATION_STORAGE_KEY = "streetconnect_user_location";

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 0.1) {
    return "< 0.1 km";
  }
  if (km < 1) {
    return `${(km * 1000).toFixed(0)} m`;
  }
  if (km < 10) {
    return `${km.toFixed(1)} km`;
  }
  return `${km.toFixed(0)} km`;
}

/**
 * Get user location from browser geolocation API
 */
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes cache
    });
  });
}

/**
 * Save user location to localStorage
 */
export function saveUserLocation(location: UserLocation): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
  } catch {
    // localStorage might be unavailable
  }
}

/**
 * Load user location from localStorage
 */
export function loadUserLocation(): UserLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!stored) return null;
    const location = JSON.parse(stored) as UserLocation;
    // Check if location is not too old (24 hours)
    if (Date.now() - location.timestamp > 24 * 60 * 60 * 1000) {
      return null;
    }
    return location;
  } catch {
    return null;
  }
}

/**
 * Clear stored user location
 */
export function clearUserLocation(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LOCATION_STORAGE_KEY);
  } catch {
    // Ignore errors
  }
}

/**
 * Simple geocoding using Nominatim (OpenStreetMap)
 * This is a free service with rate limits - for production, use a paid service
 */
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const encoded = encodeURIComponent(address);
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`,
      {
        headers: {
          "User-Agent": "StreetConnect/1.0",
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } catch {
    return null;
  }
}
