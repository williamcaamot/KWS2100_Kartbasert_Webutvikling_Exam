import React from "react";
// Source: https://reactsvgicons.com/search?q=layer (reset icon)
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
      <g
          fill="none"
          fillRule="evenodd"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
        <path d="M3.578 6.487A8 8 0 112.5 10.5M7.5 6.5h-4v-4" />
      </g>
    </svg>
  );
};

export default ResetIcon;
