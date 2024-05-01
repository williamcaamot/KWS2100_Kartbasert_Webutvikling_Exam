import React, { useContext, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Switch from "../../ui/switch";
import { MapContext } from "../map/mapContext";

const Settings = () => {
  const { settings, setSettings } = useContext(MapContext);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.theme === "dark");

  const switchToLightMode = () => {
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    setIsDarkMode(false);
  };

  const switchToDarkMode = () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    setIsDarkMode(true);
  };

  const toggleTheme = () => {
    if (isDarkMode) {
      switchToLightMode();
    } else {
      switchToDarkMode();
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDarkMode(localStorage.theme === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleZoomSlider = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      showZoomSlider: !prevSettings.showZoomSlider,
    }));
  };
  const toggleMiniMap = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      showMiniMap: !prevSettings.showMiniMap,
    }));
  };
  const toggleScaleline = () => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      showScaleline: !prevSettings.showScaleline,
    }));
  };

  return (
    <>
      <div className={"md:flex hidden flex w-full justify-around p-1"}>
        <p>Vis zoomslider</p>
        <div className={"flex-1"}></div>
        <Switch checked={settings.showZoomSlider} onChange={toggleZoomSlider} />
      </div>
      <div className={"flex w-full justify-around p-1"}>
        <p>Vis map overview map</p>
        <div className={"flex-1"}></div>
        <Switch checked={settings.showMiniMap} onChange={toggleMiniMap} />
      </div>
      <div className={"flex w-full justify-around p-1"}>
        <p>Vis scaleline</p>
        <div className={"flex-1"}></div>
        <Switch checked={settings.showScaleline} onChange={toggleScaleline} />
      </div>
      <div className={"flex w-full justify-around p-1"}>
        <p>Dark mode</p>
        <div className={"flex-1"}></div>
        <Switch checked={isDarkMode} onChange={toggleTheme} />
      </div>
    </>
  );
};

export default Settings;
