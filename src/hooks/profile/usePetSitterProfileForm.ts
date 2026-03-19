"use client";

import {
  SitterProfileFormValues,
  validateSitterProfile,
} from "@/lib/validations/sitterProfileValidation";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  updatePetSitterProfile,
  getCurrentSitter,
  PetSitterDetail,
  cancelPetSitterProfileUpdate,
} from "@/services/api/sitterApi";
import { petApi } from "@/services/api/petApi";
import { District, SubDistrict } from "@/services/api/addressApi";
import React from "react";
import { useRouter } from "next/navigation";
import { useAddressFields } from "./pet-sitter-profile/useAddressFields";
import { useSitterImages } from "./pet-sitter-profile/useSitterImages";

export interface SitterProfileFormReturn {
  methods: UseFormReturn<SitterProfileFormValues>;
  isSubmitting: boolean;
  isUpdating: boolean;
  hasPendingUpdate: boolean;
  isCancelLoading: boolean;
  cancelUpdate: () => Promise<void>;
  onSubmit: (data: SitterProfileFormValues) => Promise<void>;
  petTypes: { id: number; name: string }[];
  provinces: ReturnType<typeof useAddressFields>["provinces"];
  districts: District[];
  subDistricts: SubDistrict[];
  status: string | null;
  adminNote: string | null;
  statusConfig: Record<string, { text: string; bg: string; label: string }>;
  existingImages: string[];
  removeExistingImage: (url: string) => void;
  reorderExistingImages: (images: { url: string; order: number }[]) => void;
  imagesChanged: boolean;
  setExternalUpdate: (isExternal: boolean) => void;
  setDistricts: React.Dispatch<React.SetStateAction<District[]>>;
  setSubDistricts: React.Dispatch<React.SetStateAction<SubDistrict[]>>;
}

const statusConfig: Record<
  string,
  { text: string; bg: string; label: string }
> = {
  "Waiting for approval": {
    text: "text-pink-500",
    bg: "bg-pink-500",
    label: "Waiting for approval",
  },
  Approved: { text: "text-green-500", bg: "bg-green-500", label: "Approved" },
  Rejected: { text: "text-red-500", bg: "bg-red-500", label: "Rejected" },
  Unapproved: { text: "text-gray-400", bg: "bg-gray-400", label: "Unapproved" },
};

