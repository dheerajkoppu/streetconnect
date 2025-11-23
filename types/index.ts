// Service Categories
export type ServiceCategory =
  | "shelter"
  | "food"
  | "showers"
  | "laundry"
  | "medical"
  | "mental_health"
  | "day_center"
  | "id_legal"
  | "other";

// Hours for a single day
export interface ServiceHoursForDay {
  open: string | null;  // "09:00" 24h format, null if closed
  close: string | null; // "17:00" 24h format, null if closed
}

// Weekly hours
export interface ServiceHours {
  monday: ServiceHoursForDay;
  tuesday: ServiceHoursForDay;
  wednesday: ServiceHoursForDay;
  thursday: ServiceHoursForDay;
  friday: ServiceHoursForDay;
  saturday: ServiceHoursForDay;
  sunday: ServiceHoursForDay;
}

// Eligibility requirements
export interface ServiceEligibility {
  minAge?: number;
  maxAge?: number;
  genderRestrictions?: "women_only" | "men_only" | "all_genders";
  familiesAllowed?: boolean;
  singlesAllowed?: boolean;
  lgbtqFriendly?: boolean;
  requiresID?: boolean;
  requiresSobriety?: boolean;
  description?: string; // short human-readable text
}

// Accessibility features
export interface ServiceAccessibility {
  wheelchairAccessible?: boolean;
  petsAllowed?: boolean;
  serviceAnimalsAllowed?: boolean;
  languages?: string[];
}

// Address with optional coordinates
export interface ServiceAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  lat?: number;
  lng?: number;
}

// Service flags
export interface ServiceFlags {
  noIDRequired?: boolean;
  lowBarrier?: boolean;
  youthFocused?: boolean;
}

// Main Service type
export interface Service {
  id: string;
  name: string;
  categories: ServiceCategory[];
  descriptionShort: string;
  descriptionLong?: string;
  phone?: string;
  website?: string;
  address: ServiceAddress;
  hours: ServiceHours;
  eligibility: ServiceEligibility;
  accessibility: ServiceAccessibility;
  flags: ServiceFlags;
  notes: string[]; // bullet points
  lastVerified?: string; // ISO timestamp
}

// App configuration
export interface AppConfig {
  cityName: string;    // "Los Angeles"
  regionName: string;  // "Los Angeles County"
  defaultCenter: {
    lat: number;
    lng: number;
  };
  defaultRadiusKm: number;
}

// User location state
export interface UserLocation {
  lat: number;
  lng: number;
  source: "geolocation" | "manual";
  address?: string;
  timestamp: number;
}

// Filter state
export interface FilterState {
  openNow: boolean;
  maxDistance: "near" | "medium" | "far" | "all"; // 0-2km, 2-5km, 5+km, all
  petsAllowed: boolean;
  wheelchairAccessible: boolean;
  noIDRequired: boolean;
}

// Category display info
export interface CategoryInfo {
  id: ServiceCategory;
  label: string;
  icon: string;
  color: string;
}
