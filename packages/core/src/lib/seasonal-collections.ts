/**
 * Seasonal Stock Image Collections
 * Configure seasonal image collections with date ranges (fixed and variable)
 */

import { holidayCalculators, getHolidayDateRange, isDateInRange } from "./holiday-calculator";

export type HolidayType = "fixed" | "variable";

export interface BaseSeasonalCollection {
  id: string;
  name: string;
  folder: string;
  categories: ("photo_inserts" | "canvas_paintings" | "puzzle_inserts")[];
  type: HolidayType;
}

export interface FixedSeasonalCollection extends BaseSeasonalCollection {
  type: "fixed";
  startMonth: number; // 1-12 (January = 1, December = 12)
  startDay: number; // 1-31
  endMonth: number;
  endDay: number;
}

export interface VariableSeasonalCollection extends BaseSeasonalCollection {
  type: "variable";
  calculator: keyof typeof holidayCalculators;
  daysBefore: number; // How many days before the holiday to start showing images
  daysAfter: number; // How many days after the holiday to continue showing images
}

export type SeasonalCollection = FixedSeasonalCollection | VariableSeasonalCollection;

/**
 * Seasonal and holiday collections configuration
 * During the specified date range, images from the seasonal folder
 * will be merged with the base collection
 */
export const seasonalCollections: SeasonalCollection[] = [
  // ===== SEASONS =====
  {
    id: "spring",
    name: "Spring",
    folder: "spring",
    type: "fixed",
    startMonth: 3, // March
    startDay: 20, // March 20 (Spring Equinox)
    endMonth: 6, // June
    endDay: 19, // June 19 (day before Summer Solstice)
    categories: ["photo_inserts"],
  },
  {
    id: "summer",
    name: "Summer",
    folder: "summer",
    type: "fixed",
    startMonth: 6, // June
    startDay: 20, // June 20 (Summer Solstice)
    endMonth: 9, // September
    endDay: 21, // September 21 (day before Autumn Equinox)
    categories: ["photo_inserts"],
  },
  {
    id: "autumn",
    name: "Autumn",
    folder: "autumn",
    type: "fixed",
    startMonth: 9, // September
    startDay: 22, // September 22 (Autumn Equinox)
    endMonth: 12, // December
    endDay: 20, // December 20 (day before Winter Solstice)
    categories: ["photo_inserts"],
  },
  {
    id: "winter",
    name: "Winter",
    folder: "winter",
    type: "fixed",
    startMonth: 12, // December
    startDay: 21, // December 21 (Winter Solstice)
    endMonth: 3, // March
    endDay: 19, // March 19 (day before Spring Equinox)
    categories: ["photo_inserts"],
  },

  // ===== FIXED DATE HOLIDAYS =====
  {
    id: "valentines",
    name: "Valentine's Day",
    folder: "valentines",
    type: "fixed",
    startMonth: 2, // February
    startDay: 7, // Week before
    endMonth: 2, // February
    endDay: 14, // Valentine's Day
    categories: ["photo_inserts"],
  },
  {
    id: "independence_day",
    name: "Independence Day",
    folder: "independence_day",
    type: "fixed",
    startMonth: 6, // June
    startDay: 27, // Week before
    endMonth: 7, // July
    endDay: 4, // July 4th
    categories: ["photo_inserts"],
  },
  {
    id: "halloween",
    name: "Halloween",
    folder: "halloween",
    type: "fixed",
    startMonth: 10, // October
    startDay: 15, // Mid-October
    endMonth: 10, // October
    endDay: 31, // Halloween
    categories: ["photo_inserts"],
  },
  {
    id: "christmas",
    name: "Christmas & Winter Holidays",
    folder: "christmas",
    type: "fixed",
    startMonth: 11, // November
    startDay: 20, // Late November
    endMonth: 12, // December
    endDay: 31, // New Year's Eve
    categories: ["photo_inserts", "canvas_paintings", "puzzle_inserts"],
  },

  // ===== VARIABLE DATE HOLIDAYS =====
  {
    id: "easter",
    name: "Easter",
    folder: "easter",
    type: "variable",
    calculator: "easter",
    daysBefore: 14, // 2 weeks before Easter
    daysAfter: 0, // Ends on Easter Sunday
    categories: ["photo_inserts"],
  },
  {
    id: "fathers_day",
    name: "Father's Day",
    folder: "fathers_day",
    type: "variable",
    calculator: "fathersDay",
    daysBefore: 10, // 10 days before
    daysAfter: 0, // Ends on Father's Day
    categories: ["photo_inserts"],
  },
  {
    id: "thanksgiving",
    name: "Thanksgiving",
    folder: "thanksgiving",
    type: "variable",
    calculator: "thanksgiving",
    daysBefore: 14, // 2 weeks before
    daysAfter: 0, // Ends on Thanksgiving
    categories: ["photo_inserts"],
  },
];

/**
 * Check if a fixed-date seasonal collection is currently active
 */
function isFixedSeasonActive(collection: FixedSeasonalCollection, currentDate: Date): boolean {
  const month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
  const day = currentDate.getDate();

  const { startMonth, startDay, endMonth, endDay } = collection;

  // Handle same-month ranges (e.g., October 1-31)
  if (startMonth === endMonth) {
    return month === startMonth && day >= startDay && day <= endDay;
  }

  // Handle cross-year ranges (e.g., November 20 - December 31)
  if (startMonth < endMonth) {
    // Start month: check if day >= startDay
    if (month === startMonth && day >= startDay) return true;

    // Middle months: always active
    if (month > startMonth && month < endMonth) return true;

    // End month: check if day <= endDay
    if (month === endMonth && day <= endDay) return true;
  }

  // Handle year-wrapping ranges (e.g., December 15 - January 15)
  if (startMonth > endMonth) {
    // After start date in start month
    if (month === startMonth && day >= startDay) return true;

    // Months after start month (Dec, in Dec-Jan example)
    if (month > startMonth) return true;

    // Before end date in end month (Jan, in Dec-Jan example)
    if (month === endMonth && day <= endDay) return true;

    // Months before end month and after January
    if (month > 0 && month < endMonth) return true;
  }

  return false;
}

/**
 * Check if a variable-date seasonal collection is currently active
 */
function isVariableSeasonActive(
  collection: VariableSeasonalCollection,
  currentDate: Date
): boolean {
  const year = currentDate.getFullYear();

  try {
    // Calculate the holiday date for this year
    const holidayDate = holidayCalculators[collection.calculator](year);

    // Get the date range
    const { startDate, endDate } = getHolidayDateRange(
      holidayDate,
      collection.daysBefore,
      collection.daysAfter
    );

    // Check if current date falls within range
    return isDateInRange(currentDate, startDate, endDate);
  } catch (error) {
    console.error(`Error calculating ${collection.name} date:`, error);
    return false;
  }
}

/**
 * Check if a seasonal collection is currently active
 */
export function isSeasonActive(
  collection: SeasonalCollection,
  currentDate: Date = new Date()
): boolean {
  if (collection.type === "fixed") {
    return isFixedSeasonActive(collection, currentDate);
  } else {
    return isVariableSeasonActive(collection, currentDate);
  }
}

/**
 * Get all currently active seasonal collections
 */
export function getActiveSeasonalCollections(currentDate: Date = new Date()): SeasonalCollection[] {
  return seasonalCollections.filter((collection) => isSeasonActive(collection, currentDate));
}
