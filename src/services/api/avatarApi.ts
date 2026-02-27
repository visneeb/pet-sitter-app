import { privateApi } from "./client";

// TODO: Implement avatar upload endpoints in backend
// export async function uploadAvatarApi(
//   file: File,
// ): Promise<{ publicUrl?: string; error?: string }> {
//   const formData = new FormData();
//   formData.append("file", file);

//   const { data } = await privateApi.post("/upload/avatar", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return data;
// }

// export async function deleteAvatarApi(
//   publicUrl: string,
// ): Promise<{ success?: boolean; error?: string }> {
//   const { data } = await privateApi.delete("/upload/avatar", {
//     data: { publicUrl },
//   });

//   return data;
// }

// Temporary placeholder functions until backend implements upload
export async function uploadAvatarApi(
  file: File,
): Promise<{ publicUrl?: string; error?: string }> {
  // Return placeholder URL or error until backend implements upload
  return { error: "Avatar upload not implemented yet" };
}

export async function deleteAvatarApi(
  publicUrl: string,
): Promise<{ success?: boolean; error?: string }> {
  // Return success until backend implements upload
  return { success: true };
}

export async function getProfileApi(): Promise<{
  id: string;
  email: string;
  name: string;
  phone: string;
  profileImgUrl: string;
  role: string;
} | null> {
  try {
    const { data } = await privateApi.get("/auth/get-user");
    return data;
  } catch {
    return null;
  }
}

export async function updateProfileApi(body: {
  name: string;
  phone: string;
  profileImgUrl: string;
}): Promise<{ success?: boolean; error?: string }> {
  const { data } = await privateApi.put("/pet-owner/user", body);
  return data;
}
