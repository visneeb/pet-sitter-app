"use client";

import { useState, useRef } from "react";
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
import { BaseModal } from "../review/BaseModal";
import useBookingStatus from "@/hooks/booking/useBookingStatus";
import {
  BookingDetail as BookingDetailType,
  BookingStatus,
} from "@/types/booking";
import { bookingStatusVariant } from "@/constants/bookinglist/bookingStatus";

type Pet = BookingDetailType["pets"][number];

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
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isConfirm, setIsConFirm] = useState(false);
  const [isConfirmModal, setIsConFirmModal] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const petListRef = useRef<HTMLDivElement>(null);
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
      const status = booking?.status;
      if (status === "Waiting for confirm") {
        await bookingApi.confirmBooking(bookingId);
      } else if (status === "Waiting for service") {
        await bookingApi.startService(bookingId);
      } else if (status === "In service") {
        await bookingApi.markAsSuccess(bookingId);
      }
      await refetch();
      setIsConFirmModal(false);
    } catch (error) {
      console.error("Failed to update booking status", error);
      alert("Failed to update booking. Please try again.");
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

  {
    /* handle mouse dragging @Pet Detail */
  }
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!petListRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - petListRef.current.offsetLeft);
    setScrollLeft(petListRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !petListRef.current) return;
    e.preventDefault();
    const x = e.pageX - petListRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    petListRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handlePetClick = (pet: Pet) => {
    if (hasDragged) return;
    setSelectedPet(pet);
    setIsPetModalOpen(true);
  };
  {
    /* handle mouse dragging @Pet Detail */
  }
  return (
    <>
      <div className="flex flex-col gap-[24px] pb-[100px] md:pb-[80px]">
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
              <div className="hidden md:flex flex-row gap-[8px]">
                {statusConfig?.showReject && (
                  <ActionButton variant="secondary" onClick={openReject}>
                    Reject Booking
                  </ActionButton>
                )}
                {statusConfig?.buttonLabel && (
                  <ActionButton
                    variant={
                      statusConfig?.isDisabled &&
                      statusConfig?.buttonLabel === "Success"
                        ? "secondary"
                        : "primary"
                    }
                    onClick={openConfirm}
                    className={
                      statusConfig?.isDisabled &&
                      statusConfig?.buttonLabel === "Success"
                        ? "pointer-events-none"
                        : ""
                    }
                  >
                    {statusConfig.buttonLabel}
                  </ActionButton>
                )}
              </div>
            }
          />
          {/* Hide Button on mobile size ^^^^^^^^ */}
        </div>

        <div className="flex flex-col bg-white gap-[24px] px-[16px] py-[24px] md:px-[80px] md:py-[40px]  rounded-2xl">
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
              <p className="text-gray-300 style-headline-4">Pet Detail</p>
              <div
                ref={petListRef}
                className={`flex gap-[12px] overflow-x-auto scrollbar-hide ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {booking.pets.map((pet) => (
                  <div key={pet.petId}>
                    <BasePetCard
                      pet={{
                        id: String(pet.petId),
                        name: pet.petName,
                        type: pet.petType ?? "Unknown",
                        imgUrl: pet.imgUrl,
                      }}
                      variant="action"
                      className="cursor-pointer"
                      onClick={() => handlePetClick(pet)}
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

      {/* Mobile Action Bar */}
      {(statusConfig?.showReject || statusConfig?.buttonLabel) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 md:hidden z-40">
          {statusConfig?.showReject && (
            <ActionButton
              variant="secondary"
              onClick={openReject}
              className="flex-1"
            >
              Reject Booking
            </ActionButton>
          )}
          {statusConfig?.buttonLabel && (
            <ActionButton
              variant={
                statusConfig?.isDisabled &&
                statusConfig?.buttonLabel === "Success"
                  ? "secondary"
                  : "primary"
              }
              onClick={openConfirm}
              className={`flex-1 ${
                statusConfig?.isDisabled &&
                statusConfig?.buttonLabel === "Success"
                  ? "pointer-events-none"
                  : ""
              }`}
            >
              {statusConfig.buttonLabel}
            </ActionButton>
          )}
        </div>
      )}
      {/* Mobile Action Bar */}

      <ProfileModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {selectedPet && (
        <PetModal
          pet={selectedPet}
          open={isPetModalOpen}
          onClose={() => {
            setIsPetModalOpen(false);
            setTimeout(() => setSelectedPet(null), 300); // รอ animation จบก่อน clear pet
          }}
        />
      )}

      <BaseModal
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        className="!h-auto w-[400px]"
      >
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
      </BaseModal>

      <BaseModal
        open={isConfirmModal}
        onClose={() => setIsConFirmModal(false)}
        className="!h-auto w-[400px]"
      >
        <div className="border-b border-gray-200 px-[24px] py-[16px]">
          <h4 className="style-headline-4">
            {booking?.status === "Waiting for confirm" && "Confirm Booking"}
            {booking?.status === "Waiting for service" && "Start Service"}
            {booking?.status === "In service" && "Complete Booking"}
          </h4>
        </div>
        <div className="p-[24px] gap-[24px]">
          <p className="style-body-2 text-gray-400 mb-[24px]">
            {booking?.status === "Waiting for confirm" &&
              "Are you sure to confirm this booking?"}
            {booking?.status === "Waiting for service" &&
              "Are you sure to start this service?"}
            {booking?.status === "In service" &&
              "Are you sure to mark this booking as complete?"}
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
              {isConfirm
                ? "Processing..."
                : (statusConfig?.buttonLabel ?? "Confirm")}
            </ActionButton>
          </div>
        </div>
      </BaseModal>
    </>
  );
}

export default BookingDetail;
