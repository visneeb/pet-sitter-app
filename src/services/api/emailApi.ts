import { privateApi } from "./client";

export async function updateEmailApi(
  newEmail: string,
  password: string,
  userRole: "owner" | "sitter" = "owner",
): Promise<{ success?: boolean; error?: string }> {
  try {
    const endpoint =
      userRole === "sitter" ? "/pet-sitter/user" : "/pet-owner/user";
    const response = await privateApi.put(endpoint, {
      email: newEmail,
      password: password,
    });
    return { success: true };
  } catch (error: any) {
    return {
      error:
        error.response?.data?.error ||
        error.message ||
        "Failed to update email",
    };
  }
}
