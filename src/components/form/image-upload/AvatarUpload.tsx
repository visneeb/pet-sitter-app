"use client";

import { useRef } from "react";
import { UserRound, Plus } from "lucide-react";
import { ImageFile } from "@/types/imageUploadType";
import { useImagePreview } from "@/hooks/image/useImagePreview";
import { ActionButton } from "@/components/ui/Button";

interface Props {
  /** A freshly-picked File for local blob preview */
  value: ImageFile;
  /** Existing URL already saved in the DB — shown when no new file is picked */
  currentUrl?: string;
  onChange: (file: ImageFile) => void;
  defaultImage?: string;
  sampleImage?: React.ReactNode;
}

export function AvatarUpload({
  value,
  currentUrl,
  onChange,
  defaultImage,
  sampleImage,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Priority: new blob from picked file → saved DB URL → passed defaultImage
  const preview = useImagePreview(value, currentUrl ?? defaultImage);

  return (
    <div className="relative size-30 lg:size-60">
      {preview ? (
        <img
          src={preview}
          alt="Profile avatar"
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
