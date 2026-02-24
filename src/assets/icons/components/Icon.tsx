import type { SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function createIcon(
  paths: React.ReactNode,
  options?: { stroke?: boolean }
) {
  return function Icon({
    size = 24,
    className,
    ...props
  }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
        {...props}
      >
        {paths}
      </svg>
    );
  };
}
