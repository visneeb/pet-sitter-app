"use client";

import { FormProvider } from "@/components/form/FormProvider";
import { RHFInput } from "@/components/form/RHFInput";
import { SubmitButton } from "@/components/form/FormSubmitButton";
import { useProfileForm } from "@/hooks/useUserProfileForm";
import { RHFAvatarUpload } from "@/components/form/image-upload/RHFAvatarUpload";

export default function ProfileEdit() {
  const { methods, onSubmit, isSubmitting } = useProfileForm();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <div>
        <div className="flex flex-col gap-15">
          <RHFAvatarUpload name="profile_image" />
          <div className="space-y-10">
            <RHFInput name="name" label="Your Name" required />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <RHFInput name="email" label="Email" type="email" required />
              <RHFInput name="phone" label="Phone" type="tel" required />
            </div>
          </div>
          <div className="flex justify-end">
            <SubmitButton isLoading={isSubmitting}>Update Profile</SubmitButton>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
