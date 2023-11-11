import { useRef } from "react";
import type { AriaTextFieldProps } from "react-aria";
import { useTextField } from "react-aria";

export type TextFieldProps = {
  children?: React.ReactNode;
  [key: string]: unknown;
} & AriaTextFieldProps;

export default function TextField({ label, description, ...props }: TextFieldProps) {
  const ref = useRef<HTMLInputElement>(null);
  const {
    labelProps,
    inputProps,
    descriptionProps,
    errorMessageProps,
    isInvalid,
    validationErrors,
  } = useTextField(props, ref);

  return (
    <label {...labelProps}>
      {label}
      <input {...inputProps} ref={ref} />
      {description && (
        <span {...descriptionProps}>{description}</span>
      )}
      {isInvalid && (
        <span {...errorMessageProps}>{validationErrors.join(" ")}</span>
      )}
    </label>
  );
}
