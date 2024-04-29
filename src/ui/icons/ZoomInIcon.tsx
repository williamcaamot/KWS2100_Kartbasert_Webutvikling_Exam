import React from "react";
const ZoomInIcon: React.FC<{ size?: number; color?: string }> = ({
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
      <rect x="4.5" y="11" width="14" height="0.5"></rect>{" "}
      {/* Horizontal Line */}
      <rect x="11" y="4.5" width="0.5" height="14"></rect> {/* Vertical Line */}
    </svg>
  );
};

export default ZoomInIcon;
