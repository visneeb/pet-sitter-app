
// "use client";

// import React from "react";
// import { Pet } from "@/context/booking/bookingTypes";

// type Props = {
//   pet: Pet;
//   selected: boolean;
//   disabled: boolean;
//   disabledReason?: string;
//   onSelect: () => void;
// };

// function badgeClass(type: string) {
//   const t = type?.toLowerCase?.() ?? "";
//   if (t.includes("dog")) return "border-emerald-300 bg-emerald-50 text-emerald-600";
//   if (t.includes("cat")) return "border-pink-300 bg-pink-50 text-pink-600";
//   if (t.includes("bird")) return "border-sky-300 bg-sky-50 text-sky-600";
//   return "border-gray-300 bg-gray-50 text-gray-600";
// }

// export function PetCard({ pet, selected, disabled, disabledReason, onSelect }: Props) {
//   return (
//     <button
//       type="button"
//       onClick={disabled ? undefined : onSelect}
//       disabled={disabled}
//       title={disabled ? disabledReason : undefined}
//       className={[
//         "relative w-[240px] h-[240px] rounded-3xl border bg-white p-6 shadow-sm transition",
//         "flex flex-col items-center justify-center gap-3",
//         selected ? "border-orange-300" : "border-gray-200",
//         disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow",
//       ].join(" ")}
//     >
//       {/* Checkbox มุมขวาบน (ตกแต่งให้เหมือนในรูป) */}
//       <span
//         className={[
//           "absolute right-4 top-4 h-6 w-6 rounded-md border flex items-center justify-center",
//           selected ? "border-orange-400 bg-orange-400 text-white" : "border-gray-200 bg-white",
//         ].join(" ")}
//         aria-hidden="true"
//       >
//         {selected ? "✓" : ""}
//       </span>

//       {/* Avatar วงกลม */}
//       <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-100">
//         {/* ถ้า Pet type ของคุณมีรูป เช่น pet.imageUrl / pet.photoUrl ให้เปลี่ยนตรงนี้ */}
//         {("imgUrl" in pet && (pet as any).imgUrl) ? (
//           <img
//             src={(pet as any).imgUrl}
//             alt={pet.name}
//             className="h-full w-full object-cover"
//           />
//         ) : null}
//       </div>

//       {/* Name */}
//       <p className="text-xl font-semibold text-gray-800">{pet.name}</p>

//       {/* Type badge */}
//       <span className={["rounded-full border px-5 py-1 text-sm", badgeClass(pet.type)].join(" ")}>
//         {pet.type}
//       </span>


//     </button>
//   );
// }