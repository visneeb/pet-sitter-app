import * as React from "react";

type DecorativeSvgProps = React.SVGProps<SVGSVGElement> & {
  bgClassName?: string;
  dotClassName?: string;
};

export function Dots({
  className,
  bgClassName = "text-gray-100",
  dotClassName = "text-sky-400",
  ...props
}: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 79 44"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* background */}
      <g className={bgClassName}>
        <rect width="79" height="44" rx="22" fill="currentColor" />
      </g>

      {/* dots */}
      <g className={dotClassName}>
        <circle cx="51" cy="22" r="7" fill="currentColor" />
        <circle cx="28" cy="22" r="7" fill="currentColor" />
      </g>
    </svg>
  );
}
