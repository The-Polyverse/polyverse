import { useRef } from "react";
import { useLink } from "react-aria";

export type LinkProps = {
  href: string;
  children: React.ReactNode;
};

export default function Link({ children, ...props }: LinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { linkProps } = useLink({ ...props }, ref);

  return (
    <a {...linkProps} ref={ref}>
      {children}
    </a>
  );
}
