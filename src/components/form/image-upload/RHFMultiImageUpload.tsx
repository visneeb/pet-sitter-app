"use client";

import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";
import { MultiImageUpload } from "@/components/form/image-upload/MultiImageUpload";

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  max?: number;
  existingImages?: string[];
  onDeleteImage?: (imageUrl: string) => void;
  onReorderExisting?: (images: { url: string; order: number }[]) => void;
};

export function RHFMultiImageUpload<T extends FieldValues>({
  name,
  label,
  max,
  existingImages,
  onDeleteImage,
  onReorderExisting,
}: Props<T>) {
  const { control, formState } = useFormContext<T>();
  const error = formState.errors[name as string];

  return (
    <>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <MultiImageUpload
            label={label}
            value={field.value || []}
            onChange={field.onChange}
            max={max}
            existingImages={existingImages}
            onDeleteImage={onDeleteImage}
            onReorderExisting={onReorderExisting}
          />
        )}
      />

      {error && (
        <p className="text-red-500 text-sm mt-2">{error.message as string}</p>
      )}
    </>
  );
}
