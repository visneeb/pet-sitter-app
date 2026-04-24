/**
 * Booking wall clock is always interpreted as Asia/Bangkok (UTC+7, no DST),
 * regardless of the browser timezone.
 */

const PAD = (n: number) => String(n).padStart(2, "0");

function ymdKey(parts: { y: number; m: number; d: number }): number {
  return parts.y * 10_000 + parts.m * 100 + parts.d;
}

/** Calendar date of an instant in Asia/Bangkok. */
export function getBangkokDateParts(instant: Date): {
  y: number;
  m: number;
  d: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(instant);
  const n = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { y: n("year"), m: n("month"), d: n("day") };
}

/**
 * Calendar Y/M/D from a DayPicker `Date` (local getters), same basis as
 * {@link combineCalendarDateAndBangkokTime}.
 */
export function getPickerLocalYmd(date: Date): {
  y: number;
  m: number;
  d: number;
} {
  return {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
  };
}

/** True if the picker's local calendar day is strictly before "today" in Bangkok. */
export function isPickerLocalYmdBeforeBangkokToday(
  pickerCellDate: Date,
  now: Date = new Date(),
): boolean {
  return (
    ymdKey(getPickerLocalYmd(pickerCellDate)) < ymdKey(getBangkokDateParts(now))
  );
}

/** True if the selected picker day matches today's calendar date in Bangkok. */
export function isPickerLocalYmdSameBangkokToday(
  pickerDate: Date,
  now: Date = new Date(),
): boolean {
  const a = getPickerLocalYmd(pickerDate);
  const b = getBangkokDateParts(now);
  return a.y === b.y && a.m === b.m && a.d === b.d;
}

export function getBangkokClockParts(instant: Date): { h: number; mi: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instant);
  const n = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);
  return { h: n("hour"), mi: n("minute") };
}

/** Next 30-min (or step) slot from "now" on the Bangkok clock. */
export function getCurrentOrNextBangkokTimeSlot(
  now: Date = new Date(),
  stepMinutes = 30,
): string {
  const { h, mi } = getBangkokClockParts(now);
  const totalMinutes = h * 60 + mi;
  const roundedMinutes =
    totalMinutes % stepMinutes === 0
      ? totalMinutes
      : Math.ceil(totalMinutes / stepMinutes) * stepMinutes;

  if (roundedMinutes >= 24 * 60) return "24:00";

  const hours = Math.floor(roundedMinutes / 60);
  const minutes = roundedMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
}

function addUtcCalendarDays(
  year: number,
  month1: number,
  day: number,
  deltaDays: number,
): { year: number; month1: number; day: number } {
  const t = Date.UTC(year, month1 - 1, day + deltaDays);
  const d = new Date(t);
  return {
    year: d.getUTCFullYear(),
    month1: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

/**
 * Combines a calendar date (from the date picker) and "HH:mm" or "24:00"
 * into an absolute instant, treating the pair as Bangkok local civil time.
 */
export function combineCalendarDateAndBangkokTime(
  calendarDate: Date,
  timeHHmm: string,
): Date {
  const [rawH, rawM] = timeHHmm.split(":").map(Number);
  let h = rawH;
  const mi = Number.isFinite(rawM) ? rawM : 0;

  let y = calendarDate.getFullYear();
  let m = calendarDate.getMonth() + 1;
  let d = calendarDate.getDate();

  if (h === 24) {
    const next = addUtcCalendarDays(y, m, d, 1);
    y = next.year;
    m = next.month1;
    d = next.day;
    h = 0;
  }

  const isoLocal = `${y}-${PAD(m)}-${PAD(d)}T${PAD(h)}:${PAD(mi)}:00+07:00`;
  return new Date(isoLocal);
}
