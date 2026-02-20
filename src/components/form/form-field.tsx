import { Input } from "../ui/Input";
import { FormFieldProps } from "@/types/formType";

export function FormField({
  id,
  label,
  required,
  error,
  helperText,
  type = "text",
  ...props
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="style-label">
        {label}
        {required && <span>*</span>}
      </label>

      <Input
        id={id}
        name={props.name ?? id}
        type={type}
        aria-invalid={!!error}
        aria-describedby={
          error ? `${id}-error` : helperText ? `${id}-helper` : undefined
        }
        className="h-12"
        {...props}
      />

      {helperText && !error && (
        <p id={`${id}-helper`} >
          {helperText}
        </p>
      )}

    </div>
  );
}
