import { useRef } from "react";
import { useButton } from "react-aria";

export type ButtonProps = {
  children: React.ReactNode;
};

export default function Button({ children, ...props }: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);

  return (
    <button {...buttonProps} ref={ref}>
      {children}
    </button>
  );
}
