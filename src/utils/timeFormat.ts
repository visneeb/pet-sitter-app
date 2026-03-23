export type TimeOption = { value: string; label: string };

/**
 * Generate time options in 12-hour format with given step in minutes.
 * @param stepMinutes - Interval between options (default 30)
 * @returns Array of { value: "HH:mm", label: "h:mm AM/PM" }
 */
export function generateTimeOptions(stepMinutes = 30): TimeOption[] {
  const options: TimeOption[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const label = format24hTo12h(value);
      options.push({ value, label });
    }
  }
  return options;
}

/**
 * Convert 24h "HH:mm" to 12h "h:mm AM/PM"
 */
export function format24hTo12h(value: string | null | undefined): string {
  if (!value || typeof value !== "string") return "";
  const [hStr, mStr] = value.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = parseInt(mStr ?? "0", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

/**
 * Get the next time slot after a given time (for end time min constraint).
 * @param time - 24h "HH:mm" format
 * @param stepMinutes - Interval in minutes (default 30)
 * @returns Next slot in "HH:mm" or "" if invalid
 */
export function getNextTimeSlot(
  time: string | null | undefined,
  stepMinutes = 30,
): string {
  if (!time || typeof time !== "string") return "";
  const [hStr, mStr] = time.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = parseInt(mStr ?? "0", 10);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  let totalMins = h * 60 + m + stepMinutes;
  if (totalMins >= 24 * 60) return "24:00"; // no valid slot after; excludes all options
  const nh = Math.floor(totalMins / 60);
  const nm = totalMins % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

/**
 * Parse 12h "h:mm AM/PM" or "h:mmAM" back to 24h "HH:mm"
 */
export function parse12hTo24h(display: string): string {
  if (!display || typeof display !== "string") return "";
  const match = display.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return "";
  let h = parseInt(match[1] ?? "0", 10);
  const m = parseInt(match[2] ?? "0", 10);
  const period = (match[3] ?? "AM").toUpperCase();
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  if (h === 12) h = period === "AM" ? 0 : 12;
  else if (period === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function formatDateRange(startTime: string, endTime: string) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const date = start.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };

  const startHour = start.toLocaleTimeString("en-US", timeOptions);
  const endHour = end.toLocaleTimeString("en-US", timeOptions);

  return `${date}  |  ${startHour} - ${endHour}`;
}

export function formatDuration(startTime: string, endTime: string) {
  const diffMs = new Date(endTime).getTime() - new Date(startTime).getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}h ${minutes}m`;
}

export function formatTransactionDate(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTransactionDateWithOutWeekDay(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
