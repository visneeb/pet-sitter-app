"use client";

import { useState } from "react";
import { GalleryFiles } from "@/types/imageUploadType";

export function useMultiImageManager(
  initial: GalleryFiles = [],
  max: number = 10,
) {
  const [files, setFiles] = useState<GalleryFiles>(initial);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const newFiles = Array.from(incoming);
    setFiles((prev) => [...prev, ...newFiles].slice(0, max));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    files,
    setFiles,
    addFiles,
    removeFile,
  };
}
