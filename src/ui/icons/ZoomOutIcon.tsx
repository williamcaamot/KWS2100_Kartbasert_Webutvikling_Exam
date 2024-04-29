import React from "react";
const ZoomOutIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 38,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="black"
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="11" width="14" height="0.5"></rect> {/* Horizontal Line */}
    </svg>
  );
};

export default ZoomOutIcon;
