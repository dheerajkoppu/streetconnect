import { Service, AppConfig } from "@/types";
import servicesData from "@/data/services.json";
import configData from "@/data/config.json";

/**
 * Get all services
 */
export function getServices(): Service[] {
  return servicesData as Service[];
}

/**
 * Get a service by ID
 */
export function getServiceById(id: string): Service | undefined {
  return (servicesData as Service[]).find((s) => s.id === id);
}

/**
 * Get app configuration
 */
export function getConfig(): AppConfig {
  return configData as AppConfig;
}

/**
 * Get all service IDs (for static generation)
 */
export function getAllServiceIds(): string[] {
  return (servicesData as Service[]).map((s) => s.id);
}
