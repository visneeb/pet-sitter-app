import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import { BookingList } from "@/components/booking-history/BookingList";

export function BookingHistory() {
  return (
    <div className="flex flex-col gap-15 pb-8">
      <UserProfileHeader title="Booking History" />
        <BookingList />
    </div>
  );
}
