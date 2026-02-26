"use client";

import { useRef } from "react";
import { UserRound, Plus, X } from "lucide-react";
import { ImageFile } from "@/types/imageUploadType";
import { useImagePreview } from "@/hooks/image/useImagePreview";
import { ActionButton } from "@/components/ui/Button";

interface Props {
  value: ImageFile;
  onChange: (file: ImageFile) => void;
  defaultImage?: string;
  sampleImage?: React.ReactNode;
}

export function AvatarUpload({
  value,
  onChange,
  defaultImage,
  sampleImage,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const preview = useImagePreview(value, defaultImage);

  return (
    <div className="relative size-30 lg:size-60">
      {preview ? (
        <img
          src={preview}
          className="size-30 lg:size-60 rounded-full object-cover"
        />
      ) : (
        <div className="size-30 lg:size-60 rounded-full bg-gray-200 flex items-center justify-center">
          {sampleImage ?? (
            <UserRound className="size-12 lg:size-27 text-white" />
          )}
        </div>
      )}

      <div className="absolute bottom-0 right-0">
        <ActionButton
          type="button"
          onClick={() => inputRef.current?.click()}
          variant="icon"
          className="size-10 lg:size-15"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <Plus />
          </div>
        </ActionButton>
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".jpg,.jpeg,.png"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />
    </div>
  );
}
