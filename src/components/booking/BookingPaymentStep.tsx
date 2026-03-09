// "use client";

// import React from "react";
// import { ActionButton } from "@/components/ui/Button";
// import { Input } from "@/components/ui/input/Input";
// import {
//   validatePaymentForm,
//   hasPaymentErrors,
// } from "@/lib/validations/paymentValidation";

// type Props = {
//   cardName: string;
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
//   loading?: boolean;

//   onChangeCardName: (value: string) => void;
//   onChangeCardNumber: (value: string) => void;
//   onChangeExpiryDate: (value: string) => void;
//   onChangeCvv: (value: string) => void;

//   onBack: () => void;
//   onSubmit: () => void;
// };

// export function BookingPaymentStep({
//   cardName,
//   cardNumber,
//   expiryDate,
//   cvv,
//   loading = false,
//   onChangeCardName,
//   onChangeCardNumber,
//   onChangeExpiryDate,
//   onChangeCvv,
//   onBack,
//   onSubmit,
// }: Props) {
//   const [errors, setErrors] = React.useState({
//     cardName: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//   });

//   const handleClickSubmit = () => {
//     const nextErrors = validatePaymentForm({
//       cardName,
//       cardNumber,
//       expiryDate,
//       cvv,
//     });

//     setErrors(nextErrors);

//     if (hasPaymentErrors(nextErrors)) return;

//     onSubmit();
//   };

//   const canSubmit =
//     cardName.trim() &&
//     cardNumber.trim() &&
//     expiryDate.trim() &&
//     cvv.trim();

//   return (
//     <>
//       <h1 className="text-lg font-semibold text-gray-900">Payment</h1>

//       <div className="mt-6 flex-1">
//         <div className="grid max-w-md gap-5">
//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium text-gray-700">
//               Name on Card
//             </label>
//             <Input
//               placeholder="Enter cardholder name"
//               value={cardName}
//               error={errors.cardName}
//               onChange={(e) => onChangeCardName(e.target.value)}
//             />
//             {errors.cardName && (
//               <p className="text-sm text-red-500">{errors.cardName}</p>
//             )}
//           </div>

//           <div className="flex flex-col gap-2">
//             <label className="text-sm font-medium text-gray-700">
//               Card Number
//             </label>
//             <Input
//               placeholder="1234 5678 9012 3456"
//               value={cardNumber}
//               error={errors.cardNumber}
//               onChange={(e) => onChangeCardNumber(e.target.value)}
//             />
//             {errors.cardNumber && (
//               <p className="text-sm text-red-500">{errors.cardNumber}</p>
//             )}
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-medium text-gray-700">
//                 Expiry Date
//               </label>
//               <Input
//                 placeholder="MM/YY"
//                 value={expiryDate}
//                 error={errors.expiryDate}
//                 onChange={(e) => onChangeExpiryDate(e.target.value)}
//               />
//               {errors.expiryDate && (
//                 <p className="text-sm text-red-500">{errors.expiryDate}</p>
//               )}
//             </div>

//             <div className="flex flex-col gap-2">
//               <label className="text-sm font-medium text-gray-700">CVV</label>
//               <Input
//                 placeholder="123"
//                 value={cvv}
//                 error={errors.cvv}
//                 onChange={(e) => onChangeCvv(e.target.value)}
//               />
//               {errors.cvv && (
//                 <p className="text-sm text-red-500">{errors.cvv}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-6 flex items-center justify-between gap-4">
//         <div className="w-[120px]">
//           <ActionButton variant="secondary" onClick={onBack}>
//             Back
//           </ActionButton>
//         </div>

//         <div className="flex-1" />

//         <div className="flex justify-end">
//           <ActionButton
//             variant="primary"
//             disabled={!canSubmit || loading}
//             onClick={handleClickSubmit}
//           >
//             {loading ? "Processing..." : "Confirm Booking"}
//           </ActionButton>
//         </div>
//       </div>
//     </>
//   );
// }