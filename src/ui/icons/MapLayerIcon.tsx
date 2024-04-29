import React from "react";

// Define the props for the component, if any
interface MapLayerIconProps {
  size?: number; // Optional size prop to customize the icon size
  color?: string; // Optional color prop to customize the icon color
}

const MapLayerIcon: React.FC<MapLayerIconProps> = ({
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
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
};

export default MapLayerIcon;
