"use client";

import {
  useBaseProfileForm,
  BaseProfileFormReturn,
} from "./useBaseProfileForm";

type OmittedBaseKeys =
  | "originalEmail"
  | "setOriginalEmail"
  | "pendingAvatarFile"
  | "removeAvatar"
  | "setIsUpdating"
  | "setResetData"
  | "setPendingData"
  | "setShowPasswordModal"
  | "setIsAvatarDirty"
  | "setPendingAvatarFile"
  | "setRemoveAvatar";

export interface OwnerProfileFormReturn extends Omit<
  BaseProfileFormReturn,
  OmittedBaseKeys | "onSubmit"
> {
  onSubmit: () => void;
}

export function useOwnerProfileForm(): OwnerProfileFormReturn {
  const {
    pendingAvatarFile: _paf,
    removeAvatar: _ra,
    setIsUpdating: _siu,
    setResetData: _srd,
    setIsAvatarDirty: _siad,
    setPendingAvatarFile: _spaf,
    setRemoveAvatar: _sra,
    onSubmit,
    methods,
    ...publicBase
  } = useBaseProfileForm("owner");

  return {
    ...publicBase,
    methods,
    onSubmit: () => methods.handleSubmit(onSubmit)(),
  };
}
