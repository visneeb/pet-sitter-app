"use client";

import {
  SitterProfileFormValues,
  validateSitterProfile,
} from "@/lib/validations/sitterProfileValidation";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { useState, useEffect, useCallback, useRef } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import {
  updatePetSitterProfile,
  getPetSitterById,
  getCurrentSitter,
  PetSitterDetail,
} from "@/services/api/sitterApi";
import { petApi } from "@/services/api/petApi";
import {
  addressApi,
  Province,
  District,
  SubDistrict,
} from "@/services/api/addressApi";
import { userApi } from "@/services/api/userApi";
import React from "react";

export interface SitterProfileFormReturn {
  methods: UseFormReturn<SitterProfileFormValues>;
  isSubmitting: boolean;
  isUpdating: boolean;
  onSubmit: (data: SitterProfileFormValues) => Promise<void>;
  petTypes: { id: number; name: string }[];
  provinces: Province[];
  districts: District[];
  subDistricts: SubDistrict[];
  status: string | null;
  statusConfig: Record<string, { text: string; bg: string; label: string }>;
  existingImages: string[];
  removeExistingImage: (url: string) => void;
  reorderExistingImages: (urls: string[]) => void;
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
  Approved: {
    text: "text-green-500",
    bg: "bg-green-500",
    label: "Approved",
  },
  Rejected: {
    text: "text-red-500",
    bg: "bg-red-500",
    label: "Rejected",
  },
};

