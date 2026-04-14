import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EventInput } from "@fullcalendar/core";
import { bookingApi } from "@/services/api/booking";
import type { SitterBookingRangeItem } from "@/types/BookingType";

interface DateRange {
  start: string;
  end: string;
}

interface UseBookingDateRangeHistoryResult {
  events: EventInput[];
  loadedRange: DateRange | null;
  isLoading: boolean;
  error: string | null;
  ensureMonthLoaded: (date: Date) => void;
}

function toDateOnlyString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function minDate(a: Date, b: Date): Date {
  return a < b ? a : b;
}

function maxDate(a: Date, b: Date): Date {
  return a > b ? a : b;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getStyle(status: string) {
  if (status === "Waiting for confirm") {
    return "event-pink hover:opacity-75";
  } else if (["Waiting for service", "In service"].includes(status)) {
    return "event-orange hover:opacity-75";
  } else if (status === "Success") {
    return "event-green hover:opacity-75";
  }

  return "";
}

export function useBookingDateRangeHistory(): UseBookingDateRangeHistoryResult {
  const [loadedStart, setLoadedStart] = useState<Date | null>(null);
  const [loadedEnd, setLoadedEnd] = useState<Date | null>(null);
  const [bookings, setBookings] = useState<SitterBookingRangeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pendingRangesRef = useRef<Set<string>>(new Set());

  const mergeBookings = useCallback((newItems: SitterBookingRangeItem[]) => {
    setBookings((prev) => {
      const map = new Map<number, SitterBookingRangeItem>();
      prev.forEach((b) => map.set(b.id, b));
      newItems.forEach((b) => map.set(b.id, b));
      return Array.from(map.values());
    });
  }, []);

  const fetchRange = useCallback(
    async (start: Date, end: Date) => {
      const startStr = toDateOnlyString(start);
      const endStr = toDateOnlyString(end);
      const rangeKey = `${startStr}_${endStr}`;

      if (pendingRangesRef.current.has(rangeKey)) {
        return;
      }

      pendingRangesRef.current.add(rangeKey);
      setIsLoading(true);
      setError(null);
      try {
        const res = await bookingApi.getSitterBookingsInRange(startStr, endStr);
        mergeBookings(res.bookings);
        setLoadedStart((prev) => (prev ? minDate(prev, start) : start));
        setLoadedEnd((prev) => (prev ? maxDate(prev, end) : end));
      } catch (err: any) {
        setError(
          err?.response?.data?.message ??
            err?.message ??
            "Failed to load booking history",
        );
      } finally {
        pendingRangesRef.current.delete(rangeKey);
        setIsLoading(false);
      }
    },
    [mergeBookings],
  );

  const ensureMonthLoaded = useCallback(
    (date: Date) => {
      const monthStart = getMonthStart(date);

      if (!loadedStart || !loadedEnd) {
        const currentMonth = getMonthStart(new Date());
        const initialStart = getMonthStart(addMonths(currentMonth, -2));
        const initialEnd = getMonthEnd(addMonths(currentMonth, 2));
        void fetchRange(initialStart, initialEnd);
        return;
      }

      const loadedStartMonth = getMonthStart(loadedStart);
      const loadedEndMonth = getMonthStart(loadedEnd);
      const forwardTriggerMonth = getMonthStart(addMonths(loadedEndMonth, -1));
      const backwardTriggerMonth = getMonthStart(
        addMonths(loadedStartMonth, 1),
      );

      const fetchOnlyUncoveredPart = (targetStart: Date, targetEnd: Date) => {
        const isBeforeLoaded = targetEnd < loadedStart;
        const isAfterLoaded = targetStart > loadedEnd;

        if (isBeforeLoaded || isAfterLoaded) {
          void fetchRange(targetStart, targetEnd);
          return;
        }

        const leftMissingStart = targetStart;
        const leftMissingEnd = addDays(loadedStart, -1);
        if (leftMissingStart <= leftMissingEnd) {
          void fetchRange(leftMissingStart, leftMissingEnd);
        }

        const rightMissingStart = addDays(loadedEnd, 1);
        const rightMissingEnd = targetEnd;
        if (rightMissingStart <= rightMissingEnd) {
          void fetchRange(rightMissingStart, rightMissingEnd);
        }
      };

      // Preload forward when reaching the last two loaded months.
      if (monthStart >= forwardTriggerMonth) {
        const forwardStart = getMonthStart(addMonths(loadedEndMonth, 1));
        const forwardEnd = getMonthEnd(addMonths(loadedEndMonth, 3));
        if (forwardEnd > loadedEnd) {
          fetchOnlyUncoveredPart(forwardStart, forwardEnd);
        }
        return;
      }

      // Preload backward when reaching the first two loaded months.
      if (monthStart <= backwardTriggerMonth) {
        const backwardStart = getMonthStart(addMonths(loadedStartMonth, -3));
        const backwardEnd = getMonthEnd(addMonths(loadedStartMonth, -1));
        if (backwardStart < loadedStart) {
          fetchOnlyUncoveredPart(backwardStart, backwardEnd);
        }
      }
    },
    [fetchRange, loadedStart, loadedEnd],
  );

  useEffect(() => {
    const now = new Date();
    const currentMonth = getMonthStart(now);
    const initialStart = getMonthStart(addMonths(currentMonth, -2));
    const initialEnd = getMonthEnd(addMonths(currentMonth, 2));
    void fetchRange(initialStart, initialEnd);
  }, [fetchRange]);

  const events: EventInput[] = useMemo(
    () =>
      bookings.map((b) => ({
        id: String(b.id),
        title: b.ownerName,
        start: b.startTime,
        end: b.endTime,
        className: [getStyle(b.status), "hover:cursor-pointer"],
      })),
    [bookings],
  );

  const loadedRange = useMemo<DateRange | null>(() => {
    if (!loadedStart || !loadedEnd) return null;
    return {
      start: toDateOnlyString(loadedStart),
      end: toDateOnlyString(loadedEnd),
    };
  }, [loadedStart, loadedEnd]);

  return {
    events,
    loadedRange,
    isLoading,
    error,
    ensureMonthLoaded,
  };
}
