"use client";

import { useRef, useEffect, useState } from "react";
import { CloseIcon, PlusCircleIcon } from "@/assets/icons/components";
import { GalleryFiles } from "@/types/imageUploadType";

import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface Props {
  label: string;
  value: GalleryFiles;
  onChange: (files: GalleryFiles) => void;
  max?: number;
  existingImages?: string[];
  onDeleteImage?: (imageUrl: string) => void;
  onReorderExisting?: (urls: string[]) => void;
}

type ImageItem =
  | { id: string; type: "existing"; url: string }
  | { id: string; type: "new"; file: File; preview: string };

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // attributes on outer, listeners on inner drag handle only
    <div ref={setNodeRef} style={style} {...attributes}>
      <div {...listeners} className="size-40 relative">
        {children}
      </div>
    </div>
  );
}

export function MultiImageUpload({
  label,
  value,
  onChange,
  max = 10,
  existingImages = [],
  onDeleteImage,
  onReorderExisting,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<ImageItem[]>([]);

  /** Initialize gallery items */
  useEffect(() => {
    const existing: ImageItem[] = existingImages.map((url) => ({
      id: `existing-${url}`,
      type: "existing",
      url,
    }));

    setItems((prev) => {
      const newItems = prev.filter((i) => i.type === "new");
      return [...existing, ...newItems];
    });
  }, [existingImages]);

  /** Add uploaded files */
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;

    const availableSlots = max - items.length;
    if (availableSlots <= 0) return;

    const newFiles = Array.from(incoming).slice(0, availableSlots);

    const newItems: ImageItem[] = newFiles.map((file) => ({
      id: `new-${file.name}-${file.size}-${Date.now()}`,
      type: "new",
      file,
      preview: URL.createObjectURL(file),
    }));

    setItems((prev) => [...prev, ...newItems]);
    onChange([...value, ...newFiles]);
  };

  /** Remove new file */
  const removeFile = (id: string) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    const files = updated
      .filter(
        (i): i is { id: string; type: "new"; file: File; preview: string } =>
          i.type === "new",
      )
      .map((i) => i.file);

    onChange(files);
  };

  /** Remove existing image */
  const removeExistingImage = (url: string, id: string) => {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);

    if (onDeleteImage) {
      onDeleteImage(url);
    }

    if (onReorderExisting) {
      const remainingExisting = updated
        .filter(
          (i): i is { id: string; type: "existing"; url: string } =>
            i.type === "existing",
        )
        .map((i) => i.url);
      onReorderExisting(remainingExisting);
    }
  };

  /** Drag reorder */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(items, oldIndex, newIndex);

    setItems(reordered);

    const reorderedFiles = reordered
      .filter(
        (i): i is { id: string; type: "new"; file: File; preview: string } =>
          i.type === "new",
      )
      .map((i) => i.file);
    onChange(reorderedFiles);

    const reorderedExisting = reordered
      .filter(
        (i): i is { id: string; type: "existing"; url: string } =>
          i.type === "existing",
      )
      .map((i) => i.url);

    if (onReorderExisting) {
      onReorderExisting(reorderedExisting);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <label className="style-label">{label}</label>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-6">
            {items.map((item) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="relative size-40 rounded-lg bg-gray-100">
                  {item.type === "existing" && (
                    <>
                      <img
                        src={item.url}
                        className="size-40 object-cover rounded-lg"
                        alt="existing"
                      />
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeExistingImage(item.url, item.id)}
                        className="absolute top-[-3] right-[-5] bg-gray-400 size-6 rounded-full flex items-center justify-center z-10"
                      >
                        <CloseIcon className="size-4 text-white" />
                      </button>
                    </>
                  )}

                  {item.type === "new" && (
                    <>
                      <img
                        src={item.preview}
                        className="size-40 object-cover rounded-lg"
                        alt="new"
                      />
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={() => removeFile(item.id)}
                        className="absolute top-[-3] right-[-5] bg-gray-400 size-6 rounded-full flex items-center justify-center z-10"
                      >
                        <CloseIcon className="size-4 text-white" />
                      </button>
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        New
                      </div>
                    </>
                  )}
                </div>
              </SortableItem>
            ))}

            {items.length < max && (
              <div
                onClick={() => inputRef.current?.click()}
                className="size-40 rounded-lg bg-orange-100 flex flex-col items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircleIcon className="text-orange-500" size={50} />
                <span className="text-orange-500 style-body-2">
                  Upload image
                </span>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

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
