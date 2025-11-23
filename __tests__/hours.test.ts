import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isOpenNow,
  formatTime,
  formatDayHours,
  getOpenStatusText,
  getHoursTable,
} from "../lib/hours";
import { ServiceHours } from "../types";

// Helper to create hours object
function createHours(overrides: Partial<ServiceHours> = {}): ServiceHours {
  const defaultDay = { open: "09:00", close: "17:00" };
  return {
    monday: defaultDay,
    tuesday: defaultDay,
    wednesday: defaultDay,
    thursday: defaultDay,
    friday: defaultDay,
    saturday: { open: null, close: null },
    sunday: { open: null, close: null },
    ...overrides,
  };
}

describe("formatTime", () => {
  it("formats morning time correctly", () => {
    expect(formatTime("09:00")).toBe("9 AM");
  });

  it("formats afternoon time correctly", () => {
    expect(formatTime("14:00")).toBe("2 PM");
  });

  it("formats time with minutes correctly", () => {
    expect(formatTime("09:30")).toBe("9:30 AM");
    expect(formatTime("14:45")).toBe("2:45 PM");
  });

  it("formats noon correctly", () => {
    expect(formatTime("12:00")).toBe("12 PM");
  });

  it("formats midnight correctly", () => {
    expect(formatTime("00:00")).toBe("12 AM");
  });

  it("returns Closed for null", () => {
    expect(formatTime(null)).toBe("Closed");
  });
});

describe("formatDayHours", () => {
  it("formats open hours correctly", () => {
    expect(formatDayHours({ open: "09:00", close: "17:00" })).toBe(
      "9 AM - 5 PM"
    );
  });

  it("returns Closed when both are null", () => {
    expect(formatDayHours({ open: null, close: null })).toBe("Closed");
  });

  it("returns Open 24 hours for 00:00-23:59", () => {
    expect(formatDayHours({ open: "00:00", close: "23:59" })).toBe(
      "Open 24 hours"
    );
  });
});

describe("isOpenNow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when open during business hours", () => {
    // Set to Monday 10:00 AM
    vi.setSystemTime(new Date(2024, 0, 1, 10, 0)); // Monday
    const hours = createHours();
    expect(isOpenNow(hours)).toBe(true);
  });

  it("returns false when closed (before opening)", () => {
    // Set to Monday 8:00 AM (before 9 AM open)
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0));
    const hours = createHours();
    expect(isOpenNow(hours)).toBe(false);
  });

  it("returns false when closed (after closing)", () => {
    // Set to Monday 18:00 (after 5 PM close)
    vi.setSystemTime(new Date(2024, 0, 1, 18, 0));
    const hours = createHours();
    expect(isOpenNow(hours)).toBe(false);
  });

  it("returns false on closed days", () => {
    // Set to Saturday 10:00 AM
    vi.setSystemTime(new Date(2024, 0, 6, 10, 0)); // Saturday
    const hours = createHours();
    expect(isOpenNow(hours)).toBe(false);
  });

  it("returns true for 24-hour services", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 3, 0)); // 3 AM Monday
    const hours = createHours({
      monday: { open: "00:00", close: "23:59" },
    });
    expect(isOpenNow(hours)).toBe(true);
  });

  it("handles overnight hours correctly", () => {
    // Service open 17:00-07:00
    const hours = createHours({
      monday: { open: "17:00", close: "07:00" },
    });

    // At 20:00 (8 PM) should be open
    vi.setSystemTime(new Date(2024, 0, 1, 20, 0));
    expect(isOpenNow(hours)).toBe(true);

    // At 3:00 AM should be open
    vi.setSystemTime(new Date(2024, 0, 1, 3, 0));
    expect(isOpenNow(hours)).toBe(true);

    // At 10:00 AM should be closed
    vi.setSystemTime(new Date(2024, 0, 1, 10, 0));
    expect(isOpenNow(hours)).toBe(false);
  });
});

describe("getOpenStatusText", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns open status with closing time", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 10, 0)); // Monday 10 AM
    const hours = createHours();
    const status = getOpenStatusText(hours);
    expect(status.isOpen).toBe(true);
    expect(status.text).toBe("Open until 5 PM");
    expect(status.color).toBe("green");
  });

  it("returns closed today for closed days", () => {
    vi.setSystemTime(new Date(2024, 0, 6, 10, 0)); // Saturday
    const hours = createHours();
    const status = getOpenStatusText(hours);
    expect(status.isOpen).toBe(false);
    expect(status.text).toBe("Closed today");
    expect(status.color).toBe("red");
  });

  it("returns opens at time when closed but opens later", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 8, 0)); // Monday 8 AM
    const hours = createHours();
    const status = getOpenStatusText(hours);
    expect(status.isOpen).toBe(false);
    expect(status.text).toBe("Opens at 9 AM");
    expect(status.color).toBe("yellow");
  });

  it("returns Open 24 hours for always-open services", () => {
    vi.setSystemTime(new Date(2024, 0, 1, 10, 0));
    const hours = createHours({
      monday: { open: "00:00", close: "23:59" },
    });
    const status = getOpenStatusText(hours);
    expect(status.text).toBe("Open 24 hours");
    expect(status.color).toBe("green");
  });
});

describe("getHoursTable", () => {
  it("returns all 7 days", () => {
    const hours = createHours();
    const table = getHoursTable(hours);
    expect(table).toHaveLength(7);
  });

  it("marks current day as today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 0, 1, 10, 0)); // Monday

    const hours = createHours();
    const table = getHoursTable(hours);

    const monday = table.find((d) => d.day === "Mon");
    expect(monday?.isToday).toBe(true);

    const tuesday = table.find((d) => d.day === "Tue");
    expect(tuesday?.isToday).toBe(false);

    vi.useRealTimers();
  });

  it("formats hours correctly for each day", () => {
    const hours = createHours();
    const table = getHoursTable(hours);

    const monday = table.find((d) => d.day === "Mon");
    expect(monday?.hours).toBe("9 AM - 5 PM");

    const saturday = table.find((d) => d.day === "Sat");
    expect(saturday?.hours).toBe("Closed");
  });
});
