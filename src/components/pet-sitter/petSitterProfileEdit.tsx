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
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="flex flex-col gap-6">
        <ActionProfileHeader
          title="Pet Sitter Profile"
          status={<span className="text-green-500">Approved</span>}
          action={
            <ActionButton
              variant="primary"
              onClick={handleUpdate}
              disabled={isSubmitting}
            >
              Update
            </ActionButton>
          }
        />
        <div className="flex flex-col gap-6">
          <ProfileContainer>
            <div className="flex flex-col gap-15 px-4 lg:px-10">
              <Section title="Basic Information">
                <RHFAvatarUpload name="profile_image" label="Profile Image" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <RHFInput name="name" label="Your Name" required />
                  <RHFInput name="name" label="Experience" required />
                  <RHFInput name="email" label="Pet type" type="email" />
                  <RHFInput name="phone" label="Phone" type="tel" />
                </div>
              </Section>
            </div>
          </ProfileContainer>

          <ProfileContainer>
            <div className="flex flex-col gap-15 px-4 lg:px-10">
              <Section title="Pet Sitter">
                <RHFInput
                  name="name"
                  label="Pet sitter name(Trade Name)"
                  required
                />
                <RHFInput
                  name="email"
                  label="Services (Describe all of your service for pet sitting)"
                  type="email"
                />
                <RHFInput
                  name="phone"
                  label="My Place (Describe you place)"
                  type="tel"
                />
              </Section>
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
