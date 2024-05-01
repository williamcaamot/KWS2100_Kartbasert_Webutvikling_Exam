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
import { useActiveFeatures } from "../map/useActiveFeatures";

import { MapContext } from "../map/mapContext";
import Sidebar from "../../ui/Sidebar";
import "ol/ol.css";
import "./application.css";
import CustomZoomAndLocation from "../../ui/CustomZoomAndLocation";
import useLocalStorageState from "use-local-storage-state";
import TileSource from "ol/source/Tile";
import { OverviewMap, ScaleLine } from "ol/control";

// TODO: Fikse at kart lastes inn umiddelbart slik man slipper å "dra" på kartet litt før det laster
export function Application() {
  useGeographic();
  //Heihei
  const mapRef = useRef() as MutableRefObject<HTMLDivElement>;
  const mapInstance = useRef<Map | null>(null);
  const [settings, setSettings] = useLocalStorageState("settings", {
    defaultValue: {
      showZoomSlider: true,
      showMiniMap: true,
      showScaleline: false,
      isDarkMode: true,
    },
  });

  // UseEffect som sjekker om brukeren har satt dark mode som preferanse og om systemet er satt til dark mode
  // TODO: Fikse at den huker av riktig knapp i settings ut ifra hvilken theme som er satt i localstorage når man laster inn siden
  useEffect(() => {
    // Check if the user has a dark mode preference and it's set to dark
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      // Add the 'dark' class to the root element
      document.documentElement.classList.add("dark");
    } else {
      // Remove the 'dark' class from the root element
      document.documentElement.classList.remove("dark");
    }

    // Listen for changes to the user's dark mode preference
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const newColorScheme = e.matches ? "dark" : "light";

        // Add or remove the 'dark' class based on the new color scheme
        if (newColorScheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      });

    map?.setTarget(mapRef.current);
  }, []);

  const [view, setView] = useState(new View({ center: [10, 59], zoom: 8 }));
  useEffect(() => map.setView(view), [view]);

  if (!mapInstance.current) {
    mapInstance.current = new Map({
      view: view,
    });
  }
  const map = mapInstance.current;

  const [vectorLayers, setVectorLayers] = useState<Layer[]>([]);
  const [baseLayer, setBaseLayer] = useState<Layer>(
    () => new TileLayer({ source: new OSM(), preload: Infinity }),
  );

  useEffect(() => {
    const projection = baseLayer?.getSource()?.getProjection();
    if (projection) {
      setView(
        (oldView) =>
          new View({
            center: oldView.getCenter(),
            zoom: oldView.getZoom(),
            projection,
          }),
      );
    }
  }, [baseLayer]);

  const allLayers = useMemo(
    () => [baseLayer, ...vectorLayers],
    [baseLayer, vectorLayers],
  );

  const predicate = (l: Layer) => vectorLayers.includes(l);
  const { activeFeatures, setActiveFeatures } = useActiveFeatures(predicate);

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
    if (settings.showScaleline) {
      map?.addControl(
        new ScaleLine({
          units: "metric",
        }),
      );
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
        {/*This div works as a block beneath the menu, since the menu is actually an overlay...*/}
        <div
          style={{ width: "83px", height: "100%", backgroundColor: "white" }}
        />
        <div ref={mapRef} style={{ height: "100%", width: "100%" }}></div>
      </main>
    </MapContext.Provider>
  );
}
