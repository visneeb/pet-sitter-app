export type ProfileFormValues = {
  name: string;
  email: string;
  phone: string;
};

export function validateProfile(data: ProfileFormValues) {
  const errors: Partial<Record<keyof ProfileFormValues, string>> = {};

  if (!data.name.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^\d+$/.test(data.phone)) {
    errors.phone = "Phone number must be numeric";
  }

  return errors;
}
