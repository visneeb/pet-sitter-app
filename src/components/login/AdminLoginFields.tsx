import Link from "next/link";
import { useFormContext } from "react-hook-form";
import { Input, PasswordInput, Submit } from "@/components/form/index";
import { LoginFormValues } from "@/types/authType";

export function LoginFields() {
  const {
    register,
    formState: { errors, isSubmitting },
  } = useFormContext<LoginFormValues>();

  return (
    <>
      <div className="mb-4">
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="email@company.com"
          error={errors.email?.message}
        />
      </div>
      <div className="mb-2">
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
        />
      </div>
      <div className="w-full">
        <Submit disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Login"}
        </Submit>
      </div>
    </>
  );
}
