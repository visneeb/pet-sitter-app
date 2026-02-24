import React from "react";
import type { SVGProps } from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  primaryColor?: string;
  secondaryColor?: string;
};

export function createIcon(children: React.ReactNode) {
  return function Icon({
    size = 24,
    primaryColor = "currentColor",
    secondaryColor = "currentColor",
    className,
    ...props
  }: IconProps) {
    const paths = React.Children.toArray(children).flatMap((child) => {
      if (React.isValidElement(child) && child.type === React.Fragment) {
        return React.Children.toArray(
          (child.props as { children?: React.ReactNode }).children
        );
      }
      return [child];
    });

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
        {paths.map((child, index) => {
          if (!React.isValidElement(child)) return child;
          return React.cloneElement(child as React.ReactElement<{ fill?: string }>, {
            fill: index === 0 ? secondaryColor : primaryColor,
          });
        })}
      </svg>
    );
  };
}
