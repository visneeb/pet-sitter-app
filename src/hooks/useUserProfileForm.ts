"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ProfileFormValues,
  validateProfile,
} from "@/lib/validations/profileValidation";
import { createResolver } from "@/lib/form/createResolver";
import { ProfileService } from "@/services/profileService";
import { showCustomToast } from "@/components/ui/toast/Toast";
import { buildFormData } from "@/lib/utils/formData";

export function useUserProfileForm() {
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormValues | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [resetData, setResetData] = useState<ProfileFormValues | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  const [isAvatarDirty, setIsAvatarDirty] = useState(false);

  const methods = useForm<ProfileFormValues>({
    mode: "onTouched",
    resolver: createResolver(validateProfile),
    shouldUnregister: false,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      profile_img_url: "",
    },
  });

  const {
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = methods;

  // Load profile
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

        const data = await ProfileService.getCurrentProfile();

        if (data) {
          setOriginalEmail(data.email);
          setTimeout(() => {
            methods.reset({
              name: data.name || "",
              phone: data.phone || "",
              email: data.email || "",
              profile_img_url: data.profileImgUrl || "",
            });
          }, 0);
        }
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        setProfileError(error.message || "Failed to load profile data");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  // Handle form reset when resetData changes
  useEffect(() => {
    if (resetData) {
      methods.reset(resetData);
      setResetData(null);
      // Clear avatar dirty flag after successful save
      setIsAvatarDirty(false);
    }
  }, [resetData, methods]);

  // Avatar change — store file locally, mark avatar as dirty
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

  // Submit
  const onSubmit = async (data: ProfileFormValues) => {
    if (isUpdating) return;

    const emailChanged = data.email.trim() !== originalEmail.trim();

    if (emailChanged) {
      setPendingData(data);
      setShowPasswordModal(true);
      return;
    }

    setIsUpdating(true);
    await updateProfile(data);
  };

  const updateProfile = async (data: ProfileFormValues) => {
    try {
      let result;

      if (removeAvatar) {
        result = await ProfileService.removeAvatar(data);
      } else {
        result = await ProfileService.updateProfile(data, pendingAvatarFile);
      }

      if (result.message) {
        showCustomToast({
          title: "Profile updated successfully",
          description: "Your changes have been saved.",
          variant: "success",
        });

        setPendingAvatarFile(null);
        setRemoveAvatar(false);
        setIsAvatarDirty(false);
        setResetData(data);
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update profile";

      console.error("Profile update failed:", message);
      console.error("Status:", error?.response?.status);
      console.error("Sent payload:", error?.config?.data);

      setError("root", { type: "server", message });
    } finally {
      setIsUpdating(false);
    }
  };

  const onEmailConfirmed = async (password?: string) => {
    if (!pendingData) {
      setError("root", { type: "server", message: "No pending data" });
      return;
    }
    if (!password?.trim()) {
      setError("root", { type: "server", message: "Password is required" });
      return;
    }

    setIsUpdating(true);

    try {
      const result = await ProfileService.updateProfileWithEmail(
        pendingData,
        password,
        pendingAvatarFile,
      );

      if (result.message) {
        showCustomToast({
          title: "Email updated successfully",
          description: "Your email has been changed.",
          variant: "success",
        });
        setPendingAvatarFile(null);
        setRemoveAvatar(false);
        setIsAvatarDirty(false);
        setResetData(pendingData);
      }

      setOriginalEmail(pendingData.email ?? "");
      setShowPasswordModal(false);
      setPendingData(null);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update email";

      console.error("Email update failed:", message);
      console.error("Status:", error?.response?.status);

      setError("root", { type: "server", message });
    } finally {
      setIsUpdating(false);
    }
  };

  const onModalClose = () => {
    setShowPasswordModal(false);
    setPendingData(null);
    setIsUpdating(false);
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
    isUpdating,
    isLoadingProfile,
    isUploadingFile: false,
    profileError,
    handleAvatarChange,
    showPasswordModal,
    pendingData,
    onEmailConfirmed,
    onModalClose,
    isAvatarDirty,
  };
}
