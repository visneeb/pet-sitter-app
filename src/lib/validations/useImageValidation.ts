import { ImageFile } from "@/types/imageUploadType";

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png"];

export function validateImage(file: ImageFile) {
  if (!file) return true;

  if (!ALLOWED_TYPES.includes(file.type)) return "Only JPG and PNG allowed";

  if (file.size > MAX_SIZE) return "File must be less than 2MB";

  return true;
}
