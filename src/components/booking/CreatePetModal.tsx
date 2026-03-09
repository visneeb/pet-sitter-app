// "use client";

// import React from "react";
// import { X } from "lucide-react";

// import { Form } from "@/components/form";
// import { usePetForm } from "@/hooks/usePetForm";
// import PetFields from "@/components/owner/pet/petFields";
// import type { PetFormValues } from "@/types/pet";

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   onCreated?: () => void | Promise<void>;
// };

// const defaultPetFormValues: Partial<PetFormValues> = {
//   img_url: null,
//   petName: "",
//   petTypeId: undefined,
//   breed: "",
//   sex: "",
//   dateOfBirth: null,
//   color: "",
//   weight: "",
//   about: "",
// };

// export function CreatePetModal({ open, onClose, onCreated }: Props) {
//   const { petTypes, methods, handleSubmit, isSubmitting } = usePetForm({
//     mode: "create",
//     redirectOnSuccess: false,
//   });

//   const handleClose = React.useCallback(() => {
//     methods.reset(defaultPetFormValues);
//     onClose();
//   }, [methods, onClose]);

//   React.useEffect(() => {
//     if (!open) return;

//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") handleClose();
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [open, handleClose]);

//   React.useEffect(() => {
//     if (!open) return;

//     const previous = document.body.style.overflow;
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = previous;
//     };
//   }, [open]);

//   if (!open) return null;

//   const handleCreate = async (data: Parameters<typeof handleSubmit>[0]) => {
//     try {
//       await handleSubmit(data);

//       methods.reset(defaultPetFormValues);
//       onClose();
//       await onCreated?.();
//     } catch {
//       // error toast handled in usePetForm
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50">
//       <button
//         type="button"
//         aria-label="Close modal"
//         className="absolute inset-0 bg-black/40"
//         onClick={handleClose}
//       />

//       <div className="relative z-10 flex min-h-full items-center justify-center p-4">
//         <div className="w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
//           <div className="mb-4 flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">Create Pet</h2>

//             <button
//               type="button"
//               className="rounded-full p-2 transition-colors hover:bg-gray-100"
//               onClick={handleClose}
//               aria-label="Close"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           <Form methods={methods} onSubmit={handleCreate} disabled={isSubmitting}>
//             <PetFields mode="create" petTypes={petTypes} onCancel={handleClose} />
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }