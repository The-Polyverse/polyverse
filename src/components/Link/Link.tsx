import { HTMLAttributes, useRef } from "react";
import { AriaLinkOptions, useLink } from "react-aria";

export type LinkProps = AriaLinkOptions & HTMLAttributes<HTMLAnchorElement>;

export default function Link({ children, ...props }: LinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink({ ...props }, ref);

  return (
    <a {...linkProps} ref={ref}>
      {children}
    </a>
  );
}
