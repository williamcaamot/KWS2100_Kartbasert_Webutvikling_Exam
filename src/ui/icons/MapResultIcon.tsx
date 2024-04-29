import React from "react";

interface MapResultIcon {
  size?: number; // Optional size prop to customize the icon size
  color?: string; // Optional color prop to customize the icon color
}

const MapResultIcon: React.FC<MapResultIcon> = ({
  size = 18,
  color = "gray",
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
      <circle cx="12" cy="10" r="3" />
      <path d="M12 2s9 4 9 10-4.5 10-9 10S3 16 3 12 12 2 12 2z" />
    </svg>
  );
};

export default MapResultIcon;
