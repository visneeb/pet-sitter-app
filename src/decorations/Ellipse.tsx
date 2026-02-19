import * as React from "react";

type EllipseProps = React.SVGProps<SVGSVGElement>;

export function FullEllipse({ className, ...props }: EllipseProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <ellipse cx="60" cy="60" rx="60" ry="60" />
    </svg>
  );
}

export function HalfEllipse({ className, ...props }: EllipseProps) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 337 168"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M0 168C1.06582e-06 123.444 17.7526 80.7122 49.3524 49.2061C80.9523 17.7 123.811 5.54167e-05 168.5 1.3013e-10C213.189 -5.54164e-05 256.047 17.6998 287.647 49.2058C319.247 80.7119 337 123.443 337 168L222.225 168C222.225 153.793 216.565 140.169 206.489 130.123C196.414 120.078 182.749 114.434 168.5 114.434C154.251 114.434 140.586 120.078 130.511 130.123C120.435 140.169 114.775 153.794 114.775 168H0Z" />
    </svg>
  );
}

export function EllipseSector({ className, ...props }: EllipseProps) {
  return (
    <svg
      viewBox="0 0 216 253"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M89.4492 0C110.252 2.48074e-07 130.734 5.13047 149.081 14.937C167.428 24.7434 183.073 38.9233 194.63 56.2204C206.188 73.5175 213.301 93.3979 215.34 114.101C217.379 134.804 214.281 155.69 206.32 174.909C198.359 194.129 185.781 211.088 169.7 224.286C153.619 237.483 134.531 246.511 114.128 250.569C93.7249 254.628 72.6355 253.592 52.7282 247.553C32.821 241.514 14.7102 230.659 0.000236511 215.949L89.4492 126.5V0Z" />
    </svg>
  );
}

export function QuadrantEllipse({ className, ...props }: EllipseProps) {
  return (
    <svg
      viewBox="0 0 118 118"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path d="M0 117.5C3.68009e-07 102.07 3.03923 86.7905 8.94416 72.5347C14.8491 58.2789 23.5041 45.3258 34.415 34.4149C45.3258 23.5041 58.279 14.8491 72.5347 8.94415C86.7905 3.03922 102.07 -2.88193e-06 117.5 0L117.5 77.3354C112.226 77.3354 107.003 78.3742 102.13 80.3927C97.2567 82.4112 92.8289 85.3697 89.0993 89.0993C85.3697 92.8289 82.4112 97.2566 80.3927 102.13C78.3742 107.003 77.3353 112.226 77.3353 117.5H0Z" />
    </svg>
  );
}
