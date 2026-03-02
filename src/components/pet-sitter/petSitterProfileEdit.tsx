"use client";

import { FormProvider } from "@/components/form/FormProvider";
import { Input, AvatarUpload, SubmitButton } from "@/components/form/index";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";
import { ConfirmPasswordModal } from "@/components/profile/ConfirmPasswordModal";
import { ActionProfileHeader } from "@/components/profile/ProfileHeader";
import { ActionButton } from "../ui/Button";
import Section from "@/components/form/FormSection";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { RHFInput } from "@/components/form/RHFInput";

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
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <div className="flex flex-col gap-6">
          <ActionProfileHeader
            title="Pet Sitter Profile"
            status={<span className="text-green-500">Approved</span>}
            action={
              <ActionButton variant="primary" disabled={isSubmitting}>
                Update
              </ActionButton>
            }
          />
          <div className="pr-8 flex flex-col gap-6">
            <ProfileContainer>
              <div className="flex flex-col gap-15 px-6">
                <Section title="Basic Information">
                  <AvatarUpload name="profile_img_url" label="Profile Image" />

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <RHFInput name="name" label="Your Name" required />
                    <RHFInput name="experience" label="Experience" required />
                    <RHFInput name="petType" label="Pet Type" />
                    <RHFInput name="phone" label="Phone" type="tel" />
                  </div>
                </Section>
              </div>
            </ProfileContainer>

            <ProfileContainer>
              <div className="flex flex-col gap-15 px-6">
                <Section title="Pet Sitter">
                  <RHFInput
                    name="tradeName"
                    label="Pet Sitter Name (Trade Name)"
                    required
                  />
                  <RHFInput
                    name="services"
                    label="Services (Describe all of your services for pet sitting)"
                  />
                  <RHFInput
                    name="placeDescription"
                    label="My Place (Describe your place)"
                  />
                </Section>
              </div>
            </ProfileContainer>
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
