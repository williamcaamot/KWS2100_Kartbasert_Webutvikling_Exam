import React, { useContext } from "react";
import useLocalStorageState from "use-local-storage-state";
import Switch from "../../ui/switch";
import { MapContext } from "../map/mapContext";

const Settings = () => {
  const { settings, setSettings } = useContext(MapContext);

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

  return (
    <>
      <div className={"flex w-full justify-around p-1"}>
        <p>Show zoomslider</p>
        <div className={"flex-1"}></div>
        <Switch checked={settings.showZoomSlider} onChange={toggleZoomSlider} />
      </div>
      <div className={"flex w-full justify-around p-1"}>
        <p>Show minimap</p>
        <div className={"flex-1"}></div>
        <Switch checked={settings.showMiniMap} onChange={toggleMiniMap} />
      </div>
    </>
  );
};

export default Settings;
