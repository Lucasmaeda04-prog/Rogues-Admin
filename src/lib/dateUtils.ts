/**
 * Converts a Brazilian format date to MySQL timestamp
 * @param dateString - Date in format "DD/MM/YYYY - HH:MM" or "DD/MM/YYYY"
 * @returns Timestamp in MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
 */
export function convertToTimestamp(dateString: string): string {
  if (!dateString || dateString.trim() === '') {
    const now = new Date();
    return formatToMySQLDateTime(now);
  }

  try {
    // Remove extra spaces and normalize
    const cleanDate = dateString.trim().replace(/\s+/g, ' ');

    // Regex to capture DD/MM/YYYY - HH:MM or DD/MM/YYYY (with or without spaces around "-")
    const dateTimeRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*-?\s*(\d{1,2}):(\d{1,2}))?$/;
    const match = cleanDate.match(dateTimeRegex);

    if (!match) {
      console.warn('Invalid date format:', dateString);
      const now = new Date();
      return formatToMySQLDateTime(now);
    }

    const [, day, month, year, hours = '23', minutes = '59'] = match;

    // Create date in local timezone
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(hours),
      parseInt(minutes),
      0,
      0
    );

    // Verify if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date created:', dateString);
      const now = new Date();
      return formatToMySQLDateTime(now);
    }

    return formatToMySQLDateTime(date);
  } catch (error) {
    console.error('Error converting date:', error);
    const now = new Date();
    return formatToMySQLDateTime(now);
  }
}

/**
 * Formats a date to MySQL DATETIME format
 * @param date - Date object
 * @returns String in format YYYY-MM-DD HH:MM:SS
 */
function formatToMySQLDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Converts a Brazilian format date to ISO string
 * @param dateString - Date in format "DD/MM/YYYY - HH:MM" or "DD/MM/YYYY"
 * @returns Date in ISO string format
 */
export function convertToISOString(dateString: string): string {
  const timestamp = convertToTimestamp(dateString);
  return new Date(timestamp).toISOString();
}

/**
 * Validates if a date is in the correct Brazilian format
 * @param dateString - Date to validate
 * @returns true if valid
 */
export function isValidBrazilianDate(dateString: string): boolean {
  if (!dateString || dateString.trim() === '') {
    return true; // Empty date is considered valid (optional)
  }

  // Normalize spaces and remove multiple spaces
  const normalized = dateString.trim().replace(/\s+/g, ' ');

  // Accept both "DD/MM/YYYY - HH:MM" and "DD/MM/YYYY-HH:MM" (with or without spaces)
  const dateTimeRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s*-?\s*(\d{1,2}):(\d{1,2}))?$/;
  const match = normalized.match(dateTimeRegex);

  if (!match) {
    return false;
  }

  const [, day, month, year, hours = '0', minutes = '0'] = match;

  // Basic validations
  const dayNum = parseInt(day);
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  const hoursNum = parseInt(hours);
  const minutesNum = parseInt(minutes);

  if (dayNum < 1 || dayNum > 31) return false;
  if (monthNum < 1 || monthNum > 12) return false;
  if (yearNum < 2000 || yearNum > 2100) return false;
  if (hoursNum < 0 || hoursNum > 23) return false;
  if (minutesNum < 0 || minutesNum > 59) return false;

  // Verify if date is valid by creating a Date object
  try {
    const date = new Date(yearNum, monthNum - 1, dayNum, hoursNum, minutesNum);
    return date.getFullYear() === yearNum &&
           date.getMonth() === monthNum - 1 &&
           date.getDate() === dayNum;
  } catch {
    return false;
  }
}