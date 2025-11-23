import { Service } from "@/types";

const USER_SERVICES_KEY = "streetconnect_user_services";

/**
 * Save user-added services to localStorage
 */
export function saveUserServices(services: Service[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_SERVICES_KEY, JSON.stringify(services));
  } catch {
    // localStorage might be full or unavailable
    console.warn("Failed to save user services to localStorage");
  }
}

/**
 * Load user-added services from localStorage
 */
export function loadUserServices(): Service[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USER_SERVICES_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Service[];
  } catch {
    return [];
  }
}

/**
 * Add a new user service
 */
export function addUserService(service: Service): Service[] {
  const existing = loadUserServices();
  const updated = [...existing, service];
  saveUserServices(updated);
  return updated;
}

/**
 * Remove a user service by ID
 */
export function removeUserService(serviceId: string): Service[] {
  const existing = loadUserServices();
  const updated = existing.filter((s) => s.id !== serviceId);
  saveUserServices(updated);
  return updated;
}

/**
 * Update a user service
 */
export function updateUserService(service: Service): Service[] {
  const existing = loadUserServices();
  const updated = existing.map((s) => (s.id === service.id ? service : s));
  saveUserServices(updated);
  return updated;
}

/**
 * Clear all user-added services
 */
export function clearUserServices(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_SERVICES_KEY);
  } catch {
    // Ignore errors
  }
}
