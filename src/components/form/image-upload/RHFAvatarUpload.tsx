"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { AvatarUpload } from "./AvatarUpload";
import { ImageFile } from "@/types/imageUploadType";

interface Props {
  name: string;
  defaultImage?: string;
  sampleImage?: React.ReactNode;
  label?: string;
  onUpload?: (file: ImageFile) => Promise<void>;
  isUploading?: boolean;
}

export function RHFAvatarUpload({
  name,
  defaultImage,
  sampleImage,
  label,
  onUpload,
  isUploading,
}: Props) {
  const { watch, setValue, formState } = useFormContext();
  const error = formState.errors[name];

  // The saved URL from the DB
  const savedUrl = watch(name);
  const currentUrl: string | undefined =
    typeof savedUrl === "string" && savedUrl && !savedUrl.startsWith("blob:")
      ? savedUrl
      : undefined;

  // Local blob preview
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  // Revoke old blob URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (file: ImageFile) => {
    // Revoke previous blob if any
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    if (!file) {
      // User cleared the avatar
      setPreviewUrl(undefined);
      setValue(name, "", { shouldValidate: false, shouldDirty: true });
      if (onUpload) Promise.resolve().then(() => onUpload(null));
      return;
    }

    // Create blob URL immediately for real-time preview
    const blob = URL.createObjectURL(file);
    setPreviewUrl(blob);

    // Store the File in RHF without triggering validation
    setValue(name, file, { shouldValidate: false, shouldDirty: true });

    // Notify parent (e.g. store file in state for form submit)
    if (onUpload) Promise.resolve().then(() => onUpload(file));
  };

  // Priority: local blob preview > saved DB URL > defaultImage
  const displayUrl = previewUrl ?? currentUrl;

  return (
    <>
      {label && <div>{label}</div>}

      <div className="relative inline-block">
        <AvatarUpload
          value={null}
          currentUrl={displayUrl}
          onChange={handleChange}
          defaultImage={defaultImage}
          sampleImage={sampleImage}
        />

        {/* Uploading indicator */}
        {isUploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-2">{error.message as string}</p>
      )}
    </>
  );
}
