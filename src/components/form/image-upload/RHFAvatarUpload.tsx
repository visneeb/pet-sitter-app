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
                  // Store the File in RHF while upload is in progress;
                  // handleAvatarChange will call setValue("profile_img_url", publicUrl)
                  // once the upload completes, replacing it with the real URL string.
                  field.onChange(file);
                  if (onUpload) await onUpload(file);
                }}
                defaultImage={defaultImage}
                sampleImage={sampleImage}
              />

              {isUploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <svg
                    className="animate-spin w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                </div>
              )}
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
