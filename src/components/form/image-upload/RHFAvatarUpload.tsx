"use client";

import { Controller, useFormContext } from "react-hook-form";
import { AvatarUpload } from "@/components/form/image-upload/AvatarUpload";
import { validateImage } from "@/lib/validations/useImageValidation";

interface Props {
  name: string;
  defaultImage?: string;
  sampleImage?: React.ReactNode;
  label?: string;
}

export function RHFAvatarUpload({
  name,
  defaultImage,
  sampleImage,
  label,
}: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: validateImage,
      }}
      render={({ field, fieldState }) => (
        <>
        <div>{label}</div>
          <AvatarUpload
            value={field.value}
            onChange={field.onChange}
            defaultImage={defaultImage}
            sampleImage={sampleImage}
          />
          {fieldState.error && (
            <p className="text-red-500 text-sm mt-2">
              {fieldState.error.message}
            </p>
          )}
        </>
      )}
    />
  );
}
