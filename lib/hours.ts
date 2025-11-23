import { ServiceHours, ServiceHoursForDay } from "@/types";

type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

const DAYS: DayOfWeek[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

const DAY_FULL_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/**
 * Get the current day of week
 */
export function getCurrentDay(): DayOfWeek {
  return DAYS[new Date().getDay()];
}

/**
 * Get hours for today
 */
export function getTodayHours(hours: ServiceHours): ServiceHoursForDay {
  const day = getCurrentDay();
  return hours[day];
}

/**
 * Parse time string (HH:MM) to minutes since midnight
 */
function parseTime(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Get current time as minutes since midnight
 */
function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Check if a service is currently open
 */
export function isOpenNow(hours: ServiceHours): boolean {
  const todayHours = getTodayHours(hours);

  if (!todayHours.open || !todayHours.close) {
    return false;
  }

  const currentMinutes = getCurrentMinutes();
  const openMinutes = parseTime(todayHours.open);
  const closeMinutes = parseTime(todayHours.close);

  // Handle overnight hours (close time is next day)
  if (closeMinutes < openMinutes) {
    // Either after open time OR before close time (next day)
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }

  // Handle 24-hour (00:00 to 23:59)
  if (todayHours.open === "00:00" && todayHours.close === "23:59") {
    return true;
  }

  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

/**
 * Format time for display (24h to 12h)
 */
export function formatTime(time: string | null): string {
  if (!time) return "Closed";

  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;

  if (minutes === 0) {
    return `${displayHours} ${period}`;
  }
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

/**
 * Format hours for a single day
 */
export function formatDayHours(dayHours: ServiceHoursForDay): string {
  if (!dayHours.open || !dayHours.close) {
    return "Closed";
  }

  // Check for 24 hours
  if (dayHours.open === "00:00" && dayHours.close === "23:59") {
    return "Open 24 hours";
  }

  return `${formatTime(dayHours.open)} - ${formatTime(dayHours.close)}`;
}

/**
 * Get open status text with closing time
 */
export function getOpenStatusText(hours: ServiceHours): {
  isOpen: boolean;
  text: string;
  color: "green" | "red" | "yellow";
} {
  const todayHours = getTodayHours(hours);
  const open = isOpenNow(hours);

  if (!todayHours.open || !todayHours.close) {
    return {
      isOpen: false,
      text: "Closed today",
      color: "red",
    };
  }

  if (open) {
    // Check for 24 hours
    if (todayHours.open === "00:00" && todayHours.close === "23:59") {
      return {
        isOpen: true,
        text: "Open 24 hours",
        color: "green",
      };
    }
    return {
      isOpen: true,
      text: `Open until ${formatTime(todayHours.close)}`,
      color: "green",
    };
  }

  // Check if opening later today
  const currentMinutes = getCurrentMinutes();
  const openMinutes = parseTime(todayHours.open);

  if (currentMinutes < openMinutes) {
    return {
      isOpen: false,
      text: `Opens at ${formatTime(todayHours.open)}`,
      color: "yellow",
    };
  }

  return {
    isOpen: false,
    text: "Closed now",
    color: "red",
  };
}

/**
 * Get hours table data for display
 */
export function getHoursTable(
  hours: ServiceHours
): Array<{ day: string; dayFull: string; hours: string; isToday: boolean }> {
  const today = getCurrentDay();
  const orderedDays: DayOfWeek[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return orderedDays.map((day) => ({
    day: DAY_LABELS[day],
    dayFull: DAY_FULL_LABELS[day],
    hours: formatDayHours(hours[day]),
    isToday: day === today,
  }));
}
