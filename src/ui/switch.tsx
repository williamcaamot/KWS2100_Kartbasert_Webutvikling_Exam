import React, { useState } from "react";

//

interface SwitchProperties {
  onChange: (checked: boolean) => void;
  checked: boolean;
}

export default function Switch({ onChange, checked }: SwitchProperties) {
  const [isEnabled, setIsEnabled] = useState(checked);

  function toggleSwitch() {
    onChange(!isEnabled);
    setIsEnabled(!isEnabled);
  }

  return (
    <div
      className={`relative w-14 h-7 rounded-full p-1 cursor-pointe transition-colors cursor-pointer ${
        isEnabled ? "bg-teal-600" : "bg-gray-300 dark:bg-zinc-600"
      }`}
      onClick={toggleSwitch}
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
          isEnabled ? "translate-x-7" : "translate-x-0"
        }`}
      />
    </div>
  );
}