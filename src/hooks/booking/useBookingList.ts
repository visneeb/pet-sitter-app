import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SitterBookingList } from "@/types/BookingType";
import { bookingApi } from "@/services/api/bookingApi";

type statusFilterType =
  | "all"
  | "waiting_confirm"
  | "waiting_service"
  | "in_service"
  | "success"
  | "canceled";

const DEFAULT_LIMIT = 8;

export function useBookingList() {
  const router = useRouter();
  // Search state
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<statusFilterType>("all");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);
  const [bookingsPerPage, setBookingsPerPage] = useState<number>(DEFAULT_LIMIT);
  // Data state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookings, setBookings] = useState<SitterBookingList[]>([]);

  // Effect
  // Debounce search keyword
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [searchKeyword]);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (debouncedKeyword) params.set("keyword", debouncedKeyword);
        if (statusFilter) params.set("status", statusFilter);
        // Limit
        if (bookingsPerPage <= 0) setBookingsPerPage(8);
        else if (bookingsPerPage > 100) setBookingsPerPage(100);

        params.set("page", String(currentPage));
        params.set("limit", String(bookingsPerPage));
        const queryString = params.toString();
        router.replace(`/bookings?${queryString}`, { scroll: false });

        const response = await bookingApi.getAll(params);
        setBookings(response.bookings ?? []);
        setTotalPages(response.totalPages ?? 1);
        setTotalBookings(response.totalBookings ?? 0);
      } catch (error) {
        setError(`Failed to fetch bookings : ${error}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [statusFilter, debouncedKeyword, currentPage, bookingsPerPage, router]);

  // Handler
  const handleKeywordChange = (value: string) => {
    setSearchKeyword(value);
  };
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as statusFilterType);
    setCurrentPage(1);
  };

  return {
    bookings,
    totalPages,
    totalBookings,
    currentPage,
    bookingsPerPage,
    isLoading,
    error,
    searchKeyword,
    statusFilter,
    setBookingsPerPage,
    setCurrentPage,
    handleKeywordChange,
    handleStatusChange,
  };
}
