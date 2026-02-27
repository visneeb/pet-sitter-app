"use client";

import { FormProvider } from "@/components/form/FormProvider";
import { Input, AvatarUpload, SubmitButton } from "@/components/form/index";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";
import { ConfirmPasswordModal } from "@/components/profile/ConfirmPasswordModal";

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
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading profile</div>
          <div className="text-gray-600 mb-4">{profileError}</div>
          {isAuthError ? (
            <button
              onClick={() => (window.location.href = "/auth/login")}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Go to Login
            </button>
          ) : (
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
            >
              Retry
            </button>
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
            >
              Update Profile
            </SubmitButton>
          </div>
        </div>
      </FormProvider>

      {/* Password confirmation modal — only shows when email changed */}
      {showPasswordModal && pendingData && (
        <ConfirmPasswordModal
          newEmail={pendingData.email}
          onSuccess={onEmailConfirmed}
          onClose={onModalClose}
        />
      )}
      {}
    </>
  );
}
