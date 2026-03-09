// import { Pet, Sitter } from "@/context/booking/bookingTypes";

// export function isPetAcceptedBySitter(pet: Pet, sitter?: Sitter) {
//   if (!sitter) return { accepted: true }; // ถ้ายังไม่เลือก sitter ก็ไม่ต้อง disable
//   const acceptedTypes = sitter.acceptedTypes ?? [];
//   const accepted = sitter.acceptedTypes.includes(pet.type);
//   return {
//     accepted,
//     reason: accepted ? undefined : `Sitter รับเฉพาะ: ${sitter.acceptedTypes.join(", ")}`,
//   };
// }