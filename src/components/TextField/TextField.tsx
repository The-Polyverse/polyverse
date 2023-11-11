import { HTMLAttributes, useRef } from "react";
import type { AriaTextFieldProps } from "react-aria";
import { useTextField } from "react-aria";

export type TextFieldProps = AriaTextFieldProps & HTMLAttributes<HTMLInputElement>;

export default function TextField(props: TextFieldProps) {
  const { label, description } = props;
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
