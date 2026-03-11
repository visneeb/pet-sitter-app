"use client";

import { useState } from "react";
import { useScreenContext } from "@/contexts/ScreenContext";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import { ActionButton } from "@/components/ui/Button";
import DetailLabel from "@/components/ui/detail/DetailLabel";
import { useParams } from "next/navigation";
import { useBookingDetail } from "@/hooks/booking/useBookingDetail";
import ProfileModal from "./ProfileModal";

function BookingDetail() {
  const { isLarge } = useScreenContext();
  const params = useParams();
  const bookingId = Number(params.bookingId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { booking, isLoading } = useBookingDetail(bookingId);
  const ModalHandling = () => {
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <div className="flex flex-col gap-[24px] px-[40px] pt-[40px] pb-[80px]">
        <div>
          <UserProfileHeader
            title={booking?.contactName ?? "-"}
            leftAction={
              <Link href="/bookings">
                <ChevronLeft />
              </Link>
            }
            action={
              <div className="flex flex-row gap-[8px]">
                <ActionButton variant="secondary">Reject Booking</ActionButton>
                <ActionButton variant="primary">Confirm Booking</ActionButton>
              </div>
            }
          />
        </div>

        <div
          className={`flex flex-col bg-white ${isLarge ? "gap-[24px] p-[40px]" : "gap-[24px] px-[16px] py-[24px] -mx-10"}  rounded-2xl`}
        >
          <div className="flex justify-between">
            <DetailLabel
              label="Pet Owner Name"
              value={booking?.contactName ?? "-"}
            />
            <div
              className="flex items-center gap-[4px] text-orange-500 cursor-pointer"
              onClick={ModalHandling}
            >
              <Eye />
              <span className="">View Profile</span>
            </div>
          </div>

          <DetailLabel label="Pet(s)" value={booking?.pets?.length ?? "-"} />
          <DetailLabel
            label="Pet Detail"
            value={booking?.pets?.length ?? "-"}
          />
          <DetailLabel
            label="Duration"
            value={booking ? `${booking.startTime} - ${booking.endTime}` : "-"}
          />
          <DetailLabel
            label="Total Paid"
            value={booking?.totalPrice ? `${booking.totalPrice} THB` : "-"}
          />
          <DetailLabel label="Status" value={booking?.status ?? "-"} />

          <DetailLabel
            label="Additional Message"
            value={booking?.note ?? "-"}
          />
        </div>
      </div>
      {isModalOpen && <ProfileModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
}

export default BookingDetail;
