"use client";

import React from "react";

import { ProgressBar } from "@/components/booking/progressbar";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { CreatePetModal } from "@/components/booking/CreatePetModal";
import { useBooking } from "@/contexts/BookingContext";
import { petApi } from "@/services/api/petApi";
import { Pet } from "@/contexts/booking/bookingTypes";
import { userApi } from "@/services/api";
import { BookingPetStep } from "@/components/booking/BookingPetStep";
import { BookingInformationStep } from "@/components/booking/BookingInformationStep";
import { BookingPaymentStep } from "@/components/booking/BookingPaymentStep";
import Modal from "@/components/ui/Modal";
import { bookingApi } from "@/services/api/bookingApi";
import { calcBookingTotal } from "@/domain/booking/pricing";

const PAGE_SIZE = 6;
const CONFIRM_MODAL_ID = "confirm-booking-modal";

export default function BookingPage() {
  const [loadingProfile, setLoadingProfile] = React.useState(true);
  const [profileError, setProfileError] = React.useState("");
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);
  const [latestBooking, setLatestBooking] = React.useState<any | null>(null);
  const { state, setPets, togglePet, updateInfo, setIsBooked } = useBooking();

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = React.useState<
    "credit_card" | "cash"
  >("credit_card");
  const [cardName, setCardName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [submittingPayment, setSubmittingPayment] = React.useState(false);

  const [openCreate, setOpenCreate] = React.useState(false);

  const [pets, setPetsList] = React.useState<Pet[]>([]);

  const [loadingPets, setLoadingPets] = React.useState(true);
  const [petsError, setPetsError] = React.useState("");

  const [page, setPage] = React.useState(1);

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

  const fetchPets = React.useCallback(async () => {
    try {
      setLoadingPets(true);
      setPetsError("");

      const data = await petApi.getMyPets();

      const mappedPets: Pet[] = data.map((pet) => ({
        id: String(pet.id),
        name: pet.petName,
        type: pet.petType,
        imgUrl: pet.imgUrl ?? "",
      }));

      setPetsList(mappedPets);
      return mappedPets;
    } catch (error) {
      console.error("fetch pets error:", error);
      setPetsError("Unable to load pets.");
      return [];
    } finally {
      setLoadingPets(false);
    }
  }, []);

  const fetchProfile = React.useCallback(async () => {
    try {
      setLoadingProfile(true);
      setProfileError("");

      const user = await userApi.getCurrentUser();

      if (!state.info.name && !state.info.email && !state.info.phone) {
        updateInfo({
          name: user.name ?? "",
          email: user.email ?? "",
          phone: user.phone ?? "",
        });
      }
    } catch (error) {
      console.error("fetch profile error:", error);
      setProfileError("Unable to load profile.");
    } finally {
      setLoadingProfile(false);
    }
  }, [updateInfo]);

  React.useEffect(() => {
    fetchPets();
  }, [fetchPets]);
  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  React.useEffect(() => {
    if (isConfirmOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isConfirmOpen]);

  const handleTogglePet = (petId: string) => {
    togglePet(petId);
  };

  const totalItems = pets.length + 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const pagedPets = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE;
    return pets.slice(start, Math.min(end, pets.length));
  }, [page, pets]);

  const showCreateNewPet = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE;

    const createCardIndex = pets.length;
    return createCardIndex >= start && createCardIndex < end;
  }, [page, pets.length]);

  React.useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const selectedPetIds = state.selectedPetIds;

  const selectedPetNames = pets
    .filter((p) => selectedPetIds.includes(p.id))
    .map((p) => p.name);

  const sitterName = state.selectedSitterName ?? "Happy House!";

  const startDateTime = state.info.startDateTime
    ? new Date(state.info.startDateTime)
    : null;

  const endDateTime = state.info.endDateTime
    ? new Date(state.info.endDateTime)
    : null;

  const hours = state.info.durationHours ?? 0;
  const dateLabel = startDateTime
    ? startDateTime.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "-";

  const timeLabel =
    startDateTime && endDateTime
      ? `${startDateTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })} - ${endDateTime.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        })}`
      : "-";

  const canGoStep2 = selectedPetIds.length > 0;
  const canFinishStep2 = Boolean(
    state.info.name?.trim() &&
    state.info.email?.trim() &&
    state.info.phone?.trim(),
  );
  const startTime = state.info.startDateTime;
  const endTime = state.info.endDateTime;

  const handleNextFromPets = () => {
    if (!canGoStep2) return;
    setPets(selectedPetIds);
    setStep(2);
  };

  const handleBackFromPets = () => {
    window.history.back();
  };

  const handleBackToPets = () => {
    setStep(1);
  };

  const handleNextFromInformation = () => {
    if (!canFinishStep2) return;
    setStep(3);
  };

  const handleBackToInformation = () => {
    setStep(2);
  };

  const handleSubmitPayment = async () => {
    try {
      setSubmittingPayment(true);

      const totalPrice = calcBookingTotal(hours, selectedPetIds.length);

      if (!startTime || !endTime) {
        throw new Error("Missing booking time.");
      }

      const payload = {
        pet_sitter_id: Number(state.selectedSitterId),
        contact_name: state.info.name,
        contact_email: state.info.email,
        contact_phone: state.info.phone,
        note: state.info.message,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        total_price: totalPrice,
        pet_ids: selectedPetIds.map(Number),
      };

      const response = await bookingApi.create(payload);

      setIsConfirmOpen(false);
      setLatestBooking(response);
      setIsSuccessOpen(true);
      setIsBooked(true);
    } catch (error) {
      console.error("submit booking error:", error);
      alert("Booking failed");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handlePetCreated = async () => {
    const latestPets = await fetchPets();
    const newTotalItems = latestPets.length + 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotalItems / PAGE_SIZE));

    setPage(newTotalPages);
    setOpenCreate(false);
  };

  const handleOpenConfirmModal = () => {
    const dialog = document.getElementById(
      CONFIRM_MODAL_ID,
    ) as HTMLDialogElement | null;

    if (!dialog) return;

    setIsConfirmOpen(true);
    dialog.showModal();
  };

  return (
    <div className="w-full flex flex-row">
      <div className=" w-full px-10 flex flex-row gap-6 py-6 justify-center">
        <div className="w-2/3 max-w-[848px] flex flex-col gap-2">
          <ProgressBar currentStep={step} />
          <div className="bg-black px-6 py-6 rounded-2xl">
            {step === 1 ? (
              <BookingPetStep
                pets={pagedPets}
                sitter={{
                  id: state.selectedSitterId ?? "",
                  name: state.selectedSitterName ?? "-",
                  acceptedTypes: state.selectedSitterAcceptedTypes ?? [],
                }}
                selectedPetIds={state.selectedPetIds}
                loadingPets={loadingPets}
                petsError={petsError}
                totalPages={totalPages}
                currentPage={page}
                canNext={canGoStep2}
                onTogglePet={handleTogglePet}
                onCreateNewPet={() => setOpenCreate(true)}
                onRetry={async () => {
                  await fetchPets();
                }}
                onBack={handleBackFromPets}
                onNext={handleNextFromPets}
                onPageChange={setPage}
                showCreateNewPet={showCreateNewPet}
                isLastPage={page === totalPages}
              />
            ) : step === 2 ? (
              <BookingInformationStep
                name={state.info.name ?? ""}
                email={state.info.email ?? ""}
                phone={state.info.phone ?? ""}
                message={state.info.message ?? ""}
                onChangeName={(v) => updateInfo({ name: v })}
                onChangeEmail={(v) => updateInfo({ email: v })}
                onChangePhone={(v) => updateInfo({ phone: v })}
                onChangeMessage={(v) => updateInfo({ message: v })}
                canNext={canFinishStep2}
                onBack={handleBackToPets}
                onNext={handleNextFromInformation}
              />
            ) : (
              <BookingPaymentStep
                paymentMethod={paymentMethod}
                cardName={cardName}
                cardNumber={cardNumber}
                expiryDate={expiryDate}
                cvv={cvv}
                loading={submittingPayment}
                isConfirmOpen={isConfirmOpen}
                onChangePaymentMethod={setPaymentMethod}
                onChangeCardName={setCardName}
                onChangeCardNumber={setCardNumber}
                onChangeExpiryDate={setExpiryDate}
                onChangeCvv={setCvv}
                onBack={handleBackToInformation}
                onOpenConfirmModal={handleOpenConfirmModal}
              />
            )}
          </div>
        </div>

        <div className="w-[320px] sticky top-6 self-start">
          <BookingSummary
            sitterName={sitterName}
            dateLabel={dateLabel}
            timeLabel={timeLabel}
            hours={hours}
            petNames={selectedPetNames}
          />
        </div>
        {/* {isSuccessOpen && latestBooking && (
          <BookingDetailModal
            booking={latestBooking}
            onClose={() => setIsSuccessOpen(false)}
          />
        )} */}
      </div>

      <CreatePetModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onCreated={handlePetCreated}
      />
      <Modal
        id={CONFIRM_MODAL_ID}
        title="Confirm booking"
        massage="Are you sure you want to confirm this booking?"
        confirmText="Confirm"
        cancelText="Cancel"
        disabled={submittingPayment}
        onOpenChange={setIsConfirmOpen}
        onCancel={async () => {
          setIsConfirmOpen(false);
        }}
        onConfirm={handleSubmitPayment}
      />
    </div>
  );
}
