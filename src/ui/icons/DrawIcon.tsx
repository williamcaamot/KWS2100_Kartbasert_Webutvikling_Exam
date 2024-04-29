import React from "react";

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
      {/* Pencil Tip */}
      <path d="M12 2l-2 2 5 5 2-2-5-5z" />
      {/* Pencil Body */}
      <path d="M12 2l5 5 5-5-5-5-5 5z" fill={color} />
      {/* Drawing Line */}
      <path d="M17 7l5 5-5-5z" fill={color} />
      {/* Dotted Grid Background */}
      <path
        d="M2 22h2v-2H2v2zm4 0h2v-2H6v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2zm4 0h2v-2h-2v2z"
        fill={color}
      />
    </svg>
  );
};

export default DrawingIcon;
