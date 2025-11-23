import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { filterServices, sortServices, getDefaultFilters } from "../lib/filters";
import { Service, FilterState } from "../types";

// Mock service data
const createMockService = (overrides: Partial<Service> = {}): Service => ({
  id: "test-1",
  name: "Test Service",
  categories: ["shelter"],
  descriptionShort: "A test service",
  phone: "(555) 123-4567",
  address: {
    street: "123 Test St",
    city: "Los Angeles",
    state: "CA",
    postalCode: "90001",
    lat: 34.0522,
    lng: -118.2437,
  },
  hours: {
    monday: { open: "09:00", close: "17:00" },
    tuesday: { open: "09:00", close: "17:00" },
    wednesday: { open: "09:00", close: "17:00" },
    thursday: { open: "09:00", close: "17:00" },
    friday: { open: "09:00", close: "17:00" },
    saturday: { open: null, close: null },
    sunday: { open: null, close: null },
  },
  eligibility: {
    genderRestrictions: "all_genders",
    requiresID: false,
  },
  accessibility: {
    wheelchairAccessible: true,
    petsAllowed: false,
  },
  flags: {
    noIDRequired: true,
  },
  notes: [],
  ...overrides,
});

describe("filterServices", () => {
  const defaultFilters = getDefaultFilters();

  beforeEach(() => {
    vi.useFakeTimers();
    // Set to Monday 10:00 AM
    vi.setSystemTime(new Date(2024, 0, 1, 10, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns all services with no filters", () => {
    const services = [
      createMockService({ id: "1" }),
      createMockService({ id: "2" }),
    ];

    const filtered = filterServices(services, defaultFilters, null, null, "");
    expect(filtered).toHaveLength(2);
  });

  it("filters by category", () => {
    const services = [
      createMockService({ id: "1", categories: ["shelter"] }),
      createMockService({ id: "2", categories: ["food"] }),
      createMockService({ id: "3", categories: ["shelter", "food"] }),
    ];

    const filtered = filterServices(
      services,
      defaultFilters,
      "shelter",
      null,
      ""
    );
    expect(filtered).toHaveLength(2);
    expect(filtered.map((s) => s.id)).toContain("1");
    expect(filtered.map((s) => s.id)).toContain("3");
  });

  it("filters by search query (name)", () => {
    const services = [
      createMockService({ id: "1", name: "Union Rescue Mission" }),
      createMockService({ id: "2", name: "Midnight Mission" }),
      createMockService({ id: "3", name: "Food Bank" }),
    ];

    const filtered = filterServices(
      services,
      defaultFilters,
      null,
      null,
      "mission"
    );
    expect(filtered).toHaveLength(2);
  });

  it("filters by search query (description)", () => {
    const services = [
      createMockService({
        id: "1",
        descriptionShort: "Emergency shelter services",
      }),
      createMockService({ id: "2", descriptionShort: "Hot meals daily" }),
    ];

    const filtered = filterServices(
      services,
      defaultFilters,
      null,
      null,
      "shelter"
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("filters by open now", () => {
    const services = [
      createMockService({
        id: "1",
        hours: {
          monday: { open: "09:00", close: "17:00" },
          tuesday: { open: "09:00", close: "17:00" },
          wednesday: { open: "09:00", close: "17:00" },
          thursday: { open: "09:00", close: "17:00" },
          friday: { open: "09:00", close: "17:00" },
          saturday: { open: null, close: null },
          sunday: { open: null, close: null },
        },
      }),
      createMockService({
        id: "2",
        hours: {
          monday: { open: "18:00", close: "22:00" },
          tuesday: { open: "18:00", close: "22:00" },
          wednesday: { open: "18:00", close: "22:00" },
          thursday: { open: "18:00", close: "22:00" },
          friday: { open: "18:00", close: "22:00" },
          saturday: { open: null, close: null },
          sunday: { open: null, close: null },
        },
      }),
    ];

    const filtersWithOpenNow: FilterState = { ...defaultFilters, openNow: true };
    const filtered = filterServices(
      services,
      filtersWithOpenNow,
      null,
      null,
      ""
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("filters by pets allowed", () => {
    const services = [
      createMockService({
        id: "1",
        accessibility: { petsAllowed: true },
      }),
      createMockService({
        id: "2",
        accessibility: { petsAllowed: false },
      }),
    ];

    const filtersWithPets: FilterState = {
      ...defaultFilters,
      petsAllowed: true,
    };
    const filtered = filterServices(services, filtersWithPets, null, null, "");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("filters by wheelchair accessible", () => {
    const services = [
      createMockService({
        id: "1",
        accessibility: { wheelchairAccessible: true },
      }),
      createMockService({
        id: "2",
        accessibility: { wheelchairAccessible: false },
      }),
    ];

    const filtersWithWheelchair: FilterState = {
      ...defaultFilters,
      wheelchairAccessible: true,
    };
    const filtered = filterServices(
      services,
      filtersWithWheelchair,
      null,
      null,
      ""
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("filters by no ID required", () => {
    const services = [
      createMockService({ id: "1", flags: { noIDRequired: true } }),
      createMockService({ id: "2", flags: { noIDRequired: false } }),
    ];

    const filtersWithNoID: FilterState = {
      ...defaultFilters,
      noIDRequired: true,
    };
    const filtered = filterServices(services, filtersWithNoID, null, null, "");
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("filters by distance when location is provided", () => {
    const userLocation = { lat: 34.0522, lng: -118.2437 };

    const services = [
      createMockService({
        id: "1",
        address: { ...createMockService().address, lat: 34.0522, lng: -118.2437 }, // Same location
      }),
      createMockService({
        id: "2",
        address: { ...createMockService().address, lat: 34.1, lng: -118.3 }, // ~6 km away
      }),
    ];

    const filtersWithNearDistance: FilterState = {
      ...defaultFilters,
      maxDistance: "near", // 0-2 km
    };

    const filtered = filterServices(
      services,
      filtersWithNearDistance,
      null,
      userLocation,
      ""
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });

  it("combines multiple filters", () => {
    const services = [
      createMockService({
        id: "1",
        categories: ["shelter"],
        accessibility: { petsAllowed: true },
        flags: { noIDRequired: true },
      }),
      createMockService({
        id: "2",
        categories: ["shelter"],
        accessibility: { petsAllowed: false },
        flags: { noIDRequired: true },
      }),
      createMockService({
        id: "3",
        categories: ["food"],
        accessibility: { petsAllowed: true },
        flags: { noIDRequired: true },
      }),
    ];

    const combinedFilters: FilterState = {
      ...defaultFilters,
      petsAllowed: true,
      noIDRequired: true,
    };

    const filtered = filterServices(
      services,
      combinedFilters,
      "shelter",
      null,
      ""
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("1");
  });
});

describe("sortServices", () => {
  it("sorts alphabetically when no location provided", () => {
    const services = [
      createMockService({ id: "1", name: "Zebra Shelter" }),
      createMockService({ id: "2", name: "Apple Mission" }),
      createMockService({ id: "3", name: "Middle Place" }),
    ];

    const sorted = sortServices(services, null);
    expect(sorted[0].name).toBe("Apple Mission");
    expect(sorted[1].name).toBe("Middle Place");
    expect(sorted[2].name).toBe("Zebra Shelter");
  });

  it("sorts by distance when location provided", () => {
    const userLocation = { lat: 34.0522, lng: -118.2437 };

    const services = [
      createMockService({
        id: "1",
        name: "Far Away",
        address: { ...createMockService().address, lat: 34.2, lng: -118.5 },
      }),
      createMockService({
        id: "2",
        name: "Very Close",
        address: { ...createMockService().address, lat: 34.053, lng: -118.244 },
      }),
      createMockService({
        id: "3",
        name: "Medium Distance",
        address: { ...createMockService().address, lat: 34.1, lng: -118.3 },
      }),
    ];

    const sorted = sortServices(services, userLocation);
    expect(sorted[0].name).toBe("Very Close");
    expect(sorted[1].name).toBe("Medium Distance");
    expect(sorted[2].name).toBe("Far Away");
  });

  it("handles services without coordinates", () => {
    const userLocation = { lat: 34.0522, lng: -118.2437 };

    const services = [
      createMockService({
        id: "1",
        name: "No Coords",
        address: {
          street: "123 Test",
          city: "LA",
          state: "CA",
          postalCode: "90001",
        },
      }),
      createMockService({
        id: "2",
        name: "Has Coords",
        address: { ...createMockService().address, lat: 34.053, lng: -118.244 },
      }),
    ];

    const sorted = sortServices(services, userLocation);
    // Service with coords should come first
    expect(sorted[0].name).toBe("Has Coords");
    expect(sorted[1].name).toBe("No Coords");
  });
});

describe("getDefaultFilters", () => {
  it("returns correct default values", () => {
    const filters = getDefaultFilters();
    expect(filters.openNow).toBe(false);
    expect(filters.maxDistance).toBe("all");
    expect(filters.petsAllowed).toBe(false);
    expect(filters.wheelchairAccessible).toBe(false);
    expect(filters.noIDRequired).toBe(false);
  });
});
