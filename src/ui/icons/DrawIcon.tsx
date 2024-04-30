import React from "react";

//Source: https://reactsvgicons.com/search?q=layer (draw icon)

interface DrawingIconProps {
  size?: number;
  color?: string;
}

const DrawingIcon: React.FC<DrawingIconProps> = ({
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
      <path d="M8.5 3A5.5 5.5 0 0114 8.5c0 1.33-.47 2.55-1.26 3.5H21v9h-9v-8.26c-.95.79-2.17 1.26-3.5 1.26A5.5 5.5 0 013 8.5 5.5 5.5 0 018.5 3z" />
    </svg>
  );
};

export default DrawingIcon;
