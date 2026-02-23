"use client";

import { FormProvider } from "@/components/form/FormProvider";
import { RHFInput } from "@/components/form/RHFInput";
import { useProfileForm } from "@/hooks/useUserProfileForm";
import { RHFAvatarUpload } from "@/components/form/image-upload/RHFAvatarUpload";
import Section from "@/components/form/FormSection";
import ProfileContainer from "@/components/profile/ProfileContainer";
import { PetSitterProfileHeader } from "@/components/profile/ProfileHeader";
import { ActionButton } from "@/components/ui/Button";

//add usePetSitterProfileForm hook

export default function SitterProfileEdit() {
  const { methods, onSubmit, isSubmitting } = useProfileForm();

  const handleUpdate = () => {
    // TODO: Implement update logic
    if (isSubmitting) return;
    console.log("Update profile");
  };

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div className="flex flex-col gap-6">
        <PetSitterProfileHeader
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
        <div className="pr-8 flex flex-col gap-6">
          <ProfileContainer>
            <div className="flex flex-col gap-15 px-6">
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
            <div className="flex flex-col gap-15 px-6">
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
          </ProfileContainer>
        </div>
      </div>
    </FormProvider>
  );
}
