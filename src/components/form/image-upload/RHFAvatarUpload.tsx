"use client";

import { Controller, useFormContext } from "react-hook-form";
import { AvatarUpload } from "@/components/form/image-upload/AvatarUpload";
import { validateImage } from "@/lib/validations/useImageValidation";
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
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ validate: validateImage }}
      render={({ field, fieldState }) => {
        // field.value is a string URL after profile loads, or a File after user picks
        const fileValue: ImageFile =
          field.value instanceof File ? field.value : null;
        const urlValue: string | undefined =
          typeof field.value === "string" && field.value
            ? field.value
            : undefined;

        return (
          <>
            {label && <div>{label}</div>}

            <div className="relative inline-block">
              <AvatarUpload
                value={fileValue}
                currentUrl={urlValue}
                onChange={async (file: ImageFile) => {
                  // Store the File in RHF while upload is in progress
                  field.onChange(file);
                  // Defer the upload to avoid setState during render
                  setTimeout(async () => {
                    if (onUpload) await onUpload(file);
                  }, 0);
                }}
                defaultImage={defaultImage}
                sampleImage={sampleImage}
              />
            </div>

            {fieldState.error && (
              <p className="text-red-500 text-sm mt-2">
                {fieldState.error.message}
              </p>
            )}
          </>
        );
      }}
    />
  );
}
