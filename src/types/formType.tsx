import React from "react";

type FormFieldState = {
  name: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

export type FormFieldContextType = FormFieldState & {
  inputId: string;
  descriptionId: string;
  messageId: string;
};

export type FormFieldProviderProps = FormFieldState & {
  children: React.ReactNode;
  className?: string;
};

export type FormControlProps = {
  children: React.ReactElement<any>;
  className?: string;
  inputClassName?: string;
  noErrorIcon?: boolean;
};

export type FormDescriptionProps = {
  children?: React.ReactNode;
  className?: string;
};
