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

  return (
    <div className={cn("relative", className)}>
      {React.cloneElement(child, {
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
          error && "border-red pr-10",
        ),
      })}

      {error && !noErrorIcon && (
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
  );
}
