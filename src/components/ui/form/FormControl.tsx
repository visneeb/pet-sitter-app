"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { useFormField } from "./FormField";
import { ExclamationCircleIcon } from "@/assets/icons/components";
import { FormControlProps } from "@/types/formType";

export function FormControl({
  children,
  className,
  inputClassName,
  noErrorIcon,
}: FormControlProps) {
  const { inputId, descriptionId, messageId, error, disabled } = useFormField();

  const child = React.Children.only(children) as React.ReactElement<any>;

  const showErrorIcon = Boolean(error && !noErrorIcon);

  const sharedProps = {
    id: child.props.id ?? inputId,
    disabled: child.props.disabled ?? disabled,
    "aria-invalid":
      child.props["aria-invalid"] ?? (error ? true : undefined),
    "aria-describedby":
      child.props["aria-describedby"] ??
      (error ? messageId : descriptionId),
    className: cn(
      child.props.className,
      inputClassName,
      showErrorIcon && "!border-transparent",
      error && noErrorIcon && "border-red pr-10",
    ),
  };

  // Keep the same wrapper depth whether or not there is an error so the
  // controlled input (e.g. under Controller) is not remounted when error toggles.
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "relative rounded-lg",
          showErrorIcon &&
            "form-control-error-wrapper border border-red pr-10",
        )}
      >
        {React.cloneElement(child, sharedProps)}
        {showErrorIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="bg-red rounded-full flex items-center justify-center">
              <ExclamationCircleIcon
                primaryColor="white"
                secondaryColor="red"
                size={18}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
