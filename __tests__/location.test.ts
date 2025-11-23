import { describe, it, expect } from "vitest";
import { calculateDistance, formatDistance } from "../lib/location";

describe("calculateDistance", () => {
  it("calculates distance between two points correctly", () => {
    // Los Angeles to San Francisco (approximately 559 km)
    const laLat = 34.0522;
    const laLng = -118.2437;
    const sfLat = 37.7749;
    const sfLng = -122.4194;

    const distance = calculateDistance(laLat, laLng, sfLat, sfLng);
    // Allow some tolerance for floating point
    expect(distance).toBeGreaterThan(550);
    expect(distance).toBeLessThan(570);
  });

  it("returns 0 for same location", () => {
    const lat = 34.0522;
    const lng = -118.2437;
    const distance = calculateDistance(lat, lng, lat, lng);
    expect(distance).toBe(0);
  });

  it("calculates short distances correctly", () => {
    // Two points about 1 km apart in downtown LA
    const lat1 = 34.0522;
    const lng1 = -118.2437;
    const lat2 = 34.0612; // About 1 km north
    const lng2 = -118.2437;

    const distance = calculateDistance(lat1, lng1, lat2, lng2);
    expect(distance).toBeGreaterThan(0.9);
    expect(distance).toBeLessThan(1.1);
  });

  it("handles negative coordinates", () => {
    // Sydney, Australia to Auckland, New Zealand
    const sydneyLat = -33.8688;
    const sydneyLng = 151.2093;
    const aucklandLat = -36.8509;
    const aucklandLng = 174.7645;

    const distance = calculateDistance(
      sydneyLat,
      sydneyLng,
      aucklandLat,
      aucklandLng
    );
    // About 2150 km
    expect(distance).toBeGreaterThan(2100);
    expect(distance).toBeLessThan(2200);
  });
});

describe("formatDistance", () => {
  it("formats very short distances as meters", () => {
    expect(formatDistance(0.05)).toBe("< 0.1 km");
  });

  it("formats sub-kilometer distances as meters", () => {
    expect(formatDistance(0.5)).toBe("500 m");
    expect(formatDistance(0.75)).toBe("750 m");
  });

  it("formats short distances with one decimal", () => {
    expect(formatDistance(1.5)).toBe("1.5 km");
    expect(formatDistance(5.7)).toBe("5.7 km");
  });

  it("formats long distances as whole numbers", () => {
    expect(formatDistance(15.3)).toBe("15 km");
    expect(formatDistance(100.9)).toBe("101 km");
  });
});
