import React from "react";

interface PointCreationIconProps {
  size?: number;
  color?: string;
}

const PointCreateIcon: React.FC<PointCreationIconProps> = ({
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
      {/* Map Pin / Marker */}
      <path d="M12 2C8.134 2 5 5.134 5 9c0 5 7 13 7 13s7-8 7-13c0-3.866-3.134-7-7-7z" />
      {/* Pin Hole */}
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
};

export default PointCreateIcon;
