// "use client";

// import React from "react";

// import Navbar from "@/components/common/nav-bar/Navbar";
// import { ProgressBar } from "@/components/booking/progressbar";
// import { BookingSummary } from "@/components/booking/BookingSummary";
// import { CreatePetModal } from "@/components/booking/CreatePetModal";
// import { useBooking } from "@/contexts/BookingContext";
// import { petApi } from "@/services/api/petApi";
// import { Pet } from "@/context/booking/bookingTypes";
// import { userApi } from "@/services/api";
// import { BookingPetStep } from "@/components/booking/BookingPetStep";
// import { BookingInformationStep } from "@/components/booking/BookingInformationStep";
// import { BookingPaymentStep } from "@/components/booking/BookingPaymentStep";


// const PAGE_SIZE = 6;


// const mockSitter = {
//   id: "s1",
//   name: "Happy House!",
//   acceptedTypes: ["dog", "cat", "rabbit", "bird"],
// };



// const normalizePetType = (type?: string): string => {
//   const value = type?.trim().toLowerCase();

//   if (value === "dog" || value === "dogs") return "dog";
//   if (value === "cat" || value === "cats") return "cat";
//   if (value === "bird" || value === "birds") return "bird";
//   if (value === "rabbit" || value === "rabbits") return "rabbit";

//   return value || "unknown";
// };

