const MONTH_ABBREV = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Format Date for review display: "Aug 16, 2023"
 * @param date - Date to format (Date, string, number, or null/undefined)
 * @returns Formatted string "Mon DD, YYYY" or empty string if invalid
 */
export function formatReviewDate(
  date: Date | string | number | null | undefined
): string {
  if (date == null) return "";
  const d = typeof date === "object" ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = MONTH_ABBREV[d.getMonth()];
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
}

/**
 * Format Date for DatePicker display: "23 Aug, 2023"
 * @param date - Date to format (Date, string, number, or null/undefined)
 * @returns Formatted string "DD Mon, YYYY" or empty string if invalid
 */
export function formatDatePickerDisplay(
  date: Date | string | number | null | undefined
): string {
  if (date == null) return "";
  const d = typeof date === "object" ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_ABBREV[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
}
