// Form Provider and Wrapper
export { FormProvider as Form } from "./FormProvider";
// Input Components - User-friendly names
export { RHFInput as Input } from "./RHFInput";
export { RHFPassword as PasswordInput } from "./RHFPassword";
export { RHFTextarea as Textarea } from "./RHFTextarea";
export { RHFSelect as Select } from "./RHFSelect";
export { RHFMultiSelect as MultiSelect } from "./RHFMultiSelect";

// Form Structure Components
export { default as FormSection } from "./FormSection";
export { SubmitButton as Submit } from "./FormSubmitButton";

// Image Upload Components
export { RHFAvatarUpload as AvatarUpload } from "./image-upload/RHFAvatarUpload";
export { MultiImageUpload as MultiImageUpload } from "./image-upload/MultiImageUpload";
export { AvatarUpload as BasicAvatarUpload } from "./image-upload/AvatarUpload";

// Example
export { FormExample as FormDemo } from "./FormExample";

// Also export original names for backward compatibility
export { FormProvider } from "./FormProvider";
export { RHFInput } from "./RHFInput";
export { RHFPassword } from "./RHFPassword";
export { RHFTextarea } from "./RHFTextarea";
export { RHFSelect } from "./RHFSelect";
export { RHFMultiSelect } from "./RHFMultiSelect";
export { SubmitButton } from "./FormSubmitButton";
export { RHFAvatarUpload } from "./image-upload/RHFAvatarUpload";
