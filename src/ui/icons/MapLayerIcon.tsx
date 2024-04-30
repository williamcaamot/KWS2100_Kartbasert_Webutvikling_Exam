import React from "react";
// Source: https://reactsvgicons.com/search?q=layer

interface MapLayerIconProps {
  size?: number;
  color?: string;
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
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
};

export default MapLayerIcon;
