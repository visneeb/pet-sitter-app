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
import { ImageFile } from "@/types/imageUploadType";

export function useUserProfileForm() {
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormValues | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [resetData, setResetData] = useState<ProfileFormValues | null>(null);

  const methods = useForm<ProfileFormValues>({
    mode: "onChange",
    resolver: createResolver(validateProfile),
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
    getValues,
    formState: { isSubmitting },
  } = methods;

  //  Load profile

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfileError(null);

        // Check if user has JWT token
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (!token) {
          setProfileError("No active session. Please login again.");
          setIsLoadingProfile(false);
          return;
        }

        // Get user profile from backend API
        const data = await ProfileService.getCurrentProfile();

        if (data) {
          setOriginalEmail(data.email);
          methods.reset({
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
            profile_img_url: data.profileImgUrl || "",
          });
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
    }
  }, [resetData, methods]);

  //  Avatar

  const handleAvatarChange = async (file: ImageFile) => {
    const oldUrl = getValues("profile_img_url");

    if (!file) {
      if (oldUrl) await ProfileService.deleteAvatar(oldUrl);
      setValue("profile_img_url", "", { shouldValidate: false });
      clearErrors("profile_img_url");
      return;
    }

    // Validate file
    const validation = ProfileService.validateAvatar(file);
    if (!validation.isValid) {
      setError("profile_img_url", {
        type: "manual",
        message: validation.error!,
      });
      return;
    }

    clearErrors("profile_img_url");

    try {
      setIsUploadingFile(true);
      const publicUrl = await ProfileService.uploadAvatar(file, oldUrl);
      setValue("profile_img_url", publicUrl, { shouldValidate: true });
    } catch (err: any) {
      setError("profile_img_url", {
        type: "server",
        message: err.message ?? "Failed to upload image.",
      });
    } finally {
      setIsUploadingFile(false);
    }
  };

  //  Submit

  const onSubmit = async (data: ProfileFormValues) => {
    if (isUpdating) return;

    const emailChanged = data.email.trim() !== originalEmail.trim();

    if (emailChanged) {
      // Save data and show password modal
      setPendingData(data);
      setShowPasswordModal(true);
      return;
    }
    setIsUpdating(true);
    // Email unchanged
    await updateProfile(data);
  };

  const updateProfile = async (data: ProfileFormValues) => {
    try {
      // Update profile using service
      const result = await ProfileService.updateProfile(data);

      if (result.message) {
        console.log("Profile updated successfully");
        showCustomToast({
          title: "Profile updated successfully",
          description: "Your changes have been saved.",
          variant: "success",
        });
        // Trigger form reset via useEffect to avoid render issues
        setResetData(data);
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      console.error("Error response:", error.response?.data);

      setError("root", {
        type: "server",
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to update profile",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onEmailConfirmed = async (password?: string) => {
    try {
      if (!pendingData) {
        throw new Error("No pending data");
      }

      // Update email using service
      const result = await ProfileService.updateProfileWithEmail(
        pendingData,
        password!,
      );

      if (result.message) {
        console.log("Email updated successfully");
        showCustomToast({
          title: "Email updated successfully",
          description: "Your email has been changed.",
          variant: "success",
        });
        // Trigger form reset via useEffect to avoid render issues
        setResetData(pendingData);
      }

      setOriginalEmail(pendingData?.email ?? "");
      setShowPasswordModal(false);
      setPendingData(null);
    } catch (error: any) {
      console.error("Email update error:", error);
      console.error("Error response:", error.response?.data);

      setError("root", {
        type: "server",
        message:
          error.response?.data?.error ||
          error.message ||
          "Failed to update email",
      });
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
    isUploadingFile,
    profileError,
    handleAvatarChange,
    showPasswordModal,
    pendingData,
    onEmailConfirmed: (password?: string) => onEmailConfirmed(password),
    onModalClose,
  };
}
