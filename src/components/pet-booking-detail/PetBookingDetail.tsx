"use client";

import { useState } from "react";
import { ActionProfileHeader } from "../profile/ProfileHeader";
import Link from "next/link";
import { ChevronLeft, Eye } from "lucide-react";
import { ActionButton } from "@/components/ui/Button";
import DetailLabel from "@/components/ui/detail/DetailLabel";
import { useParams, useRouter } from "next/navigation";
import { useBookingDetail } from "@/hooks/booking/useBookingDetail";
import { bookingApi } from "@/services/api/bookingApi";
import ProfileModal from "./ProfileModal";
import PetModal from "./PetProfileModal";
import { BasePetCard } from "../booking/BasePetCard";
import useBookingStatus from "@/hooks/booking/useBookingStatus";
import {
  BookingDetail as BookingDetailType,
  BookingStatus,
} from "@/types/booking";
import { bookingStatusVariant } from "@/constants/bookinglist/bookingStatus";

type Pet = BookingDetailType["pets"][number];

// Map petTypeId to type name (temporary until backend returns petType)
const PET_TYPE_MAP: Record<number, string> = {
  1: "Dog",
  2: "Cat",
  3: "Bird",
  4: "Rabbit",
};

function formatBookingDate(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;

    if (minutes === 0) {
      return `${hour12} ${ampm}`;
    }
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  const dateStr = start.toLocaleDateString("en-GB", dateOptions);
  const startTimeStr = formatTime(start);
  const endTimeStr = formatTime(end);

  return `${dateStr}  |  ${startTimeStr} - ${endTimeStr}`;
}

function BookingDetail() {
  const router = useRouter();
  const params = useParams();
  const bookingId = Number(params.bookingId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfirm, setIsConFirm] = useState(false);
  const [isConfirmModal, setIsConFirmModal] = useState(false);
  const { booking, isLoading, error, refetch } = useBookingDetail(bookingId);
  const statusConfig = useBookingStatus(
    booking?.status as BookingStatus,
    booking?.endTime ?? "",
  );
  const ModalHandling = () => {
    setIsModalOpen(true);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-500 p-4">Error: {error.message}</div>;

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
          <ActionProfileHeader
            title={booking?.contactName ?? "-"}
            status={
              <span
                className={`style-body-2 flex items-center gap-2 ${bookingStatusVariant[booking?.status as BookingStatus]}`}
              >
                <span
                  className={`size-1.5 rounded-full ${bookingStatusVariant[booking?.status as BookingStatus]?.replace("text-", "bg-")}`}
                />
                {booking?.status}
              </span>
            }
            leftAction={
              <Link href="/bookings">
                <ChevronLeft />
              </Link>
            }
            action={
              <div className="flex flex-row gap-[8px]">
                {statusConfig?.showReject && (
                  <ActionButton variant="secondary" onClick={openReject}>
                    Reject Booking
                  </ActionButton>
                )}
                {statusConfig?.buttonLabel && (
                  <ActionButton
                    variant="primary"
                    onClick={openConfirm}
                    className={
                      statusConfig?.isDisabled ? "pointer-events-none" : ""
                    }
                  >
                    {statusConfig.buttonLabel}
                  </ActionButton>
                )}
              </div>
            }
          />
        </div>

        <div className="flex flex-col bg-white gap-[24px] px-[16px] py-[24px] -mx-10 lg:p-[40px] lg:mx-0 rounded-2xl">
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
          {booking?.pets && booking.pets.length > 0 ? (
            <>
              <p className="text-gray-400 style-headline-4">Pet Detail</p>
              <div className="flex gap-[12px] overflow-x-auto">
                {booking.pets.map((pet) => (
                  <div key={pet.petId}>
                    <BasePetCard
                      pet={{
                        id: String(pet.petId),
                        name: pet.petName,
                        type:
                          PET_TYPE_MAP[(pet as any).petTypeId] ??
                          pet.petType ??
                          "Unknown",
                        imgUrl: pet.imgUrl,
                      }}
                      variant="action"
                      className="cursor-pointer"
                      onClick={() => setSelectedPet(pet)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <DetailLabel label="Pet Detail" value="-" />
          )}
          <DetailLabel label="Duration" value={booking?.duration ?? "-"} />
          <DetailLabel
            label="Booking Date"
            value={
              booking?.startTime && booking?.endTime
                ? formatBookingDate(booking.startTime, booking.endTime)
                : "-"
            }
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
      {selectedPet && (
        <PetModal pet={selectedPet} onClose={() => setSelectedPet(null)} />
      )}

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
