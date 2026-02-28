"use client";

import { useEffect, useState } from "react";
import { ImageFile } from "@/types/imageUploadType";

export function useImagePreview(file: ImageFile, defaultUrl?: string) {
  const [preview, setPreview] = useState<string | null>(defaultUrl || null);

  useEffect(() => {
    if (!file) {
      setPreview(defaultUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file, defaultUrl]);

  return preview;
}
