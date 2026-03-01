"use client";

import { FormProvider } from "@/components/form/FormProvider";
import { Input, AvatarUpload, SubmitButton } from "@/components/form/index";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";
import { ConfirmPasswordModal } from "@/components/profile/ConfirmPasswordModal";
import { ActionButton } from "@/components/ui/Button";

export default function ProfileEdit() {
  const {
    methods,
    onSubmit,
    isSubmitting,
    isUpdating,
    isUploadingFile,
    isLoadingProfile,
    profileError,
    handleAvatarChange,
    showPasswordModal,
    pendingData,
    onEmailConfirmed,
    onModalClose,
    isAvatarDirty,
  } = useUserProfileForm();

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (profileError) {
    const isAuthError =
      profileError.includes("session") ||
      profileError.includes("login") ||
      profileError.includes("Unauthorized");

    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="text-center flex flex-col items-center">
          <div className="text-red mb-4">Error loading profile</div>
          <div className="text-gray-600 mb-4">{profileError}</div>
          {isAuthError ? (
            <ActionButton
              variant="primary"
              onClick={() => (window.location.href = "/auth/login")}
            >
              Go to Login
            </ActionButton>
          ) : (
            <ActionButton
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </ActionButton>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <FormProvider
        methods={methods}
        onSubmit={onSubmit}
        disabled={isSubmitting || isUpdating}
      >
        <div className="flex flex-col gap-15">
          <AvatarUpload
            name="profile_img_url"
            onUpload={handleAvatarChange}
            isUploading={isUploadingFile}
          />

          <div className="space-y-10">
            <Input
              name="name"
              label="Your Name"
              placeholder="Enter your name"
              required
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                required
              />
              <Input
                name="phone"
                label="Phone"
                type="tel"
                placeholder="Enter your phone"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <SubmitButton
              isLoading={isSubmitting || isUpdating || isUploadingFile}
              requireValid={true}
              requireDirty={true}
              extraDirty={isAvatarDirty}
            >
              Update Profile
            </SubmitButton>
          </div>
        </div>
      </FormProvider>

      {showPasswordModal && pendingData && (
        <ConfirmPasswordModal
          newEmail={pendingData.email}
          onSuccess={onEmailConfirmed}
          onClose={onModalClose}
        />
      )}
    </>
  );
}
