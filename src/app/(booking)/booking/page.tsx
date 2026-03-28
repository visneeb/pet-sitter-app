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
import { BookingDetail } from "@/components/booking-detail/BookingDetail";
import type { OwnerBookingHistory } from "@/types/BookingType";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";
import { paymentApi } from "@/services/api/paymentApi";
import { ActionButton, NavigationButton } from "@/components/ui/Button";

const PAGE_SIZE = 6;
const CONFIRM_MODAL_ID = "confirm-booking-modal";

function parseOptionalTransactionId(
  transactionId?: string | number,
  transactionNo?: string | number,
): number | null {
  const raw = transactionId ?? transactionNo;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).trim());
  return Number.isFinite(n) ? n : null;
}

type CreatedBookingResponse = {
  bookingId?: number | string;
  id?: number | string;
  transactionId?: string | number;
  transactionNo?: string | number;
  status?: OwnerBookingHistory["status"];
  createdAt?: string;
  tradeName?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
};

function toOwnerBookingHistory(params: {
  created: CreatedBookingResponse;
  selectedSitterId?: string;
  selectedSitterName?: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  pets: Pet[];
  selectedPetIds: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  note: string | null;
}): OwnerBookingHistory {
  const {
    created,
    selectedSitterId,
    selectedSitterName,
    startTime,
    endTime,
    totalPrice,
    pets,
    selectedPetIds,
    contactName,
    contactEmail,
    contactPhone,
    note,
  } = params;

  const selectedPets = pets.filter((pet) => selectedPetIds.includes(pet.id));
  const bookingId = Number(created.bookingId ?? created.id ?? 0);

  return {
    bookingId,
    transactionId: parseOptionalTransactionId(
      created.transactionId,
      created.transactionNo,
    ),
    status: created.status ?? "Waiting for confirm",
    createdAt: created.createdAt ?? new Date().toISOString(),

    contactName,
    contactEmail,
    contactPhone,
    note,
    completedAt: null,

    petSitterId: Number(selectedSitterId ?? 0),
    tradeName: created.tradeName ?? selectedSitterName ?? null,
    sitterName: selectedSitterName ?? null,
    sitterImgUrl: undefined,
    sitterPhone: null,
    latitude:
      created.latitude != null ? String(created.latitude) : null,
    longitude:
      created.longitude != null ? String(created.longitude) : null,

    startTime,
    endTime,
    totalPrice: String(totalPrice),

    pets: selectedPets.map((pet, index) => ({
      bookingPetId: index + 1,
      bookingId,
      petId: Number(pet.id),
      petTypeId: 0,
      petName: pet.name,
      sex: "Unknown" as const,
      breed: "",
      dateOfBirth: "",
      color: "",
      weight: "",
      about: null,
    })),

    review: null,
    paidAt: null,
  };
}

