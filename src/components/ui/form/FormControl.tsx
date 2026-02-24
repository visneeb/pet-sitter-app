"use client";

import * as React from "react";
import cn from "@/utils/cn";
import { useFormField } from "./FormField";

type Props = React.ComponentPropsWithoutRef<"input"> & {
  asChild?: boolean;
  children?: React.ReactElement;
};

export function FormControl({ asChild, children, className, ...props }: Props) {
  const { id, error, disabled } = useFormField();

  if (asChild && children) {
    return React.cloneElement(children, {
      id,
      disabled,
      "aria-invalid": error,
      className: cn(children.props.className, className),
    });
  }

  return (
    <input
      id={id}
      disabled={disabled}
      aria-invalid={error}
      className={className}
      {...props}
    />
  );
}
