import React from "react";

interface SettingsIconProps {
  size?: number;
  color?: string;
}

const SettingsIcon: React.FC<SettingsIconProps> = ({
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
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 .9A1.65 1.65 0 0 1 12 20a1.65 1.65 0 0 1-1.09-.44 1.65 1.65 0 0 0-1-.9 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-.9-1A1.65 1.65 0 0 1 4 12a1.65 1.65 0 0 1 .44-1.09 1.65 1.65 0 0 0 .9-1 1.65 1.65 0 0 0-.33-1.82L5 8.03a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-.9A1.65 1.65 0 0 1 12 4c.38 0 .73.15 1 .44a1.65 1.65 0 0 0 1 .9 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 .9 1c.29.32.44.67.44 1.09a1.65 1.65 0 0 1-.44 1.09 1.65 1.65 0 0 0-.9 1z"></path>
    </svg>
  );
};

export default SettingsIcon;
