// Central export point for all API services

export { publicApi, privateApi, createApiInstance } from "./client";
export { authApi } from "./auth";
export {
  uploadAvatarApi,
  deleteAvatarApi,
  getProfileApi,
  updateProfileApi,
} from "./avatarApi";
export { updateEmailApi } from "./emailApi";
export {
  uploadPetImage,
  deletePetImage,
  uploadSitterImage,
  deleteSitterImage,
} from "./storageApi";
export { sitterApi } from "./sitterApi";
