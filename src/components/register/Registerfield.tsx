import { Input, PasswordInput, Submit } from "@/components/form/index";
import { RegisterFormValues } from "@/types/authType";
import { useFormContext } from "react-hook-form";

export function RegisterFields() {
  const {
    formState: { errors, isSubmitting },
    watch,
  } = useFormContext<RegisterFormValues>();

  const role = watch("role");

  return (
    <>
      {/* Email */}
      <div className="mb-4">
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="email@company.com"
          error={errors.email?.message}
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <Input
          name="phone"
          type="tel"
          label="Phone"
          placeholder="Your phone number"
          error={errors.phone?.message}
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Create your password"
          error={errors.password?.message}
        />
      </div>
      <div className="w-full">
        <Submit disabled={isSubmitting} className="w-full">
          {isSubmitting
            ? "Creating account..."
            : `Register as ${role === "owner" ? "Owner" : "Sitter"}`}
        </Submit>
      </div>
    </>
  );
}
