import { Input, PasswordInput, Submit } from "@/components/form/index";
import { RegisterFormValues } from "@/types/authType";
import { useFormContext } from "react-hook-form";

export function RegisterFields() {
  const {
    formState: { isSubmitting },
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
        />
      </div>

      {/* Phone */}
      <div className="mb-4">
        <Input
          name="phone"
          type="tel"
          label="Phone"
          placeholder="Your phone number"
        />
      </div>

      {/* Password */}
      <div className="mb-6">
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Create your password"
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
