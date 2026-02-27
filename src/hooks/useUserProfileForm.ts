"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ProfileFormValues,
  validateProfile,
} from "@/lib/validations/profileValidation";
import { createResolver } from "@/lib/form/createResolver";
import {
  uploadAvatarApi,
  deleteAvatarApi,
} from "@/services/api/avatarApi";
import { userApi } from "@/services/api/userApi";
import { ImageFile } from "@/types/imageUploadType";

export function useUserProfileForm() {
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState(""); // ← track original
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormValues | null>(
    null,
  );

  const methods = useForm<ProfileFormValues>({
    mode: "onSubmit",
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
        const data = await userApi.getCurrentUser();

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

  //  Avatar

  const handleAvatarChange = async (file: ImageFile) => {
    const oldUrl = getValues("profile_img_url");

    if (!file) {
      if (oldUrl) await deleteAvatarApi(oldUrl);
      setValue("profile_img_url", "", { shouldValidate: false });
      clearErrors("profile_img_url");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("profile_img_url", {
        type: "manual",
        message: "Only JPG or PNG files are allowed.",
      });
      return;
    }

    if (file.size > maxSize) {
      setError("profile_img_url", {
        type: "manual",
        message: "File size must be under 5MB.",
      });
      return;
    }

    clearErrors("profile_img_url");

    try {
      setIsUploadingFile(true);

      if (oldUrl) await deleteAvatarApi(oldUrl);

      const result = await uploadAvatarApi(file);
      if (result.error) throw new Error(result.error);

      setValue("profile_img_url", result.publicUrl!, { shouldValidate: true });
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
    const emailChanged = data.email.trim() !== originalEmail.trim();

    if (emailChanged) {
      // Save data and show password modal
      setPendingData(data);
      setShowPasswordModal(true);
      return;
    }

    // Email unchanged
    await updateProfile(data);
  };

  const updateProfile = async (data: ProfileFormValues) => {
    try {
      // Get current user data from backend API
      const currentUser = await userApi.getCurrentUser();

      if (!currentUser) {
        throw new Error("No active session");
      }

      // Only update name and phone
      const payload = {
        name: data.name,
        phone: data.phone,
      };

      console.log("Updating profile with payload:", payload);

      // Update profile using backend API
      const result = await userApi.updateProfile(payload);

      console.log("Profile update response:", result);

      if (result.message) {
        console.log("Profile updated successfully");
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
    }
  };

  const onEmailConfirmed = async (password?: string) => {
    try {
      // Get current user data from backend API
      const currentUser = await userApi.getCurrentUser();

      if (!currentUser || !pendingData) {
        throw new Error("No active session or missing data");
      }

      // Prepare payload for email update
      const payload = {
        name: pendingData.name,
        phone: pendingData.phone,
        email: pendingData.email,
        password: password,
      };

      console.log("Updating email with payload:", payload);

      // Update email using backend API
      const result = await userApi.updateProfile(payload);

      console.log("Email update response:", result);

      if (result.message) {
        console.log("Email updated successfully");
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
    }
  };

  const onModalClose = () => {
    setShowPasswordModal(false);
    setPendingData(null);
  };

  return {
    methods,
    onSubmit,
    isSubmitting,
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
