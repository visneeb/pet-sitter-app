"use client";

import { useState } from "react";
import { useScreenContext } from "@/contexts/ScreenContext";
import { UserProfileHeader } from "@/components/profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import { ActionButton } from "@/components/ui/Button";
import DetailLabel from "@/components/ui/detail/DetailLabel";
import { useParams, useRouter } from "next/navigation";
import { useBookingDetail } from "@/hooks/booking/useBookingDetail";
import { bookingApi } from "@/services/api/bookingApi";
import ProfileModal from "./ProfileModal";
import { PetCard } from "./PetCard";

function BookingDetail() {
  const router = useRouter();
  const { isLarge } = useScreenContext();
  const params = useParams();
  const bookingId = Number(params.bookingId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfirm, setIsConFirm] = useState(false);
  const [isConfirmModal, setIsConFirmModal] = useState(false);
  const { booking, isLoading, error, refetch } = useBookingDetail(bookingId);
  const ModalHandling = () => {
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error.message}</div>;

  const handleRejectBooking = async () => {
    if (isRejecting) return;
    setIsRejecting(true);
    try {
      await bookingApi.rejectBooking(bookingId);
      await refetch();
      setIsRejectModalOpen(false);
      router.push("/bookings");
    } catch (error) {
      console.error("Failed to reject booking:", error);
      alert("Failed to reject booking. Please try again.");
    } finally {
      setIsRejecting(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (isConfirm) return;
    setIsConFirm(true);
    try {
      await bookingApi.confirmBooking(bookingId);
      await refetch();
      setIsConFirmModal(false);
      router.push("/bookings");
    } catch (error) {
      console.error("Failed to confirm booking", error);
      alert("Failed to confirm booking. Please try again.");
    } finally {
      setIsConFirm(false);
    }
  };

  const openReject = () => {
    setIsRejectModalOpen(true);
  };

  const openConfirm = () => {
    setIsConFirmModal(true);
  };
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
              booking?.status === "waiting_for_confirm" && (
                <div className="flex flex-row gap-[8px]">
                  <ActionButton variant="secondary" onClick={openReject}>
                    Reject Booking
                  </ActionButton>
                  <ActionButton variant="primary" onClick={openConfirm}>
                    Confirm Booking
                  </ActionButton>
                </div>
              )
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
          <p className="text-gray-400 style-headline-4">Pet Detail</p>
          <div className="flex gap-[12px]">
            {booking?.pets?.map((pet) => (
              <PetCard
                key={pet.petId}
                pet={pet}
                selected={false}
                disabled={false}
                onSelect={() => {}}
              />
            ))}
          </div>
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

      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-[400px] w-full">
            <div className="border-b border-gray-200 px-[24px] py-[16px]">
              <h4 className="style-headline-4">Reject Confirmation</h4>
            </div>
            <div className="p-[24px]">
              <p className="style-body-2 text-gray-400 mb-[24px]">
                Are you sure to reject this booking?
              </p>
              <div className="flex gap-[12px] justify-between">
                <ActionButton
                  variant="secondary"
                  onClick={() => setIsRejectModalOpen(false)}
                  disabled={isRejecting}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={handleRejectBooking}
                  disabled={isRejecting}
                >
                  {isRejecting ? "Rejecting..." : "Reject Booking"}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {isConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl max-w-[400px] w-full">
            <div className="border-b border-gray-200 px-[24px] py-[16px]">
              <h4 className="style-headline-4">Confirm Booking</h4>
            </div>
            <div className="p-[24px] gap-[24px]">
              <p className="style-body-2 text-gray-400 mb-[24px]">
                Are you sure to confirm this booking?
              </p>
              <div className="flex justify-between">
                <ActionButton
                  variant="secondary"
                  onClick={() => setIsConFirmModal(false)}
                  disabled={isConfirm}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  onClick={handleConfirmBooking}
                  disabled={isConfirm}
                >
                  {isConfirm ? "Confirming..." : "Confirm Booking"}
                </ActionButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BookingDetail;
