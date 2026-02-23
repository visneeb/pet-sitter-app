"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";
import { GalleryFiles } from "@/types/imageUploadType";

interface Props {
  value: GalleryFiles;
  onChange: (files: GalleryFiles) => void;
  max?: number;
}

export function MultiImageUpload({ value, onChange, max = 10 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const newFiles = Array.from(incoming);
    const updated = [...value, ...newFiles].slice(0, max);
    onChange(updated);
  };

  const removeFile = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {value.map((file, index) => (
        <div key={index} className="relative w-40 h-40">
          <img
            src={URL.createObjectURL(file)}
            className="w-40 h-40 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => removeFile(index)}
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      {value.length < max && (
        <div
          onClick={() => inputRef.current?.click()}
          className="w-40 h-40 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer"
        >
          <Plus className="w-6 h-6 text-gray-400" />
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        multiple
        accept=".jpg,.jpeg,.png"
        onChange={(e) => addFiles(e.target.files)}
      />
    </div>
  );
}
