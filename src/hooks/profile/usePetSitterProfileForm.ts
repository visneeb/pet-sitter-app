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
  deleteRejectNote,
} from "@/services/api/sitter";
import { userApi } from "@/services/api/user";
import { petApi } from "@/services/api/pet";
import { District, SubDistrict } from "@/services/api/address";
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
  isShowRejectNote: boolean;
  cancelUpdate: () => Promise<void>;
  hideRejectNote: () => Promise<void>;
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
      removeProfileImg: false,
      name: "",
      email: "",
      phone: "",
      idNumber: "",
      dateOfBirth: null,
      profile_img_url: "",
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
  const [isShowRejectNote, setIsShowRejectNote] = useState<boolean>(false);

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
        // FIX 1: Show toast on load error instead of silently returning
        if (error || !data) {
          showCustomToast({
            title: "Failed to load sitter profile",
            description: error || "No profile data returned",
            variant: "error",
          });
          return;
        }

        setSitterId(data.id);
        setSitterData(data);
        setStatus(data.status || "Waiting for approval");
        setAdminNote(data.adminNote ?? null);
        setIsShowRejectNote(Boolean(data.adminNote));
        setHasPendingUpdate(data.hasPendingUpdate);
        initImages(data.imgUrls || []);

        // Get current user data to populate user fields
        let currentUserData = null;
        try {
          currentUserData = await userApi.getCurrentUser();
        } catch (userError) {
          console.warn("Failed to load current user data:", userError);
        }

        const fields: Partial<Record<keyof SitterProfileFormValues, any>> = {
          // User fields from current user data
          name: currentUserData?.name || data.sitter?.name || "",
          email: currentUserData?.email || "",
          phone: currentUserData?.phone || "",
          idNumber: currentUserData?.idNumber || "",
          dateOfBirth: currentUserData?.dateOfBirth
            ? new Date(currentUserData.dateOfBirth + "T00:00:00+00:00")
            : null,
          profile_img_url:
            currentUserData?.profileImgUrl || data.sitter?.profileImgUrl || "",

          // Sitter fields
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
          removeProfileImg: false,
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
        showCustomToast({
          title: "Failed to load sitter profile",
          description: "An unexpected error occurred",
          variant: "error",
        });
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
      // FIX 2: Show toast so user knows why submit was blocked
      showCustomToast({
        title: "Please fix the form errors",
        description: "Some fields are invalid or missing.",
        variant: "error",
      });
      return;
    }

    if (!sitterId) {
      setError("root", {
        type: "server",
        message: "No sitter profile found. Please contact support.",
      });
      showCustomToast({
        title: "No sitter profile found",
        description: "Please contact support.",
        variant: "error",
      });
      return;
    }

    setIsUpdating(true);

    try {
      // FIX 3: Ensure existingImages is always a valid array, never undefined
      const safeExistingImages = Array.isArray(existingImageOrders)
        ? existingImageOrders
        : [];

      // FIX 4: Only pass images if they are valid File objects
      const validNewImages =
        data.images && data.images.length > 0
          ? data.images.filter((img): img is File => img instanceof File)
          : undefined;

      // Extract profile image from form data if available
      const profileImage =
        data.avatarFile instanceof File ? data.avatarFile : undefined;
      const removeProfileImg = data.removeProfileImg || false;

      // Build request body with both user and sitter fields
      const requestBody: any = {
        // Sitter fields
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
        existingImages: safeExistingImages,

        // User fields (only include if they have values)
        ...(data.name && { name: data.name.trim() }),
        ...(data.phone && { phone: data.phone.trim() }),
        ...(data.idNumber !== undefined && { idNumber: data.idNumber || null }),
        ...(data.dateOfBirth && {
          dateOfBirth:
            data.dateOfBirth instanceof Date
              ? data.dateOfBirth.toISOString().split("T")[0]
              : data.dateOfBirth,
        }),
        ...(removeProfileImg && { removeProfileImg: true }),
      };

      const result = await updatePetSitterProfile(
        requestBody,
        validNewImages,
        profileImage,
      );

      if (result.error) {
        setError("root", { type: "server", message: result.error });
        showCustomToast({
          title: "Failed to update profile",
          description: result.error,
          variant: "error",
        });
        return;
      }

      showCustomToast({
        title: "Sitter profile updated",
        description: "Your sitter info has been saved.",
        variant: "success",
      });

      router.refresh();
      methods.setValue("images", []);

      // FIX 5: Re-fetch and repopulate everything cleanly after update
      const { data: updatedData, error: fetchError } = await getCurrentSitter();
      if (fetchError || !updatedData) {
        // Update succeeded but re-fetch failed — not critical, just warn
        showCustomToast({
          title: "Profile updated",
          description: "Could not reload latest data. Please refresh the page.",
          variant: "error",
        });
        return;
      }

      setHasPendingUpdate(updatedData.hasPendingUpdate);
      setStatus(updatedData.status || "Waiting for approval");
      setAdminNote(updatedData.adminNote ?? null);
      setSitterData(updatedData);
      initImages(updatedData.imgUrls || []);

      const updatedFields: Partial<Record<keyof SitterProfileFormValues, any>> =
        {
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

      // FIX 6: Let the useEffect handle address repopulation via setSitterData
      // instead of calling populateAddressFields directly (avoids race condition)

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
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update sitter profile";

      setError("root", { type: "server", message });
      showCustomToast({
        title: "Failed to update sitter profile",
        description: message,
        variant: "error",
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

  const hideRejectNote = async () => {
    try {
      setIsShowRejectNote(false);
      await deleteRejectNote();
    } catch (error: any) {
      // FIX 7: Don't silently swallow errors on deleteRejectNote
      console.error("Failed to delete reject note:", error);
      setIsShowRejectNote(true); // Revert UI if API call failed
    }
  };

  return {
    methods,
    isSubmitting: formState.isSubmitting,
    hasPendingUpdate,
    isUpdating,
    isCancelLoading,
    isShowRejectNote,
    onSubmit,
    cancelUpdate,
    hideRejectNote,
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
