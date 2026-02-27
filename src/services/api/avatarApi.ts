import { privateApi } from "./client";

// TODO: Implement avatar upload endpoints in backend
export async function uploadAvatarApi(
  file: File,
): Promise<{ publicUrl?: string; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await privateApi.post("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function deleteAvatarApi(
  publicUrl: string,
): Promise<{ success?: boolean; error?: string }> {
  const { data } = await privateApi.delete("/upload/avatar", {
    data: { publicUrl },
  });

  return data;
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
  } catch (error: any) {
    console.error("Failed to fetch profile:", error);
    throw new Error(
      error.response?.data?.error ||
        error.message ||
        "Failed to fetch profile data",
    );
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
