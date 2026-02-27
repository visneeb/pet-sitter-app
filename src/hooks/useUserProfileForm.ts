"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";
import {
  ProfileFormValues,
  validateProfile,
} from "@/lib/validations/profileValidation";
import { createResolver } from "@/lib/form/createResolver";
import {
  uploadAvatarApi,
  deleteAvatarApi,
  getProfileApi,
  updateProfileApi,
} from "@/services/api/avatarApi";
import { ImageFile } from "@/types/imageUploadType";

export function useUserProfileForm() {
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
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
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user?.email) {
          setOriginalEmail(user.email);
          methods.setValue("email", user.email);
        }

        const data = await getProfileApi();

        if (data) {
          methods.reset({
            name: data.name ?? "",
            phone: data.phone ?? "",
            email: data.email ?? user?.email ?? "",
            profile_img_url: data.profileImgUrl ?? "",
          });
        }
      } catch {
        // leave defaults
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
      // Save data and show password modal — don't update yet
      setPendingData(data);
      setShowPasswordModal(true);
      return;
    }

    // Email unchanged — update profile fields only
    await updateProfile(data);
  };

  const updateProfile = async (data: ProfileFormValues) => {
    const result = await updateProfileApi({
      name: data.name,
      phone: data.phone,
      profileImgUrl: data.profile_img_url ?? "",
    });

    if (result.error) {
      setError("root", { type: "server", message: result.error });
    }
  };

  const onEmailConfirmed = async () => {
    // Email changed successfully — now update the rest of the fields
    if (pendingData) await updateProfile(pendingData);
    setOriginalEmail(pendingData?.email ?? "");
    setShowPasswordModal(false);
    setPendingData(null);
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
    handleAvatarChange,
    showPasswordModal,
    pendingData,
    onEmailConfirmed,
    onModalClose,
  };
}
