import { useRef } from "react";
import { useLink } from "react-aria";

export type LinkProps = {
  children: React.ReactNode;
  [key: string]: unknown;
}

export default function Link({ children, ...props }: LinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink({ ...props }, ref);

  return (
    <a {...linkProps} ref={ref}>
      {children}
    </a>
  );
}
