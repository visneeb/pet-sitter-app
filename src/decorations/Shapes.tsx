import * as React from "react";

type DecorativeSvgProps = React.SVGProps<SVGSVGElement>;

export function EllipseCut({ className, ...props }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 253 253"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M253 253V118L109 253H253Z" />
      <path d="M0 126.5C0 196.364 56.636 253 126.5 253C196.364 253 253 196.364 253 126.5C253 56.636 196.364 0 126.5 0C56.636 0 0 56.636 0 126.5ZM188.047 126.5C188.047 160.491 160.491 188.047 126.5 188.047C92.5085 188.047 64.953 160.491 64.953 126.5C64.953 92.5085 92.5085 64.953 126.5 64.953C160.491 64.953 188.047 92.5085 188.047 126.5Z" />
    </svg>
  );
}

export function Star({ className, ...props }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 188 191"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M123.207 -5.45382e-06L136.204 50.0202L187.648 55.406L156.611 96.7228L184.494 140.259L132.794 141.76L116.12 190.662L82.6883 151.217L34.0132 168.662L44.0239 117.974L0.00168601 90.8243L45.9163 67.0621L39.6966 15.7626L86.9405 36.8199L123.207 -5.45382e-06Z" />
    </svg>
  );
}

export function Paw({ className, ...props }: DecorativeSvgProps) {
  return (
    <svg
      viewBox="0 0 163 169"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M123.207 -5.45382e-06L136.204 50.0202L187.648 55.406L156.611 96.7228L184.494 140.259L132.794 141.76L116.12 190.662L82.6883 151.217L34.0132 168.662L44.0239 117.974L0.00168601 90.8243L45.9163 67.0621L39.6966 15.7626L86.9405 36.8199L123.207 -5.45382e-06Z" />
    </svg>
  );
}

