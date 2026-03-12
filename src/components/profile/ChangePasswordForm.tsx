"use client";

import { Password } from "../ui/input/Password";
import { ActionButton } from "../ui/Button";
import { useChangePassword } from "@/hooks/profile/useChangePassword";


export default function ChangePasswordForm() {
    const { form, error, loading, handleChange, handleSubmit } =
      useChangePassword();
  
    return (
      <div className="space-y-8">
        <h1 className="text-[headline-3] font-bold leading-[48px]">
          Change Password
        </h1>
  
        <div className="max-w-[440px] space-y-6">
          <div className="space-y-2">
            <label htmlFor="oldPassword" className="style-body-2 block text-[body-2] font-[var(--font-weight-body)">
              Current Password
            </label>
            <Password
              id="oldPassword"
              value={form.oldPassword}
              onChange={(e) => handleChange("oldPassword", e.target.value)}
              hasError={!!error.oldPassword}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
            {error.oldPassword && (
              <p className="text-sm text-red-500">{error.oldPassword}</p>
            )}
          </div>
  
          <div className="space-y-2">
            <label htmlFor="newPassword" className="style-body-2 block text-[body-2] font-[var(--font-weight-body)">
              New Password
            </label>
            <Password
              id="newPassword"
              value={form.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              hasError={!!error.newPassword}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            {error.newPassword && (
              <p className="text-sm text-red-500">{error.newPassword}</p>
            )}
          </div>
  
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="style-body-2 block text-[body-2] font-[var(--font-weight-body)">
              Confirm Password
            </label>
            <Password
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              hasError={!!error.confirmPassword}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            {error.confirmPassword && (
              <p className="text-sm text-red-500">{error.confirmPassword}</p>
            )}
          </div>
        </div>
  
        <div className="flex justify-end">
          <ActionButton
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
            className="min-w-[199px]"
          >
            {loading ? "Changing..." : "Change Password"}
          </ActionButton>
        </div>
      </div>
    );
  }