export function usePetSitterForm(): SitterProfileFormReturn {
  const methods = useForm<SitterProfileFormValues>({
    mode: "onChange",
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

  const [isUpdating, setIsUpdating] = useState(false);
  const [sitterId, setSitterId] = useState<number | null>(null);
  const [petTypes, setPetTypes] = useState<{ id: number; name: string }[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [imagesChanged, setImagesChanged] = useState(false);
  const [sitterData, setSitterData] = useState<PetSitterDetail | null>(null);


  const isPopulating = useRef(false);
  const isExternalUpdate = useRef(false);
   const setExternalUpdate = useCallback((isExternal: boolean) => {
    isExternalUpdate.current = isExternal;
  }, []);

  const removeExistingImage = useCallback((url: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== url));
    setImagesChanged(true);
  }, []);

  const reorderExistingImages = useCallback((urls: string[]) => {
    setExistingImages(urls);
    setImagesChanged(true);
  }, []);

  // Step 1: fetch current user + sitter profile once on mount
  useEffect(() => {
    const loadSitterProfile = async () => {
      try {
        const { data, error } = await getCurrentSitter();
        if (error || !data) return;

        setSitterId(data.id);
        setSitterData(data);
        setStatus(data.status || "Waiting for approval");
        setExistingImages(data.imgUrls || []);

        methods.setValue("experience", data.experience ?? 0, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("tradeName", data.tradeName ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("introduction", data.introduction ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("services", data.services ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("description", data.description ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        // Split DB address into free-text prefix and structured suffix.
        // DB stores: "75/85, moo 6, Sao Thong Hin, Bang Yai, Nonthaburi"
        // We extract everything BEFORE the sub-district name as the user's custom detail.
        // If no sub-district is known yet, we store the whole string and refine later.
        methods.setValue("address", data.address ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });

        methods.setValue("latitude", data.latitude ?? 0, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("longitude", data.longitude ?? 0, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("status", data.status ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("images", [], { shouldDirty: false, shouldTouch: false, shouldValidate: false });
      } catch (err) {
        console.error("Failed to load sitter profile:", err);
      }
    };

    loadSitterProfile();
  }, []);

  // Reusable: populate address dropdowns from a PetSitterDetail object.
  // Called on initial load AND after every successful save so the UI always
  // reflects what is actually stored in the database.
  const populateAddressFields = useCallback(async (data: PetSitterDetail) => {
    if (provinces.length === 0) return;
    isPopulating.current = true;
    try {
      if (!data.province) return;
      const matchedProvince = provinces.find(
        (p) => p.name.toLowerCase() === data.province!.toLowerCase(),
      );
      if (!matchedProvince) return;
      methods.setValue("provinceId", matchedProvince.provinceId, { shouldDirty: false, shouldTouch: false, shouldValidate: false });

      const fetchedDistricts = await addressApi.getDistrictsByProvince(matchedProvince.provinceId);
      setDistricts(fetchedDistricts);
      if (!data.district || fetchedDistricts.length === 0) return;

      const matchedDistrict = fetchedDistricts.find(
        (d) => d.name.toLowerCase() === data.district!.toLowerCase(),
      );
      if (!matchedDistrict) return;
      methods.setValue("districtId", matchedDistrict.districtId, { shouldDirty: false, shouldTouch: false, shouldValidate: false });

      const fetchedSubDistricts = await addressApi.getSubDistrictsByDistrict(matchedDistrict.districtId);
      setSubDistricts(fetchedSubDistricts);
      if (!data.subDistrict || fetchedSubDistricts.length === 0) return;

      const matchedSubDistrict = fetchedSubDistricts.find(
        (sd) => sd.name.toLowerCase() === data.subDistrict!.toLowerCase(),
      );
      if (!matchedSubDistrict) return;
      methods.setValue("subDistrictId", matchedSubDistrict.subDistrictId, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
      methods.setValue(
        "postalCode",
        String(data.postCode || matchedSubDistrict.postCode || ""),
        { shouldDirty: false, shouldTouch: false, shouldValidate: false },
      );

    } finally {
      setTimeout(() => { isPopulating.current = false; }, 0);
    }
  }, [provinces, methods]);

  // populate address dropdowns once provinces are loaded
  useEffect(() => {
    if (!sitterData || provinces.length === 0) return;
    populateAddressFields(sitterData);
  }, [sitterData, provinces]);

  // resolve petType IDs once petTypes list is loaded
  useEffect(() => {
    if (!sitterData || petTypes.length === 0) return;

    const petTypeIds: number[] = [];
    sitterData.petTypes.forEach((petTypeName: string) => {
      const petType = petTypes.find((pt) => pt.name === petTypeName);
      if (petType) petTypeIds.push(petType.id);
    });
    methods.setValue("petTypeIds", petTypeIds);
  }, [sitterData, petTypes]);

  useEffect(() => {
    petApi.getTypes().then((data) => setPetTypes(data)).catch(() => setPetTypes([]));
  }, []);

  useEffect(() => {
    addressApi.getProvinces().then((data) => setProvinces(data)).catch(() => setProvinces([]));
  }, []);

  const provinceId = useWatch({ control: methods.control, name: "provinceId" });
  const districtId = useWatch({ control: methods.control, name: "districtId" });
  const subDistrictId = useWatch({ control: methods.control, name: "subDistrictId" });

  // Province change by user (not during population or external update)
  useEffect(() => {
    if (isPopulating.current || isExternalUpdate.current) return;
    if (provinceId && provinceId > 0) {
      addressApi
        .getDistrictsByProvince(provinceId)
        .then((data) => setDistricts(data))
        .catch(() => setDistricts([]));
    } else {
      setDistricts([]);
    }
    methods.setValue("districtId", 0);
    methods.setValue("subDistrictId", 0);
  }, [provinceId]);

  // District change by user (not during population or external update)
  useEffect(() => {
    if (isPopulating.current || isExternalUpdate.current) return;
    if (districtId && districtId > 0) {
      addressApi
        .getSubDistrictsByDistrict(districtId)
        .then((data) => setSubDistricts(data))
        .catch(() => setSubDistricts([]));
    } else {
      setSubDistricts([]);
    }
    methods.setValue("subDistrictId", 0);
  }, [districtId]);

  // SubDistrict change — update postal code and address
  useEffect(() => {
    if (isPopulating.current || isExternalUpdate.current) return;

    if (subDistrictId && subDistrictId > 0) {
      const selectedSubDistrict = subDistricts.find((sd) => sd.subDistrictId === subDistrictId);

      // Always sync postalCode when subDistrict changes — works for user dropdown
      // selection, map pin, AND DB load (populateAddressFields also sets it explicitly
      // so there is no conflict; last write wins and both write the same value)
      methods.setValue("postalCode", selectedSubDistrict ? String(selectedSubDistrict.postCode) : "", {
        shouldDirty: !isPopulating.current,
        shouldValidate: !isPopulating.current,
      });

    } else {
      methods.setValue("postalCode", "", {
        shouldDirty: !isPopulating.current,
        shouldValidate: !isPopulating.current,
      });
    }

  }, [subDistrictId, subDistricts, methods]);

  const onSubmit = async (data: SitterProfileFormValues) => {
    if (isUpdating) return;

    const errors = validateSitterProfile(data);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, error]) => {
        if (error) {
          setError(field as keyof SitterProfileFormValues, {
            type: error.type as string,
            message: error.message,
          });
        }
      });
      return;
    }

    if (!sitterId) {
      setError("root", { type: "server", message: "No sitter profile found. Please contact support." });
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updatePetSitterProfile(
        sitterId,
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
          existingImages: existingImages.map((url, index) => ({ url, order: index })),
        },
        data.images && data.images.length > 0 ? data.images : undefined,
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

      methods.setValue("images", []);

      // Re-fetch from DB and re-sync ALL form fields + dropdowns
      const { data: updatedData } = await getPetSitterById(String(sitterId));
      if (updatedData) {
        // Basic scalar fields
        methods.setValue("experience", updatedData.experience ?? 0, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("tradeName", updatedData.tradeName ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("introduction", updatedData.introduction ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("services", updatedData.services ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("description", updatedData.description ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("address", updatedData.address ?? "", { shouldDirty: false, shouldTouch: false, shouldValidate: false });

        methods.setValue("latitude", updatedData.latitude ?? 0, { shouldDirty: false, shouldTouch: false, shouldValidate: false });
        methods.setValue("longitude", updatedData.longitude ?? 0, { shouldDirty: false, shouldTouch: false, shouldValidate: false });

        // Images
        setExistingImages(updatedData.imgUrls || []);
        setImagesChanged(false);

        // Address dropdowns — re-populate from fresh DB data
        await populateAddressFields(updatedData);

        // Pet types
        if (petTypes.length > 0) {
          const updatedPetTypeIds: number[] = [];
          (updatedData.petTypes || []).forEach((name: string) => {
            const pt = petTypes.find((p) => p.name === name);
            if (pt) updatedPetTypeIds.push(pt.id);
          });
          methods.setValue("petTypeIds", updatedPetTypeIds, { shouldDirty: false });
        }

        // Mark form as pristine so the Save button disables again
        methods.reset(methods.getValues(), { keepValues: true, keepDirty: false, keepDefaultValues: false });
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

  return {
    methods,
    isSubmitting: formState.isSubmitting,
    isUpdating,
    onSubmit,
    petTypes,
    provinces,
    districts,
    subDistricts,
    status,
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