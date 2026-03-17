"use client";

import { Pagination } from "@/components/ui/Pagination";
import BookingListTile from "./BookingListTile";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/input/Select";
import { Input } from "@/components/ui/input/Input";
import { useBookingList } from "@/hooks/booking/useBookingList";
import { useRouter } from "next/navigation";

const STATUS_OPTIONS = [
  { value: "all", label: "All status" },
  { value: "waiting_confirm", label: "Waiting for confirm" },
  { value: "waiting_service", label: "Waiting for service" },
  { value: "in_service", label: "In service" },
  { value: "success", label: "Success" },
  { value: "canceled", label: "Canceled" },
];
export function BookingList() {
  const router = useRouter();
  const {
    bookings,
    totalPages,
    totalBookings,
    currentPage,
    bookingsPerPage,
    searchKeyword,
    statusFilter,
    setBookingsPerPage,
    setCurrentPage,
    handleKeywordChange,
    handleStatusChange,
  } = useBookingList();
  return (
    <>
      <div className="pb-[40px]">
        <header className="flex flex-row justify-between items-center mb-6">
          <h1 className="style-heading-3 text-gray-900">Booking List</h1>
          <div className="flex items-between gap-6">
            <Input
              value={searchKeyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              rightAction={<Search className="text-gray-300" />}
              placeholder="Search..."
              className="w-60 h-[48px]"
            />
            <Select
              className="w-60 h-[48px] style-body-2 text-gray-400 font-normal"
              placeholder="All status"
              value={statusFilter}
              onChange={(value) => handleStatusChange(value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </header>

        <article className="min-w-full">
          <header className="flex py-3 bg-black rounded-t-2xl">
            <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(240/1120*100%)]">
              Pet Owner Name
            </p>
            <p className="flex-1 px-4 style-body-3 text-white md:w-[calc(120/1120*100%)]">
              Pet(s)
            </p>
            <p className="hidden w-[calc(120/1120*100%)]  px-4 style-body-3 text-white md:block">
              Duration
            </p>
            <p className="hidden w-[calc(420/1120*100%)] px-4 style-body-3 text-white xl:block">
              Booked Date
            </p>
            <p className="w-[calc(220/1120*100%)] min-w-25 px-4 style-body-3 text-white">
              Status
            </p>
          </header>
          <ul>
            {bookings.map((booking, index, array) => (
              <BookingListTile
                key={booking.bookingId.toString()}
                booking={booking}
                isLast={index + 1 === array.length}
                onClick={() => router.push(`/bookings/${booking.bookingId}`)}
              />
            ))}
          </ul>
        </article>
      </div>

      <Pagination
        className="pb-[40px]"
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