export default function BookingPage(): React.JSX.Element {
  const [loadingProfile, setLoadingProfile] = React.useState<boolean>(true);
  const [profileError, setProfileError] = React.useState<string>("");
  const [isSuccessOpen, setIsSuccessOpen] = React.useState<boolean>(false);
  const [latestBooking, setLatestBooking] =
    React.useState<OwnerBookingHistory | null>(null);

  const { state, setPets, togglePet, updateInfo, setIsBooked } = useBooking();

  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = React.useState<
    "credit_card" | "cash"
  >("credit_card");
  const [cardName, setCardName] = React.useState("");
  const [submittingPayment, setSubmittingPayment] = React.useState(false);

  const [openCreate, setOpenCreate] = React.useState<boolean>(false);
  const [pets, setPetsList] = React.useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = React.useState<boolean>(true);
  const [petsError, setPetsError] = React.useState<string>("");
  const [page, setPage] = React.useState<number>(1);
  const [isConfirmOpen, setIsConfirmOpen] = React.useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();

  const fetchPets = React.useCallback(async (): Promise<Pet[]> => {
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

  const fetchProfile = React.useCallback(async (): Promise<void> => {
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
  }, [state.info.name, state.info.email, state.info.phone, updateInfo]);

  React.useEffect(() => {
    void fetchPets();
  }, [fetchPets]);

  React.useEffect(() => {
    void fetchProfile();
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

  React.useEffect(() => {
    if (isSuccessOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccessOpen]);

  const handleTogglePet = (petId: string): void => {
    togglePet(petId);
  };

  const totalItems = pets.length + 1;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

  const pagedPets = React.useMemo<Pet[]>(() => {
    const start = (page - 1) * PAGE_SIZE;
    return pets.slice(start, Math.min(start + PAGE_SIZE, pets.length));
  }, [page, pets]);

  const showCreateNewPet = React.useMemo<boolean>(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = page * PAGE_SIZE;
    const createCardIndex = pets.length;
    return createCardIndex >= start && createCardIndex < end;
  }, [page, pets.length]);

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const selectedPetIds = state.selectedPetIds;

  const selectedPetNames = pets
    .filter((p) => selectedPetIds.includes(p.id))
    .map((p) => p.name);

  const sitterName = state.selectedSitterName ?? "";

  const startDateTime: Date | null = state.info.startDateTime
    ? new Date(state.info.startDateTime)
    : null;

  const endDateTime: Date | null = state.info.endDateTime
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
      state.info.phone?.trim()
  );

  const startTime = state.info.startDateTime;
  const endTime = state.info.endDateTime;

  const handleNextFromPets = (): void => {
    if (!canGoStep2) return;
    setPets(selectedPetIds);
    setStep(2);
  };

  const handleBackFromPets = (): void => {
    window.history.back();
  };

  const handleBackToPets = (): void => {
    setStep(1);
  };

  const handleNextFromInformation = (): void => {
    if (!canFinishStep2) return;
    setStep(3);
  };

  const handleBackToInformation = (): void => {
    setStep(2);
  };

  const handleSubmitPayment = async (): Promise<void> => {
    try {
      setSubmittingPayment(true);

      const totalPrice = calcBookingTotal(hours, selectedPetIds.length);

      if (!startTime || !endTime) {
        throw new Error("Missing booking time.");
      }

      const startIso = new Date(startTime).toISOString();
      const endIso = new Date(endTime).toISOString();

      const payload = {
        pet_sitter_id: Number(state.selectedSitterId),
        contact_name: state.info.name ?? "",
        contact_email: state.info.email ?? "",
        contact_phone: state.info.phone ?? "",
        note: state.info.message ?? "",
        start_time: startIso,
        end_time: endIso,
        total_price: totalPrice,
        pet_ids: selectedPetIds.map(Number),
      };

      const created: CreatedBookingResponse = await bookingApi.create(payload);
      const createdId = Number(created.bookingId ?? created.id);

      if (!createdId) {
        throw new Error("Booking created, but booking id is missing.");
      }

      let createdBooking: OwnerBookingHistory | null = null;

      try {
        const history: OwnerBookingHistory[] =
          await bookingApi.getOwnerBookingHistory();

        createdBooking =
          history.find((item) => item.bookingId === createdId) ?? null;
      } catch (historyError) {
        console.error("get owner booking history error:", historyError);
      }

      const fallbackBooking = toOwnerBookingHistory({
        created,
        selectedSitterId: state.selectedSitterId,
        selectedSitterName: state.selectedSitterName,
        startTime: startIso,
        endTime: endIso,
        totalPrice,
        pets,
        selectedPetIds,
        contactName: state.info.name ?? "",
        contactEmail: state.info.email ?? "",
        contactPhone: state.info.phone ?? "",
        note: state.info.message?.trim() ? state.info.message : null,
      });

      const bookingForDetail = createdBooking ?? fallbackBooking;

      setLatestBooking(bookingForDetail);

      const bookingId = createdId;

      if (paymentMethod === "cash") {
        await paymentApi.createCashTransaction(bookingId);
        setIsConfirmOpen(false);
        setLatestBooking(bookingForDetail);
        setIsSuccessOpen(true);
        setIsBooked(true);
        return;
      }

      if (!stripe || !elements) {
        throw new Error("Stripe not loaded");
      }

      const { clientSecret } = await paymentApi.createCardIntent(
        bookingId,
        totalPrice
      );

      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardNumberElement)!,
            billing_details: { name: cardName },
          },
        }
      );

      if (confirmError) {
        alert(confirmError.message);
        return;
      }

      setIsConfirmOpen(false);
      setLatestBooking(bookingForDetail);
      setIsSuccessOpen(true);
      setIsBooked(true);
    } catch (error) {
      console.error("submit booking error:", error);
      alert("Booking failed");
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handlePetCreated = async (): Promise<void> => {
    const latestPets = await fetchPets();
    const newTotalItems = latestPets.length + 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotalItems / PAGE_SIZE));

    setPage(newTotalPages);
    setOpenCreate(false);
  };

  const handleOpenConfirmModal = (): void => {
    const dialog = document.getElementById(
      CONFIRM_MODAL_ID
    ) as HTMLDialogElement | null;

    if (!dialog) return;

    setIsConfirmOpen(true);
    dialog.showModal();
  };

  return (
    <div className="w-full min-w-0">
      <div className="w-full min-w-0 flex flex-col lg:flex-row gap-6 lg:py-6 py-0 justify-center items-stretch lg:items-center">
        <div className="w-full min-w-0 max-w-none shrink-0 lg:max-w-212 flex flex-col lg:gap-2 items-stretch lg:items-center">
          {!isSuccessOpen && (
            <div className="flex justify-center w-full">
              <ProgressBar currentStep={step} />
            </div>
          )}

          <div
            className={
              isSuccessOpen
                ? ""
                : "bg-red px-10 py-10 lg:rounded-2xl h-[1302px] lg:max-h-[720px] w-full justify-center"
            }
          >
            {isSuccessOpen && latestBooking ? (
            <div className="w-full min-w-0">
              <div
              className="w-full min-w-0 bg-white lg:rounded-2xl lg:w-158 lg:mx-auto">
                <div className="bg-black lg:rounded-t-2xl text-white text-center flex flex-col gap-2 py-6">
                  <h2 className="lg:style-headline-2 style-headline-3">Thank You For Your Booking</h2>
                  <span className="lg:style-body-2 style-body-3 text-gray-300">We will send your booking information to Pet Sitter.</span>
                </div>
              
              <BookingDetail
                booking={latestBooking}
                showStatus={false}
                showChangeButton={false}
                onChangeTime={() => {}}
              />
              
              </div>
              <div className="flex gap-4 justify-center lg:p-10 pt-37">
              <NavigationButton
                  href="/booking-history"
                  variant="secondary"
                  >

                  Booking History
                </NavigationButton>
                <NavigationButton
                  href="/"
                  variant="primary"
                  >

                  Back To Home
                </NavigationButton>
              </div>
            </div>
            ) : step === 1 ? (
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
                onChangeName={(value: string) => updateInfo({ name: value })}
                onChangeEmail={(value: string) => updateInfo({ email: value })}
                onChangePhone={(value: string) => updateInfo({ phone: value })}
                onChangeMessage={(value: string) =>
                  updateInfo({ message: value })
                }
                canNext={canFinishStep2}
                onBack={handleBackToPets}
                onNext={handleNextFromInformation}
              />
            ) : (
              <BookingPaymentStep
                paymentMethod={paymentMethod}
                cardName={cardName}
                loading={submittingPayment}
                isConfirmOpen={isConfirmOpen}
                onChangePaymentMethod={setPaymentMethod}
                onChangeCardName={setCardName}
                onBack={handleBackToInformation}
                onOpenConfirmModal={handleOpenConfirmModal}
              />
            )}
          </div>
        </div>

        {!isSuccessOpen && (
          <div className="lg:w-[320px] w-full sticky top-6 self-start">
            <BookingSummary
              sitterName={sitterName}
              dateLabel={dateLabel}
              timeLabel={timeLabel}
              hours={hours}
              petNames={selectedPetNames}
            />
          </div>
        )}
      </div>

      {!isSuccessOpen && (
        <>
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
        </>
      )}
    </div>
  );
}