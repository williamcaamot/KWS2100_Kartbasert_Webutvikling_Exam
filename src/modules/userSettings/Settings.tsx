import React, { useContext, useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import Switch from "../../ui/switch";
import { MapContext } from "../map/mapContext";

const Settings = () => {
  const { settings, setSettings } = useContext(MapContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    function detectSystemColorScheme(): string {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setDarkMode(true);
        return "dark";
      } else {
        setDarkMode(false);
        return "light";
      }
    }
    const systemColorScheme = detectSystemColorScheme();
    console.log("System color scheme:", systemColorScheme);
  }, []);

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

  useEffect(() => {
    const handleStorageChange = () => {
      setIsDarkMode(localStorage.theme === "dark");
    };

    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [isDarkMode]);

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

  const toggleTheme = () => {
    setIsDarkMode((prevSettings) => {
      const newMode = !prevSettings;
      if (newMode) {
        switchToDarkMode();
      } else {
        switchToLightMode();
      }
      setDarkMode(newMode);
      return newMode;
    });
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
        <Switch checked={darkMode} onChange={toggleTheme} />{" "}
      </div>
    </>
  );
};

export default Settings;
