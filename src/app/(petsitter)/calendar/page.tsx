"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useScreenContext } from "@/contexts/ScreenContext";
import { useBookingDateRangeHistory } from "@/hooks/booking-history/useBookingDateRangeHistory";
import { useRouter } from "next/navigation";

export default function PetSitterCalendar() {
  const { isMedium } = useScreenContext();
  const { events, ensureMonthLoaded } = useBookingDateRangeHistory();
  const router = useRouter();

  return (
    <section className="flex flex-col gap-6 px-4 lg:p-0">
      <header>
        <h3 className="style-headline-3">Calendar</h3>
      </header>
      <ul className="flex flex-col gap-4 sm:flex-row">
        <li className="flex gap-3">
          <div className="size-6 bg-pink-100 border-2 border-pink-500" />
          <span className="style-body-3 text-gray-600">
            Waiting for Confirm
          </span>
        </li>
        <li className="flex gap-3">
          <div className="size-6 bg-orange-100 border-2 border-orange-500" />
          <span className="style-body-3 text-gray-600">Booked</span>
        </li>
        <li className="flex gap-3">
          <div className="size-6 bg-green-100 border-2 border-green-500" />
          <span className="style-body-3 text-gray-600">Success</span>
        </li>
      </ul>
      <article className="bg-white rounded-lg shadow-sm p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          allDaySlot={false}
          slotDuration="01:00:00"
          dayHeaderFormat={{
            weekday: "short",
            day: "numeric",
          }}
          buttonText={{
            today: "Today",
            month: "Month",
            week: "Week",
            day: "Day",
          }}
          dayHeaderContent={(arg) => {
            if (arg.view.type === "dayGridMonth") {
              return arg.text.split(" ")[1];
            }

            return arg.text;
          }}
          slotLabelFormat={{
            hour: "numeric",
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: `dayGridMonth${isMedium ? ",timeGridWeek" : ""}`,
          }}
          events={events}
          eventClick={(info) => {
            const bookingId = info.event.id;
            router.push(`/bookings/${bookingId}`);
          }}
          datesSet={(arg) => {
            ensureMonthLoaded(arg.view.currentStart);
          }}
          height="auto"
        />
      </article>
    </section>
  );
}
