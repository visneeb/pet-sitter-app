export async function uploadAvatarApi(
  _file: File,
): Promise<{ publicUrl?: string; error?: string }> {
  console.warn("uploadAvatarApi: use ProfileService.uploadAvatar instead");
  return { error: "Use ProfileService.uploadAvatar instead" };
}

export async function deleteAvatarApi(
  _publicUrl: string,
): Promise<{ success?: boolean; error?: string }> {
  console.warn("deleteAvatarApi: backend handles deletion automatically");
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
  const { privateApi } = await import("./client");
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
