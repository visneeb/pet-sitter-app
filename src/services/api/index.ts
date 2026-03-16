// Central export point for all API services

export { publicApi, privateApi, createApiInstance } from "./client";
export * from "./auth";
export * from "./userApi";
export * from "./sitterApi";
export * from "./addressApi";
export {
  getPetSitters,
  getPetSitterById,
  getPetSitterByUserId,
  getPetSitterByUserIdSimple,
  updatePetSitterProfile,
} from "./sitterApi";
export { petApi } from "./petApi";
export { reviewApi } from "./reviewApi"; 
