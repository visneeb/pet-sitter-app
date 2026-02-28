"use client";

import { useForm, FormProvider } from "react-hook-form";
import {
  Input,
  PasswordInput,
  Select,
  Textarea,
  MultiSelect,
  Submit,
} from "./index";

// Example form data types
type ExampleFormValues = {
  firstName: string;
  email: string;
  password: string;
  country: string;
  bio: string;
  interests: string[];
};

// Example options for select/multi-select
const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
];

const interests = [
  { value: "sports", label: "Sports" },
  { value: "music", label: "Music" },
  { value: "travel", label: "Travel" },
];

// Example usage component
export function FormExample() {
  const methods = useForm<ExampleFormValues>({
    defaultValues: {
      firstName: "",
      email: "",
      password: "",
      country: "",
      bio: "",
      interests: [],
    },
  });

  const onSubmit = (data: ExampleFormValues) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {/* Text Input */}
        <Input<ExampleFormValues>
          name="firstName"
          label="First Name"
          placeholder="Enter your first name"
          required
        />

        {/* Email Input */}
        <Input<ExampleFormValues>
          name="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
        />

        {/* Password Input */}
        <PasswordInput<ExampleFormValues>
          name="password"
          label="Password"
          placeholder="Enter password"
          required
        />

        {/* Select Dropdown */}
        <Select<ExampleFormValues>
          name="country"
          label="Country"
          placeholder="Select a country"
        >
          <option value="">Select a country</option>
          {countries.map((country) => (
            <option key={country.value} value={country.value}>
              {country.label}
            </option>
          ))}
        </Select>

        {/* Textarea */}
        <Textarea<ExampleFormValues>
          name="bio"
          label="Bio"
          placeholder="Tell us about yourself..."
        />

        {/* Multi-Select */}
        <MultiSelect<ExampleFormValues>
          name="interests"
          label="Interests"
          options={interests}
          placeholder="Select your interests"
        />

        {/* Submit Button */}
        <Submit>Submit Form</Submit>
      </form>
    </FormProvider>
  );
}
