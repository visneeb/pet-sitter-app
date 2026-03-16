import { FieldErrors } from "react-hook-form";
import { ProfileFormValues } from "./profileValidation";

export interface SitterProfileFormValues extends ProfileFormValues {
  experience: number | null;
  tradeName: string;
  petTypeIds: number[];
  introduction?: string;
  services?: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  provinceId: number;
  districtId: number;
  subDistrictId: number;
  postalCode?: string;
  status?: string;
  images: File[];
}

export function validateSitterProfile(
  data: SitterProfileFormValues,
): FieldErrors<SitterProfileFormValues> {
  const errors: FieldErrors<SitterProfileFormValues> = {};

  // Only validate basic profile fields if they exist
  if (data.name !== undefined) {
    if (!data.name?.trim()) {
      errors.name = { type: "required", message: "Name is required" };
    }
  }

  if (data.email !== undefined) {
    if (!data.email?.trim()) {
      errors.email = { type: "required", message: "Email is required" };
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.email = { type: "pattern", message: "Invalid email format" };
    }
  }

  if (data.phone !== undefined) {
    if (!data.phone?.trim()) {
      errors.phone = { type: "required", message: "Phone is required" };
    } else if (!/^\d+$/.test(data.phone)) {
      errors.phone = {
        type: "pattern",
        message: "Phone number must be numeric",
      };
    } else if (!/^\d{10}$/.test(data.phone) || !data.phone.startsWith("0")) {
      errors.phone = {
        type: "pattern",
        message: "Phone must start with 0 and be 10 digits.",
      };
    }
  }

  // experience: 0 ≤ x < 100, max 1 decimal
  if (data.experience === undefined || data.experience === null) {
    errors.experience = { type: "required", message: "Experience is required" };
  } else if (data.experience < 0 || data.experience >= 100) {
    errors.experience = {
      type: "range",
      message: "Experience must be between 0 and 99.9",
    };
  } else if (!/^\d+(\.\d)?$/.test(String(data.experience))) {
    errors.experience = {
      type: "pattern",
      message: "Experience can have at most 1 decimal place",
    };
  }

  // tradeName: 5–50 chars
  if (!data.tradeName?.trim()) {
    errors.tradeName = { type: "required", message: "Trade name is required" };
  } else if (data.tradeName.trim().length < 5) {
    errors.tradeName = {
      type: "minLength",
      message: "Trade name must be at least 5 characters",
    };
  } else if (data.tradeName.trim().length > 50) {
    errors.tradeName = {
      type: "maxLength",
      message: "Trade name must be at most 50 characters",
    };
  }

  // petTypeIds: at least one
  if (!data.petTypeIds || data.petTypeIds.length === 0) {
    errors.petTypeIds = {
      type: "required",
      message: "Select at least one pet type",
    };
  }

  // introduction: optional, but ≥ 10 chars if provided
  if (data.introduction && data.introduction.trim().length < 10) {
    errors.introduction = {
      type: "minLength",
      message: "Introduction must be at least 10 characters",
    };
  }

  // services: optional, but ≥ 10 chars if provided
  if (data.services && data.services.trim().length < 10) {
    errors.services = {
      type: "minLength",
      message: "Services must be at least 10 characters",
    };
  }

  // description: optional, but ≥ 10 chars if provided
  if (data.description && data.description.trim().length < 10) {
    errors.description = {
      type: "minLength",
      message: "Description must be at least 10 characters",
    };
  }

  // address: 10–100 chars
  if (!data.address?.trim()) {
    errors.address = { type: "required", message: "Address is required" };
  } else if (data.address.trim().length < 10) {
    errors.address = {
      type: "minLength",
      message: "Address must be at least 10 characters",
    };
  } else if (data.address.trim().length > 100) {
    errors.address = {
      type: "maxLength",
      message: "Address must be at most 100 characters",
    };
  }

  // Add these checks in validateSitterProfile
  if (!data.provinceId || data.provinceId <= 0) {
    errors.provinceId = { type: "required", message: "Province is required" };
  }
  if (!data.districtId || data.districtId <= 0) {
    errors.districtId = { type: "required", message: "District is required" };
  }
  if (!data.subDistrictId || data.subDistrictId <= 0) {
    errors.subDistrictId = {
      type: "required",
      message: "Sub district is required",
    };
  }

  // latitude: optional, -90 to 90 if provided
  if (data.latitude !== undefined && data.latitude !== null) {
    if (data.latitude < -90 || data.latitude > 90) {
      errors.latitude = {
        type: "range",
        message: "Latitude must be between -90 and 90",
      };
    }
  }

  // longitude: optional, -180 to 180 if provided
  if (data.longitude !== undefined && data.longitude !== null) {
    if (data.longitude < -180 || data.longitude > 180) {
      errors.longitude = {
        type: "range",
        message: "Longitude must be between -180 and 180",
      };
    }
  }

  // postalCode
  if (data.postalCode && data.postalCode.trim()) {
    if (!/^\d+$/.test(data.postalCode.trim())) {
      errors.postalCode = {
        type: "pattern",
        message: "Postal code must be numeric",
      };
    } else if (
      data.postalCode.trim().length < 3 ||
      data.postalCode.trim().length > 10
    ) {
      errors.postalCode = {
        type: "length",
        message: "Postal code must be 3-10 digits",
      };
    }
  }

  // images: maximum 10 images
  if (data.images && data.images.length > 10) {
    errors.images = {
      type: "max",
      message: "Maximum 10 images allowed",
    };
  }

  return errors;
}
