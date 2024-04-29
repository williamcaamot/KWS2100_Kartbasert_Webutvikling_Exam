import React from "react";

interface ResetIconProps {
  size?: number;
  color?: string;
}

const ResetIcon: React.FC<ResetIconProps> = ({
  size = 38,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 4v6h6" />
      <path d="M23 20v-6h-6" />
      <path d="M20.49 9A9 9 0 0 0 5 5l-1 1" />
      <path d="M3.51 15A9 9 0 0 0 19 19l1-1" />
    </svg>
  );
};

export default ResetIcon;
