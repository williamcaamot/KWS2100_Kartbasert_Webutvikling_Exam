import React, {
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import { Map, View } from "ol";
import { ZoomSlider } from "ol/control.js";
import { Layer } from "ol/layer";

import { MapContext } from "../map/mapContext";
import Sidebar from "../../ui/Sidebar";
import "ol/ol.css";
import "./application.css";
import CustomZoomAndLocation from "../../ui/CustomZoomAndLocation";
import useLocalStorageState from "use-local-storage-state";
import TileSource from "ol/source/Tile";
import { OverviewMap } from "ol/control";
import { set } from "ol/transform";

export function Application() {
  useGeographic();
  //Heihei
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const mapInstance = useRef<Map | null>(null);
  const [settings, setSettings] = useLocalStorageState("settings", {
    defaultValue: { showZoomSlider: true, showMiniMap: true },
  });

  if (!mapInstance.current) {
    mapInstance.current = new Map({
      view: new View({ center: [11, 60], zoom: 10 }),
    });
  }

  const map = mapInstance.current;
  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const [baseLayer, setBaseLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM(), preload: Infinity }),
  );

  const allLayers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );

  useEffect(() => {
    // Removing all controls and adding new was the only way I could get to work to change the source of the overview map... -W
    // Probably not ideal for performance, will have to try to fix this later if enough time
    const controls = map.getControls().getArray();
    controls.slice().forEach((control) => {
      map.removeControl(control);
    });

    const source = baseLayer.getSource();
    let overviewMapControl;
    if (source instanceof TileSource) {
      overviewMapControl = new OverviewMap({
        layers: [
          new TileLayer({
            source: source,
          }),
        ],
      });
    } else {
      console.log("Cannot add controls");
    }
    if (settings.showZoomSlider) {
      const zoomslider = new ZoomSlider();
      map.addControl(zoomslider); // These also have to be applied every time
    }
    if (overviewMapControl instanceof OverviewMap && settings.showMiniMap) {
      map?.addControl(overviewMapControl);
    }
  }, [baseLayer, settings]);

  useEffect(() => {
    map.setLayers(allLayers);
  }, [allLayers]);

  useEffect(() => map?.setTarget(mapRef.current), []);

  return (
    <MapContext.Provider
      value={{
        map,
        vectorLayers,
        setVectorLayers,
        setBaseLayer,
        settings,
        setSettings,
      }}
    >
      <nav>
        <Sidebar />
        <CustomZoomAndLocation />
      </nav>
      <main style={{ display: "flex", width: "100%", height: "100%" }}>
        <div
          style={{ width: "64px", height: "100%", backgroundColor: "red" }}
        />
        <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
      </main>
    </MapContext.Provider>
  );
}
