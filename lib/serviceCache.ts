import { Service } from "@/types";

const SERVICE_CACHE_KEY = "streetconnect_service_cache";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ServiceCache {
  services: Record<string, Service>;
  timestamp: number;
}

/**
 * Save a service to the cache (for OSM services that need to persist across navigation)
 */
export function cacheService(service: Service): void {
  if (typeof window === "undefined") return;

  try {
    const cache = loadServiceCache();
    cache.services[service.id] = service;
    cache.timestamp = Date.now();
    sessionStorage.setItem(SERVICE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to cache service:", error);
  }
}

/**
 * Save multiple services to the cache
 */
export function cacheServices(services: Service[]): void {
  if (typeof window === "undefined") return;

  try {
    const cache = loadServiceCache();
    for (const service of services) {
      cache.services[service.id] = service;
    }
    cache.timestamp = Date.now();
    sessionStorage.setItem(SERVICE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Failed to cache services:", error);
  }
}

/**
 * Get a service from the cache by ID
 */
export function getCachedService(id: string): Service | null {
  if (typeof window === "undefined") return null;

  try {
    const cache = loadServiceCache();

    // Check if cache is expired
    if (Date.now() - cache.timestamp > CACHE_EXPIRY_MS) {
      clearServiceCache();
      return null;
    }

    return cache.services[id] || null;
  } catch {
    return null;
  }
}

/**
 * Load the service cache from sessionStorage
 */
function loadServiceCache(): ServiceCache {
  try {
    const cached = sessionStorage.getItem(SERVICE_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch {
    // Invalid cache
  }
  return { services: {}, timestamp: Date.now() };
}

/**
 * Clear the service cache
 */
export function clearServiceCache(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SERVICE_CACHE_KEY);
}

/**
 * Check if a service ID is a dynamic OSM service
 */
export function isOsmService(id: string): boolean {
  return id.startsWith("osm-");
}
