import { Service } from "@/types";

const CACHE_KEY = "streetconnect_services_cache";
const CACHE_TIMESTAMP_KEY = "streetconnect_cache_timestamp";

interface CacheData {
  services: Service[];
  timestamp: number;
}

/**
 * Save services to localStorage cache
 */
export function cacheServices(services: Service[]): void {
  if (typeof window === "undefined") return;
  try {
    const data: CacheData = {
      services,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    // localStorage might be full or unavailable
  }
}

/**
 * Load services from localStorage cache
 */
export function loadCachedServices(): CacheData | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as CacheData;
  } catch {
    return null;
  }
}

/**
 * Get cache timestamp formatted for display
 */
export function getCacheTimestamp(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = loadCachedServices();
    if (!cached) return null;

    const date = new Date(cached.timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
}

/**
 * Check if cache is stale (older than 24 hours)
 */
export function isCacheStale(): boolean {
  const cached = loadCachedServices();
  if (!cached) return true;
  const oneDay = 24 * 60 * 60 * 1000;
  return Date.now() - cached.timestamp > oneDay;
}

/**
 * Clear the cache
 */
export function clearCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch {
    // Ignore errors
  }
}
