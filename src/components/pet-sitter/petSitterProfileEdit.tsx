"use client";

import { FormProvider } from "@/components/form/FormProvider";
import {
  AvatarUpload,
  Input,
  SubmitButton,
  Textarea,
  MultiSelect,
  MultiImageUpload,
  Select,
} from "@/components/form/index";
import { useBaseProfileForm } from "@/hooks/profile/useBaseProfileForm";
import { usePetSitterForm } from "@/hooks/profile/usePetSitterProfileForm";
import { ConfirmPasswordModal } from "@/components/profile/ConfirmPasswordModal";
import { ActionProfileHeader } from "@/components/profile/ProfileHeader";
import { ActionButton } from "../ui/Button";
import Section from "@/components/form/FormSection";
import ProfileContainer from "@/components/profile/ProfileContainer";
import cn from "@/utils/cn";

export default function ProfileEdit() {
  const {
    methods: baseMethods,
    isSubmitting: baseIsSubmitting,
    isUpdating: baseIsUpdating,
    isLoadingProfile,
    profileError,
    handleAvatarChange,
    showPasswordModal,
    pendingData,
    onEmailConfirmed,
    onModalClose,
    isAvatarDirty,
    onSubmit: onBasicSubmit,
  } = useBaseProfileForm("sitter");

  const {
    methods: sitterMethods,
    isSubmitting: sitterIsSubmitting,
    isUpdating: sitterIsUpdating,
    onSubmit: onSitterSubmit,
    petTypes,
    provinces,
    districts,
    subDistricts,
    statusConfig,
    status,
    existingImages,
    removeExistingImage,
    reorderExistingImages,
    imagesChanged,
  } = usePetSitterForm();

  const postalCode = sitterMethods.watch("postalCode");

  const petTypeOptions = petTypes.map((pet) => ({
    value: pet.id,
    label: pet.name,
  }));

  if (isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
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
      <FormProvider methods={baseMethods} onSubmit={onBasicSubmit}>
        <div className="flex flex-col gap-6 pb-6">
          <ActionProfileHeader
            title="Basic Information"
            action={
              <SubmitButton
                isLoading={baseIsSubmitting || baseIsUpdating}
                requireValid={true}
                requireDirty={true}
                extraDirty={isAvatarDirty}
              >
                Update Basic Info
              </SubmitButton>
            }
          />
          <ProfileContainer>
            <div className="flex flex-col gap-15 px-6">
              <Section title="Basic Information">
                <AvatarUpload
                  name="profile_img_url"
                  label="Profile Image"
                  onUpload={handleAvatarChange}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <Input
                    name="name"
                    label="Your Name"
                    placeholder="Enter your name"
                    required
                  />
                  <Input
                    name="phone"
                    label="Phone"
                    type="tel"
                    placeholder="Enter your phone"
                    required
                  />
                  <Input
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </Section>
            </div>
          </ProfileContainer>
        </div>
      </FormProvider>

      <FormProvider methods={sitterMethods} onSubmit={onSitterSubmit}>
        <div className="flex flex-col gap-6 pb-20">
          <ActionProfileHeader
            title="Pet Sitter Profile"
            status={
              status && (
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      statusConfig[status]?.bg,
                    )}
                  />
                  <span className={statusConfig[status]?.text}>{status}</span>
                </span>
              )
            }
            action={
              <SubmitButton
                isLoading={sitterIsSubmitting || sitterIsUpdating}
                requireValid={true}
                requireDirty={true}
                extraDirty={imagesChanged}
              >
                Update Sitter Info
              </SubmitButton>
            }
          />
          <ProfileContainer>
            <div className="flex flex-col gap-15 px-6">
              <Section title="Pet Sitter">
                <Input
                  name="experience"
                  label="Experience"
                  placeholder="Enter your experience"
                  required
                />
                <Input
                  name="tradeName"
                  label="Pet Sitter Name (Trade Name)"
                  placeholder="Enter your trade name"
                  required
                />
                <MultiSelect
                  options={petTypeOptions}
                  placeholder="Select pet types"
                  name="petTypeIds"
                  label="Pet Types"
                  convertToNumbers={true}
                  required
                />
                <Textarea
                  name="introduction"
                  label="Introduction"
                  placeholder="Describe yourself as a pet sitter"
                />
                <Textarea
                  rows={6}
                  name="services"
                  placeholder="Enter your services"
                  label="Services"
                />
                <Textarea
                  rows={6}
                  name="description"
                  placeholder="Enter your living space and facilities"
                  label="My Place"
                />
                <div className="">
                  <MultiImageUpload
                    label="Image Gallery (Maximum 10 images)"
                    name="images"
                    existingImages={existingImages}
                    onDeleteImage={removeExistingImage}
                    onReorderExisting={reorderExistingImages}
                  />
                  <span className="style-body-3 text-gray-300">
                    **The first image will be used as the sitter card cover.
                  </span>
                </div>
              </Section>
            </div>
          </ProfileContainer>

          <ProfileContainer>
            <div className="flex flex-col gap-15 px-6">
              <Section title="Address">
                <Input
                  name="address"
                  label="Address detail"
                  placeholder="Enter your address"
                  required
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <Select
                    name="provinceId"
                    label="Province"
                    placeholder="Select province"
                    required
                    asNumber={true}
                  >
                    {provinces.map((province) => (
                      <option
                        key={province.provinceId}
                        value={province.provinceId}
                      >
                        {province.name}
                      </option>
                    ))}
                  </Select>
                  <Select
                    name="districtId"
                    label="District"
                    placeholder="Select district"
                    required
                    asNumber={true}
                  >
                    {districts.map((district) => (
                      <option
                        key={district.districtId}
                        value={district.districtId}
                      >
                        {district.name}
                      </option>
                    ))}
                  </Select>
                  <Select
                    name="subDistrictId"
                    label="Sub District"
                    placeholder="Select subdistrict"
                    required
                    asNumber={true}
                  >
                    {subDistricts.map((subDistrict) => (
                      <option
                        key={subDistrict.subDistrictId}
                        value={subDistrict.subDistrictId}
                      >
                        {subDistrict.name}
                      </option>
                    ))}
                  </Select>
                  <Input
                    label="Postal Code"
                    name="postalCode"
                    value={postalCode || ""}
                    placeholder="Enter postal code"
                    required
                  />

                  <></>
                </div>
              </Section>
            </div>
          </ProfileContainer>
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