export function usePetSitterForm(): SitterProfileFormReturn {
  const methods = useForm<SitterProfileFormValues>({
    mode: "onTouched",
    defaultValues: {
      experience: 0,
      tradeName: "",
      petTypeIds: [],
      introduction: "",
      services: "",
      description: "",
      address: "",
      latitude: 0,
      longitude: 0,
      provinceId: 0,
      districtId: 0,
      subDistrictId: 0,
      postalCode: "",
      status: "",
      images: [],
    },
  });

  const { setError, formState } = methods;
  const router = useRouter();

  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [sitterId, setSitterId] = useState<number | null>(null);
  const [petTypes, setPetTypes] = useState<{ id: number; name: string }[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState<string | null>(null);
  const [hasPendingUpdate, setHasPendingUpdate] = useState(false);
  const [sitterData, setSitterData] = useState<PetSitterDetail | null>(null);

  const {
    provinces,
    districts,
    subDistricts,
    setDistricts,
    setSubDistricts,
    setExternalUpdate,
    populateAddressFields,
  } = useAddressFields(methods);

  const {
    existingImages,
    existingImageOrders,
    imagesChanged,
    initImages,
    removeExistingImage,
    reorderExistingImages,
  } = useSitterImages();

  // Load sitter profile on mount
  useEffect(() => {
    const loadSitterProfile = async () => {
      try {
        const { data, error } = await getCurrentSitter();
        if (error || !data) return;

        setSitterId(data.id);
        setSitterData(data);
        setStatus(data.status || "Waiting for approval");
        setAdminNote(data.adminNote ?? null);
        setHasPendingUpdate(data.hasPendingUpdate);
        initImages(data.imgUrls || []);

        const fields: Partial<Record<keyof SitterProfileFormValues, any>> = {
          experience: data.experience ?? 0,
          tradeName: data.tradeName ?? "",
          introduction: data.introduction ?? "",
          services: data.services ?? "",
          description: data.description ?? "",
          address: data.address ?? "",
          latitude: data.latitude ?? 0,
          longitude: data.longitude ?? 0,
          status: data.status ?? "",
          images: [],
        };

        Object.entries(fields).forEach(([key, value]) => {
          methods.setValue(key as keyof SitterProfileFormValues, value, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
        });
      } catch (err) {
        console.error("Failed to load sitter profile:", err);
      }
    };

    loadSitterProfile();
  }, []);

  // Populate address once provinces are loaded
  useEffect(() => {
    if (!sitterData || provinces.length === 0) return;
    populateAddressFields(sitterData);
  }, [sitterData, provinces]);

  // Resolve petType IDs once petTypes list is loaded
  useEffect(() => {
    if (!sitterData || petTypes.length === 0) return;
    const petTypeIds = sitterData.petTypes
      .map((name: string) => petTypes.find((pt) => pt.name === name)?.id)
      .filter(Boolean) as number[];
    methods.setValue("petTypeIds", petTypeIds);
  }, [sitterData, petTypes]);

  useEffect(() => {
    petApi
      .getTypes()
      .then(setPetTypes)
      .catch(() => setPetTypes([]));
  }, []);

  const onSubmit = async (data: SitterProfileFormValues) => {
    if (isUpdating) return;

    const errors = validateSitterProfile(data);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        if (error)
          setError(field as keyof SitterProfileFormValues, {
            type: error.type as string,
            message: error.message,
          });
      });
      return;
    }

    if (!sitterId) {
      setError("root", {
        type: "server",
        message: "No sitter profile found. Please contact support.",
      });
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updatePetSitterProfile(
        {
          experience: Number(data.experience),
          tradeName: data.tradeName,
          petTypeIds: data.petTypeIds.map(Number),
          introduction: data.introduction || undefined,
          services: data.services || undefined,
          description: data.description || undefined,
          address: data.address,
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          provinceId: Number(data.provinceId),
          districtId: Number(data.districtId),
          subDistrictId: Number(data.subDistrictId),
          existingImages: existingImageOrders,
        },
        data.images?.length ? data.images : undefined,
      );

      if (result.error) {
        setError("root", { type: "server", message: result.error });
        return;
      }

      showCustomToast({
        title: "Sitter profile updated",
        description: "Your sitter info has been saved.",
        variant: "success",
      });
      router.refresh();
      methods.setValue("images", []);

      const { data: updatedData } = await getCurrentSitter();
      if (updatedData) {
        setHasPendingUpdate(updatedData.hasPendingUpdate);
        const updatedFields: Partial<
          Record<keyof SitterProfileFormValues, any>
        > = {
          experience: updatedData.experience ?? 0,
          tradeName: updatedData.tradeName ?? "",
          introduction: updatedData.introduction ?? "",
          services: updatedData.services ?? "",
          description: updatedData.description ?? "",
          address: updatedData.address ?? "",
          latitude: updatedData.latitude ?? 0,
          longitude: updatedData.longitude ?? 0,
        };

        Object.entries(updatedFields).forEach(([key, value]) => {
          methods.setValue(key as keyof SitterProfileFormValues, value, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
        });

        initImages(updatedData.imgUrls || []);
        await populateAddressFields(updatedData);

        if (petTypes.length > 0) {
          const updatedPetTypeIds = (updatedData.petTypes || [])
            .map((name: string) => petTypes.find((p) => p.name === name)?.id)
            .filter(Boolean) as number[];
          methods.setValue("petTypeIds", updatedPetTypeIds, {
            shouldDirty: false,
          });
        }

        methods.reset(methods.getValues(), {
          keepValues: true,
          keepDirty: false,
          keepDefaultValues: false,
        });
      }
    } catch (error: any) {
      setError("root", {
        type: "server",
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to update sitter profile",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelUpdate = async () => {
    setIsCancelLoading(true);
    try {
      await cancelPetSitterProfileUpdate();
      setHasPendingUpdate(false);
      showCustomToast({
        title: "Sitter profile update cancelled",
        description: "Your sitter info update has been cancelled.",
        variant: "success",
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to cancel sitter profile update";
      setError("root", { type: "server", message });
      showCustomToast({
        title: "Failed to cancel sitter profile update",
        description: message,
        variant: "error",
      });
    } finally {
      setIsCancelLoading(false);
    }
  };

  return {
    methods,
    isSubmitting: formState.isSubmitting,
    hasPendingUpdate,
    isUpdating,
    isCancelLoading,
    onSubmit,
    cancelUpdate,
    petTypes,
    provinces,
    districts,
    subDistricts,
    status,
    adminNote,
    statusConfig,
    existingImages,
    removeExistingImage,
    reorderExistingImages,
    imagesChanged,
    setExternalUpdate,
    setDistricts,
    setSubDistricts,
  };
}
