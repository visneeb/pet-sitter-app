import React from "react";

export interface PinMarkerProps extends React.SVGProps<SVGSVGElement> {
  selected?: boolean;
}

export const PinMarker = ({
  selected = false,
  className = "",
  ...props
}: PinMarkerProps) => {
  // Use currentColor for the primary orange, allow overriding via CSS text-color
  const primaryColor = "currentColor";

  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-[#FF7037] text-orange-500 ${className}`}
      {...props}
    >
      <g clipPath="url(#clip0_884_18799)">
        <g filter="url(#filter0_d_884_18799)">
          {/* Base Pin Shape */}
          <path
            d="M44.0013 7.3335C36.2216 7.3335 28.7606 10.424 23.2595 15.925C17.7584 21.4261 14.668 28.8871 14.668 36.6668C14.668 56.4668 40.518 78.8335 41.618 79.7868C42.2821 80.3549 43.1273 80.6671 44.0013 80.6671C44.8753 80.6671 45.7205 80.3549 46.3846 79.7868C47.668 78.8335 73.3346 56.4668 73.3346 36.6668C73.3346 28.8871 70.2442 21.4261 64.7431 15.925C59.242 10.424 51.781 7.3335 44.0013 7.3335Z"
            fill={selected ? primaryColor : "white"}
          />
          {/* Stroke Outline */}
          <path
            d="M44.001 7.8335C51.6481 7.8335 58.9823 10.8715 64.3896 16.2788C69.7968 21.686 72.8349 29.0196 72.835 36.6665C72.835 46.3816 66.5199 56.8055 59.9512 64.981C53.3978 73.1373 46.6917 78.9356 46.0869 79.3853L46.0723 79.396L46.0596 79.4067C45.486 79.8973 44.7558 80.1675 44.001 80.1675C43.3407 80.1674 42.6992 79.9608 42.165 79.5806L41.9434 79.4067C41.385 78.9228 34.6831 73.1208 28.1201 64.981C21.5278 56.8046 15.168 46.3806 15.168 36.6665C15.1681 29.0195 18.2061 21.686 23.6133 16.2788C29.0205 10.8716 36.354 7.83358 44.001 7.8335Z"
            stroke="white"
          />
        </g>
        <g clipPath="url(#clip1_884_18799)">
          {/* Main Paw Pad White Background (Only visible in Selected state to carve out the white paw) */}
          <path
            className={selected ? "" : "hidden"}
            d="M32.7948 33.1647C32.8196 33.1613 32.8445 33.1662 32.8693 33.1665C32.3515 28.2482 35.5105 25.5407 38.6705 25.0718C40.7321 24.7658 42.7287 25.4751 44.0001 26.4918C45.2718 25.4751 47.268 24.7658 49.3297 25.0718C52.4897 25.5407 55.6487 28.2482 55.1309 33.1668C55.1557 33.1665 55.1805 33.1616 55.2054 33.165C57.0992 33.4228 59.9657 35.5379 59.9995 38.9049C60.0494 43.8745 56.5206 45.4335 55.2274 47.994C52.9349 52.533 49.344 54.0703 44.0547 53.9975L43.9452 53.9975C38.6559 54.0703 35.065 52.533 32.7725 47.994C31.4793 45.4335 27.9505 43.8745 28.0004 38.9049C28.0342 35.5379 30.901 33.4228 32.7945 33.1647L32.7948 33.1647Z"
            fill="white"
          />
          {/* Paw Toe 1 */}
          <path
            d="M50.7037 42.3568C49.4252 41.1048 49.6368 38.8429 51.1763 37.3045C52.7158 35.7662 55.0003 35.534 56.2788 36.7859C57.5573 38.0378 57.3457 40.2998 55.8062 41.8382C54.2667 43.3765 51.9822 43.6087 50.7037 42.3568Z"
            fill={primaryColor}
          />
          {/* Paw Toe 2 */}
          <path
            d="M47.0454 35.5673C45.3442 34.9885 44.5421 32.86 45.2538 30.813C45.9656 28.7661 47.9216 27.5759 49.6228 28.1547C51.324 28.7335 52.1262 30.862 51.4144 32.9089C50.7027 34.9559 48.7466 36.1461 47.0454 35.5673Z"
            fill={primaryColor}
          />
          {/* Paw Toe 3 */}
          <path
            d="M32.188 41.8415C30.6485 40.3031 30.4369 38.0412 31.7154 36.7892C32.9939 35.5373 35.2784 35.7695 36.8179 37.3078C38.3574 38.8462 38.569 41.1082 37.2905 42.3601C36.012 43.612 33.7275 43.3798 32.188 41.8415Z"
            fill={primaryColor}
          />
          {/* Paw Toe 4 */}
          <path
            d="M36.582 32.9077C35.8702 30.8607 36.6724 28.7322 38.3736 28.1534C40.0748 27.5746 42.0308 28.7648 42.7426 30.8118C43.4543 32.8587 42.6522 34.9873 40.951 35.566C39.2497 36.1448 37.2937 34.9546 36.582 32.9077Z"
            fill={primaryColor}
          />
          {/* Main Paw Pad - Orange parts */}
          <path
            d="M37.3862 44.3359C37.9555 42.7753 39.0725 42.4991 40.1832 40.647C40.871 39.5001 41.3209 36.3814 44.0006 36.3691C46.68 36.3811 47.1302 39.5001 47.818 40.647C48.9287 42.4991 50.0457 42.7753 50.615 44.3359C50.9277 45.1931 50.6634 45.9551 50.3063 46.5428C49.6898 47.558 47.9418 48.1823 45.9872 47.5786C45.0245 47.2812 44.126 47.245 44.0006 47.2413C43.875 47.245 42.9764 47.2812 42.014 47.5786C40.0594 48.1823 38.3117 47.558 37.6949 46.5428C37.3378 45.9548 37.0735 45.1931 37.3862 44.3359Z"
            fill={primaryColor}
          />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_884_18799"
          x="7.66797"
          y="0.333496"
          width="74.668"
          height="89.3335"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="1" dy="1" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_884_18799"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_884_18799"
            result="shape"
          />
        </filter>
        <clipPath id="clip0_884_18799">
          <rect width="88" height="88" fill="white" />
        </clipPath>
        <clipPath id="clip1_884_18799">
          <rect
            width="32"
            height="29"
            fill="white"
            transform="matrix(-1 -8.74228e-08 -8.74228e-08 1 60 25)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
