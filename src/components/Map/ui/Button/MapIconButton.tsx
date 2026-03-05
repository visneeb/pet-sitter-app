import React from "react";

interface MapIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function MapIconButton({
  children,
  className = "",
  disabled,
  ...props
}: Readonly<MapIconButtonProps>) {
  return (
    <button
      disabled={disabled}
      className={`w-10 h-10 bg-white flex items-center justify-center rounded-lg shadow-md border-none transition-colors
        ${disabled ? "cursor-wait opacity-80" : "cursor-pointer hover:bg-gray-50"} 
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
