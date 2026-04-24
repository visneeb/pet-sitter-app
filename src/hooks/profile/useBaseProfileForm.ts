"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import {
  ProfileFormValues,
  validateProfile,
} from "@/lib/validations/profileValidation";
import { createResolver } from "@/lib/form/createResolver";
import { ProfileService } from "@/services/profileService";
import { userApi } from "@/services/api/user";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { useRouter } from "next/navigation";

export interface BaseProfileFormReturn {
  methods: UseFormReturn<ProfileFormValues>;
  isSubmitting: boolean;
  isUpdating: boolean;
  isLoadingProfile: boolean;
  profileError: string | null;
  handleAvatarChange: (file: File | null) => Promise<void>;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isAvatarDirty: boolean;
  pendingAvatarFile: File | null;
  removeAvatar: boolean;
  setIsUpdating: (val: boolean) => void;
  setResetData: (data: ProfileFormValues | null) => void;
  setIsAvatarDirty: (val: boolean) => void;
  setPendingAvatarFile: (file: File | null) => void;
  setRemoveAvatar: (val: boolean) => void;
}

export function useBaseProfileForm(
  userRole: "owner" | "sitter" = "owner",
): BaseProfileFormReturn {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState(false);
  const [resetData, setResetData] = useState<ProfileFormValues | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);

  const resolver = useMemo(() => createResolver(validateProfile), []);

  const methods = useForm<ProfileFormValues>({
    mode: "onBlur",
    resolver,
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      idNumber: "",
      dateOfBirth: null,
      profile_img_url: "",
    },
  });

  const {
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileError(null);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (!token) {
          setTimeout(() => {
            setProfileError("No active session. Please login again.");
            setIsLoadingProfile(false);
          }, 0);
          return;
        }

        const data = await userApi.getCurrentUser();

        if (data) {
          setTimeout(() => {
            reset({
              name: data.name || "",
              phone: data.phone || "",
              email: data.email || "",
              idNumber: data.idNumber || "",
              dateOfBirth: data.dateOfBirth
                ? new Date(data.dateOfBirth + "T00:00:00+00:00")
                : null,
              profile_img_url: data.profileImgUrl || "",
            });
          }, 0);
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to load profile data";
        setProfileError(message);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (!errors.root?.message) return;
    showCustomToast({
      title: "Failed to update profile",
      description: errors.root.message,
      variant: "error",
    });
  }, [errors.root?.message]);

  useEffect(() => {
    if (resetData) {
      reset(resetData);
      setResetData(null);
      setIsAvatarDirty(false);
    }
  }, [resetData, reset]);

  const handleAvatarChange = async (file: File | null) => {
    if (!file) {
      setPendingAvatarFile(null);
      setRemoveAvatar(true);
      setIsAvatarDirty(true);
      setValue("profile_img_url", "", { shouldValidate: false });
      clearErrors("profile_img_url");
      return;
    }

    const validation = ProfileService.validateAvatar(file);
    if (!validation.isValid) {
      setError("profile_img_url", {
        type: "manual",
        message: validation.error!,
      });
      return;
    }

    clearErrors("profile_img_url");
    setRemoveAvatar(false);
    setPendingAvatarFile(file);
    setIsAvatarDirty(true);

    const blobUrl = URL.createObjectURL(file);
    setValue("profile_img_url", blobUrl, { shouldValidate: false });
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      await userApi.updateBasicProfile(
        data,
        removeAvatar ? null : pendingAvatarFile,
        removeAvatar,
        userRole,
      );

      showCustomToast({
        title: "Profile updated successfully",
        description: "Your basic information has been saved.",
        variant: "success",
      });

      router.refresh();
      setPendingAvatarFile(null);
      setRemoveAvatar(false);
      setIsAvatarDirty(false);
      setResetData(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      setError("root", {
        type: "server",
        message:
          (error as any)?.response?.data?.message ||
          (error as any)?.response?.data?.error ||
          message,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    methods,
    isSubmitting,
    isUpdating,
    isLoadingProfile,
    profileError,
    handleAvatarChange,
    onSubmit,
    isAvatarDirty,
    pendingAvatarFile,
    removeAvatar,
    setIsUpdating,
    setResetData,
    setIsAvatarDirty,
    setPendingAvatarFile,
    setRemoveAvatar,
  };
}
