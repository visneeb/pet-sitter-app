"use client";

import { FormProvider } from "@/components/form/FormProvider";
import { Input } from "@/components/form/index";
import { SubmitButton } from "@/components/form/FormSubmitButton";
import { useUserProfileForm } from "@/hooks/useUserProfileForm";
import { RHFAvatarUpload } from "@/components/form/image-upload/RHFAvatarUpload";

export default function ProfileEdit() {
  const { methods, onSubmit, isSubmitting } = useUserProfileForm();

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} disabled={isSubmitting}>
      <div className="flex flex-col gap-15">
        <RHFAvatarUpload name="profile_image" />
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
          <SubmitButton isLoading={isSubmitting}>Update Profile</SubmitButton>
        </div>
      </div>
    </FormProvider>
  );
}
