import React from "react";

//Source: https://reactsvgicons.com/search?q=layer (location icon)

interface MapResultIcon {
  size?: number; // Optional size prop to customize the icon size
  color?: string; // Optional color prop to customize the icon color
}

const MapResultIcon: React.FC<MapResultIcon> = ({
  size = 18,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      stroke={color}
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.64 16.36a9 9 0 1112.72 0l-5.65 5.66a1 1 0 01-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 10-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
  );
};

export default MapResultIcon;
