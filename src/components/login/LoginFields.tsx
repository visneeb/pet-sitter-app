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

      <div className="mb-6 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            {...register("remember")}
            disabled={isSubmitting}
            className="h-4 w-4 rounded border-gray-300"
          />
          Remember?
        </label>

        <Link
          href="/forgot-password"
          className="text-sm text-orange-500 font-semibold hover:underline"
        >
          Forget Password?
        </Link>
      </div>

      <div className="w-full">
        <Submit disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Logging in..." : "Login"}
        </Submit>
      </div>
    </>
  );
}