export default function BookingPage() {
//   const { state, setPets } = useBooking();

//   const [step, setStep] = React.useState<1 | 2 | 3>(1);
//   const [cardName, setCardName] = React.useState("");
//   const [cardNumber, setCardNumber] = React.useState("");
//   const [expiryDate, setExpiryDate] = React.useState("");
//   const [cvv, setCvv] = React.useState("");
//   const [submittingPayment, setSubmittingPayment] = React.useState(false);
//   const [openCreate, setOpenCreate] = React.useState(false);

//   const [pets, setPetsList] = React.useState<Pet[]>([]);
//   const [selectedPetIds, setSelectedPetIds] = React.useState<string[]>([]);
//   const [loadingPets, setLoadingPets] = React.useState(true);
//   const [petsError, setPetsError] = React.useState("");

//   const [page, setPage] = React.useState(1);



//   const [name, setName] = React.useState("");
//   const [email, setEmail] = React.useState("");
//   const [phone, setPhone] = React.useState("");
//   const [message, setMessage] = React.useState("");
//   const [loadingProfile, setLoadingProfile] = React.useState(true);
//   const [profileError, setProfileError] = React.useState("");




//   const fetchPets = React.useCallback(async () => {
//     try {
//       setLoadingPets(true);
//       setPetsError("");

//       const data = await petApi.getMyPets();

//       const mappedPets: Pet[] = data.map((pet) => ({
//         id: String(pet.id),
//         name: pet.petName,
//         type: normalizePetType(pet.petType),
//         imgUrl: pet.imgUrl ?? "",
//       }));

//       setPetsList(mappedPets);
//       return mappedPets;
//     } catch (error) {
//       console.error("fetch pets error:", error);
//       setPetsError("Unable to load pets.");
//       return [];
//     } finally {
//       setLoadingPets(false);
//     }
//   }, []);

//   const fetchProfile = React.useCallback(async () => {
//     try {
//       setLoadingProfile(true);
//       setProfileError("");
  
//       const user = await userApi.getCurrentUser();
  
//       setName(user.name ?? "");
//       setEmail(user.email ?? "");
//       setPhone(user.phone ?? "");
//     } catch (error) {
//       console.error("fetch profile error:", error);
//       setProfileError("Unable to load profile.");
//     } finally {
//       setLoadingProfile(false);
//     }
//   }, []);


//   React.useEffect(() => {
//     fetchPets();
//   }, [fetchPets]);
//   React.useEffect(() => {
//     fetchProfile();
//   }, [fetchProfile]);


//   const togglePet = (petId: string) => {
//     setSelectedPetIds((prev) =>
//       prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId],
//     );
//   };

//   const totalItems = pets.length + 1;
//   const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
//   const isLastPage = page === totalPages;

//   const pagedPets = React.useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     const end = page * PAGE_SIZE;
//     return pets.slice(start, Math.min(end, pets.length));
//   }, [page, pets]);
  
//   const showCreateNewPet = React.useMemo(() => {
//     const start = (page - 1) * PAGE_SIZE;
//     const end = page * PAGE_SIZE;

//     const createCardIndex = pets.length;
//     return createCardIndex >= start && createCardIndex < end;
//   }, [page, pets.length]);


//   React.useEffect(() => {
//     if (page > totalPages) setPage(totalPages);
//   }, [page, totalPages]);

//   const selectedPetNames = pets
//     .filter((p) => selectedPetIds.includes(p.id))
//     .map((p) => p.name);

//   const hours = (state.info?.durationHours as number | undefined) ?? 3;
//   const sitterName = (state as any).sitter?.name ?? "Happy House!";

//   const canGoStep2 = selectedPetIds.length > 0;
//   const canFinishStep2 = Boolean(name.trim() && email.trim() && phone.trim());

//   const handleNextFromPets = () => {
//     if (!canGoStep2) return;
//     setPets(selectedPetIds);
//     setStep(2);
//   };

//   const handleBackFromPets = () => {
//     window.history.back();
//   };

//   const handleBackToPets = () => {
//     setStep(1);
//   };

//   const handleNextFromInformation = () => {
//     if (!canFinishStep2) return;
//     setStep(3);
//   };
  
//   const handleBackToInformation = () => {
//     setStep(2);
//   };
  
//   const handleSubmitPayment = async () => {
//     try {
//       setSubmittingPayment(true);
  
//       console.log("submit booking + payment", {
//         selectedPetIds,
//         name,
//         email,
//         phone,
//         message,
//         cardName,
//         cardNumber,
//         expiryDate,
//         cvv,
//       });
  
//       // TODO: call API submit booking here
//     } finally {
//       setSubmittingPayment(false);
//     }
//   };

//   const handlePetCreated = async () => {
//     const latestPets = await fetchPets();
//     const newTotalItems = latestPets.length + 1;
//     const newTotalPages = Math.max(1, Math.ceil(newTotalItems / PAGE_SIZE));
  
//     setPage(newTotalPages);
//     setOpenCreate(false);
//   };

//   return (
//     <div className="w-full">
//       <Navbar />
//       <div className="mx-auto w-full max-w-[1200px] px-6 flex flex-col gap-6">
//         <ProgressBar currentStep={step} />

//       <div className="flex items-start gap-10">
        
//         <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
//           {step === 1 ? (
//             <BookingPetStep
//               pets={pagedPets}
//               sitter={mockSitter}
//               selectedPetIds={selectedPetIds}
//               loadingPets={loadingPets}
//               petsError={petsError}
//               totalPages={totalPages}
//               currentPage={page}
//               canNext={canGoStep2}
//               onTogglePet={togglePet}
//               onCreateNewPet={() => setOpenCreate(true)}
//               onRetry={fetchPets}
//               onBack={handleBackFromPets}
//               onNext={handleNextFromPets}
//               onPageChange={setPage}
//               showCreateNewPet={showCreateNewPet}
//             />
//           ) : step === 2 ? (
//             <BookingInformationStep
//               name={name}
//               email={email}
//               phone={phone}
//               message={message}
//               loadingProfile={loadingProfile}
//               profileError={profileError}
//               onRetryProfile={fetchProfile}
//               canNext={canFinishStep2}
//               onChangeName={setName}
//               onChangeEmail={setEmail}
//               onChangePhone={setPhone}
//               onChangeMessage={setMessage}
//               onBack={handleBackToPets}
//               onNext={handleNextFromInformation}
//             />
//           ) : (
//             <BookingPaymentStep
//               cardName={cardName}
//               cardNumber={cardNumber}
//               expiryDate={expiryDate}
//               cvv={cvv}
//               loading={submittingPayment}
//               onChangeCardName={setCardName}
//               onChangeCardNumber={setCardNumber}
//               onChangeExpiryDate={setExpiryDate}
//               onChangeCvv={setCvv}
//               onBack={handleBackToInformation}
//               onSubmit={handleSubmitPayment}
//             />
//           )}
//         </div>

//         <div className="w-[320px] sticky top-6 self-start">
//           <BookingSummary
//             sitterName={sitterName}
//             dateLabel={"25 Aug, 2023"}
//             timeLabel={"7 AM - 10 AM"}
//             hours={hours}
//             petNames={selectedPetNames}
//           />
//         </div>
//       </div>
//     </div>

      
//       <CreatePetModal
//         open={openCreate}
//         onClose={() => setOpenCreate(false)}
//         onCreated={handlePetCreated}
//       />
//     </div>
//   );
}