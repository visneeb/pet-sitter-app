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
  PENDING: {
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

  // Tracks whether we're currently populating from server data
  // to prevent the provinceId watcher from resetting districts
  const isPopulating = useRef(false);

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
        const currentUser = await userApi.getCurrentUser();
        const id = currentUser.sitterId;
        if (!id) return;

        setSitterId(Number(id));

        const { data, error } = await getPetSitterById(String(id));
        if (error || !data) return;

        // Check if backend is now returning status
        console.log("Backend status check:", data.status);
        console.log("Status field exists:", "status" in data);

        // Backend is not returning status field, use fallback
        if (!("status" in data) || data.status === undefined) {
          (data as any).status = "Waiting for approval";
          console.log("Using fallback status");
        } else {
          console.log("Using backend status:", data.status);
        }

        setSitterData(data);
        setStatus((data as any).status ?? null);
        setExistingImages(data.imgUrls || []);

        // Use setTimeout to ensure this runs after all initial renders
        setTimeout(() => {
          isPopulating.current = true;

          const experience = data.experience ?? 0;
          const tradeName = data.tradeName ?? "";
          const introduction = data.introduction ?? "";
          const services = data.services ?? "";
          const description = data.description ?? "";
          const address = data.address ?? "";
          const latitude = data.latitude ?? 0;
          const longitude = data.longitude ?? 0;
          const status = data.status ?? "";

          methods.setValue("experience", experience, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("tradeName", tradeName, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("introduction", introduction, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("services", services, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("description", description, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("address", address, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("latitude", latitude, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("longitude", longitude, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("status", status, {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });
          methods.setValue("images", [], {
            shouldDirty: false,
            shouldTouch: false,
            shouldValidate: false,
          });

          isPopulating.current = false;
        }, 100);
      } catch (err) {
        console.error("Failed to load sitter profile:", err);
      }
    };

    loadSitterProfile();
  }, []);

  // Step 2: resolve petType IDs once petTypes list is loaded
  useEffect(() => {
    if (!sitterData || petTypes.length === 0) return;

    const petTypeIds: number[] = [];
    sitterData.petTypes.forEach((petTypeName: string) => {
      const petType = petTypes.find((pt) => pt.name === petTypeName);
      if (petType) petTypeIds.push(petType.id);
    });
    methods.setValue("petTypeIds", petTypeIds);
  }, [sitterData, petTypes]);

  // Step 3: resolve province/district/subDistrict once provinces list is loaded
  useEffect(() => {
    if (!sitterData || provinces.length === 0) return;

    const resolveAddress = async () => {
      const province = provinces.find((p) => p.name === sitterData.province);
      if (!province) return;

      isPopulating.current = true;
      methods.setValue("provinceId", province.provinceId);

      const fetchedDistricts = await addressApi.getDistrictsByProvince(
        province.provinceId,
      );
      setDistricts(fetchedDistricts);

      const district = fetchedDistricts.find(
        (d) => d.name === sitterData.district,
      );
      if (district) {
        methods.setValue("districtId", district.districtId);

        const fetchedSubDistricts = await addressApi.getSubDistrictsByDistrict(
          district.districtId,
        );
        setSubDistricts(fetchedSubDistricts);

        const subDistrict = fetchedSubDistricts.find(
          (sd) => sd.name === sitterData.subDistrict,
        );
        if (subDistrict) {
          methods.setValue("subDistrictId", subDistrict.subDistrictId);
          methods.setValue("postalCode", String(subDistrict.postCode));
        }
      }

      isPopulating.current = false;
    };

    resolveAddress();
  }, [sitterData, provinces]);

  // Load petTypes and provinces
  useEffect(() => {
    petApi
      .getTypes()
      .then((data) => setPetTypes(data))
      .catch(() => setPetTypes([]));
  }, []);

  useEffect(() => {
    addressApi
      .getProvinces()
      .then((data) => setProvinces(data))
      .catch(() => setProvinces([]));
  }, []);

  const provinceId = useWatch({ control: methods.control, name: "provinceId" });
  const districtId = useWatch({ control: methods.control, name: "districtId" });
  const subDistrictId = useWatch({
    control: methods.control,
    name: "subDistrictId",
  });

  // Province change by user (not during population)
  useEffect(() => {
    if (isPopulating.current) return;
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

  // District change by user (not during population)
  useEffect(() => {
    if (isPopulating.current) return;
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

  // SubDistrict change — update postal code
  useEffect(() => {
    if (isPopulating.current) return;
    if (subDistrictId && subDistrictId > 0) {
      const selectedSubDistrict = subDistricts.find(
        (sd) => sd.subDistrictId === subDistrictId,
      );
      methods.setValue(
        "postalCode",
        selectedSubDistrict ? String(selectedSubDistrict.postCode) : "",
      );
    } else {
      methods.setValue("postalCode", "");
    }
  }, [subDistrictId, subDistricts]);

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
      setError("root", {
        type: "server",
        message: "No sitter profile found. Please contact support.",
      });
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
          existingImages: existingImages.map((url, index) => ({
            url,
            order: index,
          })),
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

      const { data: updatedData } = await getPetSitterById(String(sitterId));
      if (updatedData) {
        setExistingImages(updatedData.imgUrls || []);
        setImagesChanged(false);
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
  };
}
