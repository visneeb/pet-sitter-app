import { privateApi } from "@/services/api/client";
import { UploadResponse } from "@/types/imageUploadType";

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await privateApi.post<UploadResponse>("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}
