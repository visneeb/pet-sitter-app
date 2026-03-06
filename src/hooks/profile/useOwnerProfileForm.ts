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

export interface OwnerProfileFormReturn
  extends Omit<BaseProfileFormReturn, OmittedBaseKeys> {}

export function useOwnerProfileForm(): OwnerProfileFormReturn {
  const {
    originalEmail: _oe,
    setOriginalEmail: _soe,
    pendingAvatarFile: _paf,
    removeAvatar: _ra,
    setIsUpdating: _siu,
    setResetData: _srd,
    setPendingData: _spd,
    setShowPasswordModal: _sspm,
    setIsAvatarDirty: _siad,
    setPendingAvatarFile: _spaf,
    setRemoveAvatar: _sra,
    ...publicBase
  } = useBaseProfileForm("owner");

  return publicBase;
}