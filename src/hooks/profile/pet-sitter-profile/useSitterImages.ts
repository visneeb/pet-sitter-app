import { useState, useCallback } from "react";

export function useSitterImages(initialImages: string[] = []) {
  const [existingImages, setExistingImages] = useState<string[]>(initialImages);
  const [existingImageOrders, setExistingImageOrders] = useState<
    { url: string; order: number }[]
  >(initialImages.map((url, index) => ({ url, order: index })));
  const [imagesChanged, setImagesChanged] = useState(false);

  const initImages = useCallback((images: string[]) => {
    setExistingImages(images);
    setExistingImageOrders(images.map((url, index) => ({ url, order: index })));
    setImagesChanged(false);
  }, []);

  const removeExistingImage = useCallback((url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setExistingImageOrders((prev) => prev.filter((img) => img.url !== url));
    setImagesChanged(true);
  }, []);

  const reorderExistingImages = useCallback(
    (images: { url: string; order: number }[]) => {
      setExistingImages(images.map((img) => img.url));
      setExistingImageOrders(images);
      setImagesChanged(true);
    },
    [],
  );

  return {
    existingImages,
    existingImageOrders,
    imagesChanged,
    initImages,
    removeExistingImage,
    reorderExistingImages,
  };
}
