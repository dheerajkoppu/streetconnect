import { Service, ServiceCategory } from "@/types";

// Overpass API endpoint (free, no API key needed)
const OVERPASS_API = "https://overpass-api.de/api/interpreter";

// Map OSM amenity types to our service categories
const OSM_TO_CATEGORY: Record<string, ServiceCategory[]> = {
  shelter: ["shelter"],
  social_facility: ["shelter", "day_center"],
  food_bank: ["food"],
  soup_kitchen: ["food"],
  clinic: ["medical"],
  hospital: ["medical"],
  pharmacy: ["medical"],
  doctors: ["medical"],
  community_centre: ["day_center"],
  laundry: ["laundry"],
  toilets: ["showers"], // Public toilets often have shower facilities
  public_bath: ["showers"],
};

// Types of places to search for
const AMENITY_TYPES = [
  "shelter",
  "social_facility",
  "food_bank",
  "soup_kitchen",
  "clinic",
  "community_centre",
];

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    amenity?: string;
    social_facility?: string;
    "addr:street"?: string;
    "addr:city"?: string;
    "addr:state"?: string;
    "addr:postcode"?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
    wheelchair?: string;
    description?: string;
  };
}

/**
 * Fetch local services from OpenStreetMap via Overpass API
 */
export async function fetchLocalServices(
  lat: number,
  lng: number,
  radiusMeters: number = 5000,
  locationInfo?: { city: string; state: string }
): Promise<Service[]> {
  const amenityFilter = AMENITY_TYPES.map(
    (type) => `node["amenity"="${type}"](around:${radiusMeters},${lat},${lng});`
  ).join("\n");

  const query = `
    [out:json][timeout:25];
    (
      ${amenityFilter}
      node["social_facility"](around:${radiusMeters},${lat},${lng});
      way["amenity"="shelter"](around:${radiusMeters},${lat},${lng});
      way["amenity"="social_facility"](around:${radiusMeters},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    return parseOverpassResults(data.elements || [], locationInfo);
  } catch (error) {
    console.error("Failed to fetch local services:", error);
    return [];
  }
}

/**
 * Parse Overpass API results into our Service format
 */
function parseOverpassResults(
  elements: OverpassElement[],
  locationInfo?: { city: string; state: string }
): Service[] {
  const services: Service[] = [];

  for (const el of elements) {
    if (!el.tags?.name) continue; // Skip unnamed places

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (!lat || !lon) continue;

    const amenity = el.tags.amenity || el.tags.social_facility || "social_facility";
    const categories = OSM_TO_CATEGORY[amenity] || ["other"];

    const service: Service = {
      id: `osm-${el.type}-${el.id}`,
      name: el.tags.name,
      categories,
      descriptionShort: el.tags.description || getDefaultDescription(amenity),
      phone: el.tags.phone,
      website: el.tags.website,
      address: {
        street: el.tags["addr:street"] || "Address not available",
        city: el.tags["addr:city"] || locationInfo?.city || "",
        state: el.tags["addr:state"] || locationInfo?.state || "",
        postalCode: el.tags["addr:postcode"] || "",
        lat,
        lng: lon,
      },
      hours: parseOpeningHours(el.tags.opening_hours),
      eligibility: {
        description: "Contact for eligibility information",
      },
      accessibility: {
        wheelchairAccessible: el.tags.wheelchair === "yes",
      },
      flags: {},
      notes: [],
    };

    services.push(service);
  }

  return services;
}

/**
 * Get a default description based on amenity type
 */
function getDefaultDescription(amenity: string): string {
  const descriptions: Record<string, string> = {
    shelter: "Emergency shelter providing temporary housing and support services.",
    social_facility: "Community resource center offering various social services.",
    food_bank: "Food distribution center providing free groceries and supplies.",
    soup_kitchen: "Free meal service for those in need.",
    clinic: "Healthcare clinic offering medical services.",
    community_centre: "Community center with resources and programs.",
  };
  return descriptions[amenity] || "Local service provider.";
}

/**
 * Parse OSM opening_hours format into our hours structure
 * This is a simplified parser - OSM hours format is complex
 */
function parseOpeningHours(hoursStr?: string): Service["hours"] {
  const defaultClosed = { open: null, close: null };
  const defaultHours = {
    monday: defaultClosed,
    tuesday: defaultClosed,
    wednesday: defaultClosed,
    thursday: defaultClosed,
    friday: defaultClosed,
    saturday: defaultClosed,
    sunday: defaultClosed,
  };

  if (!hoursStr) return defaultHours;

  // Handle "24/7"
  if (hoursStr === "24/7") {
    const allDay = { open: "00:00", close: "23:59" };
    return {
      monday: allDay,
      tuesday: allDay,
      wednesday: allDay,
      thursday: allDay,
      friday: allDay,
      saturday: allDay,
      sunday: allDay,
    };
  }

  // For complex formats, just return default for now
  // A full parser would handle formats like "Mo-Fr 09:00-17:00; Sa 10:00-14:00"
  return defaultHours;
}

/**
 * Reverse geocode coordinates to get city name
 */
export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ city: string; state: string; country: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`,
      {
        headers: {
          "User-Agent": "StreetConnect/1.0",
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const address = data.address || {};

    return {
      city: address.city || address.town || address.village || address.county || "Unknown",
      state: address.state || "",
      country: address.country || "",
    };
  } catch {
    return null;
  }
}
