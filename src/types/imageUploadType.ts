export type ImageFile = File | null;

export type GalleryFiles = File[];

export type ImageUploadVariant = "avatar" | "gallery";

export interface UploadResponse {
  url: string;
  path: string;
}
