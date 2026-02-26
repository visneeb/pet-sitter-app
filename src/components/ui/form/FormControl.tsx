"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { useFormField } from "./FormField";
import { AlertCircle } from "lucide-react";
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
        <AlertCircle
          size={18}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-red pointer-events-none"
        />
      )}
    </div>
  );
}
