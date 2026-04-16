"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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
  showPasswordModal: boolean;
  pendingData: ProfileFormValues | null;
  onEmailConfirmed: (password?: string) => Promise<void>;
  onModalClose: () => void;
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  isAvatarDirty: boolean;
  originalEmail: string;
  setOriginalEmail: (email: string) => void;
  pendingAvatarFile: File | null;
  removeAvatar: boolean;
  setIsUpdating: (val: boolean) => void;
  setResetData: (data: ProfileFormValues | null) => void;
  setPendingData: (data: ProfileFormValues | null) => void;
  setShowPasswordModal: (val: boolean) => void;
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

  const originalEmailRef = useRef("");
  const [originalEmail, _setOriginalEmail] = useState("");
  const setOriginalEmail = (email: string) => {
    originalEmailRef.current = email;
    _setOriginalEmail(email);
  };

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingData, setPendingData] = useState<ProfileFormValues | null>(
    null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [resetData, setResetData] = useState<ProfileFormValues | null>(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);

  // FIX: Memoize the resolver so it's created only ONCE, not on every render.
  // Previously `createResolver(validateProfile)` was passed inline to useForm(),
  // which created a new function reference every render — causing RHF to
  // re-register all fields and trigger setState during render (the crash).
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
          setOriginalEmail(data.email);
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
      } catch (error: any) {
        setProfileError(error.message || "Failed to load profile data");
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

    const emailChanged = data.email?.trim() !== originalEmailRef.current.trim();

    if (emailChanged) {
      setPendingData(data);
      setShowPasswordModal(true);
      return;
    }

    setIsUpdating(true);

    try {
      if (removeAvatar) {
        await ProfileService.removeAvatar(data, userRole);
      } else {
        await ProfileService.updateProfile(data, userRole, pendingAvatarFile);
      }

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
    } catch (error: any) {
      setError("root", {
        type: "server",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to update profile",
      });
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
        userRole,
        pendingAvatarFile,
      );

      if (result.message) {
        showCustomToast({
          title: "Email updated successfully",
          description: "Your email has been changed.",
          variant: "success",
        });

        router.refresh();

        setPendingAvatarFile(null);
        setRemoveAvatar(false);
        setIsAvatarDirty(false);
        setResetData(pendingData);
      }

      setOriginalEmail(pendingData.email ?? "");
      setShowPasswordModal(false);
      setPendingData(null);
    } catch (error: any) {
      setError("root", {
        type: "server",
        message:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
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
    isSubmitting,
    isUpdating,
    isLoadingProfile,
    profileError,
    handleAvatarChange,
    showPasswordModal,
    pendingData,
    onEmailConfirmed,
    onModalClose,
    onSubmit,
    isAvatarDirty,
    originalEmail,
    setOriginalEmail,
    pendingAvatarFile,
    removeAvatar,
    setIsUpdating,
    setResetData,
    setPendingData,
    setShowPasswordModal,
    setIsAvatarDirty,
    setPendingAvatarFile,
    setRemoveAvatar,
  };
}
