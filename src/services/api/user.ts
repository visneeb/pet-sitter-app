import { privateApi } from "./client";
import type { ProfileFormValues } from "@/lib/validations/profileValidation";
import formatLocalDate from "@/utils/formatLocalDate";

export type UserUpdateResponse = {
  message: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  idNumber?: string;
  dateOfBirth?: string;
  profileImgUrl: string;
  role: string;
  sitterId?: string;
};

function buildUserProfileFormData(
  data: Pick<ProfileFormValues, "name" | "phone" | "idNumber" | "dateOfBirth">,
  file: File | null,
  removeProfileImg: boolean,
  userRole: "owner" | "sitter",
): FormData {
  const bodyCore = {
    name: data.name.trim(),
    phone: data.phone.trim(),
    idNumber: data.idNumber,
    dateOfBirth: data.dateOfBirth ? formatLocalDate(data.dateOfBirth) : null,
  };
  const body = removeProfileImg
    ? { ...bodyCore, removeProfileImg: true }
    : bodyCore;

  // For sitters, endpoint requires at least one sitter field
  // Use a valid sitter field that won't interfere with user data
  const finalBody =
    userRole === "sitter"
      ? { ...body, tradeName: "" } // Empty string is valid for tradeName
      : body;

  const formData = new FormData();
  formData.append("body", JSON.stringify(finalBody));
  if (file) {
    formData.append(userRole === "sitter" ? "profileImage" : "image", file);
  }
  return formData;
}

export const userApi = {
  getCurrentUser: (): Promise<CurrentUser> =>
    privateApi.get("/auth/get-user").then((res) => res.data),

  updateProfile: (
    formData: FormData,
    userRole: "owner" | "sitter" = "owner",
  ): Promise<UserUpdateResponse> => {
    // Use the existing endpoint pattern that works
    const endpoint =
      userRole === "sitter" ? "/pet-sitter/profile" : "/pet-owner/profile";

    // For basic info updates on sitter endpoint, add minimal sitter field
    const bodyStr = formData.get("body") as string;
    const bodyObj = JSON.parse(bodyStr);

    if (userRole === "sitter" && !bodyObj.experience && !bodyObj.tradeName) {
      // Add minimal sitter field for basic info updates
      bodyObj.tradeName = "Pet Care";
      formData.set("body", JSON.stringify(bodyObj));
    }

    return privateApi.put(endpoint, formData).then((res) => res.data);
  },

  updateBasicProfile: (
    data: ProfileFormValues,
    file: File | null,
    removeProfileImg: boolean,
    userRole: "owner" | "sitter" = "owner",
  ): Promise<UserUpdateResponse> => {
    const formData = buildUserProfileFormData(
      data,
      file,
      removeProfileImg,
      userRole,
    );
    return userApi.updateProfile(formData, userRole);
  },
};
