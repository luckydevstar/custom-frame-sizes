/**
 * Holiday Date Calculator
 * Calculates variable holiday dates that change each year
 */

/**
 * Calculate Easter Sunday using the Computus algorithm (Anonymous Gregorian)
 * Returns the date of Easter Sunday for a given year
 */
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

/**
 * Find the Nth occurrence of a day of week in a month
 * @param year - The year
 * @param month - The month (1-12)
 * @param dayOfWeek - Day of week (0=Sunday, 1=Monday, etc.)
 * @param occurrence - Which occurrence (1=first, 2=second, etc., -1=last)
 */
function getNthDayOfWeekInMonth(
  year: number,
  month: number,
  dayOfWeek: number,
  occurrence: number
): Date {
  if (occurrence === -1) {
    // Last occurrence - start from end of month and work backwards
    const lastDay = new Date(year, month, 0); // Last day of the month
    let day = lastDay.getDate();

    while (day > 0) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === dayOfWeek) {
        return date;
      }
      day--;
    }
  } else {
    // Nth occurrence - start from beginning of month
    let count = 0;
    let day = 1;

    while (day <= 31) {
      const date = new Date(year, month - 1, day);
      if (date.getMonth() !== month - 1) break; // Moved to next month

      if (date.getDay() === dayOfWeek) {
        count++;
        if (count === occurrence) {
          return date;
        }
      }
      day++;
    }
  }

  throw new Error(`Could not find ${occurrence}th ${dayOfWeek} in ${month}/${year}`);
}

/**
 * Holiday date calculator functions
 */
export const holidayCalculators = {
  /**
   * Father's Day - 3rd Sunday in June
   */
  fathersDay: (year: number): Date => {
    return getNthDayOfWeekInMonth(year, 6, 0, 3); // 3rd Sunday in June
  },

  /**
   * Thanksgiving - 4th Thursday in November
   */
  thanksgiving: (year: number): Date => {
    return getNthDayOfWeekInMonth(year, 11, 4, 4); // 4th Thursday in November
  },

  /**
   * Easter Sunday - Complex lunar calculation
   */
  easter: (year: number): Date => {
    return calculateEaster(year);
  },
};

/**
 * Get the date range for a holiday (typically 1-2 weeks before the actual date)
 * @param holidayDate - The actual holiday date
 * @param daysBefore - How many days before to start showing images (default: 14)
 * @param daysAfter - How many days after to continue showing images (default: 0)
 */
export function getHolidayDateRange(
  holidayDate: Date,
  daysBefore: number = 14,
  daysAfter: number = 0
): { startDate: Date; endDate: Date } {
  const startDate = new Date(holidayDate);
  startDate.setDate(startDate.getDate() - daysBefore);

  const endDate = new Date(holidayDate);
  endDate.setDate(endDate.getDate() + daysAfter);

  return { startDate, endDate };
}

/**
 * Check if a date falls within a date range
 */
export function isDateInRange(checkDate: Date, startDate: Date, endDate: Date): boolean {
  const check = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  return check >= start && check <= end;
}
