import { HTMLAttributes, useRef } from "react";
import { AriaButtonProps, useButton } from "react-aria";

export type ButtonProps = AriaButtonProps & HTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref}>
      {children}
    </button>
  );
}
